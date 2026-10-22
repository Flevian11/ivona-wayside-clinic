<?php

namespace App\Services\Integrations;

use App\Models\ApiIntegration;
use App\Models\ApiIntegrationEnvironment;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/** Central outbound integration gateway used by HMIS modules. */
class EnvironmentAwareIntegrationService
{
    public function environment(): string
    {
        $environment = (string) config('integrations.environment', 'development');
        if (! in_array($environment, ['development', 'uat', 'production'], true)) {
            throw new RuntimeException('IWC_INTEGRATION_ENVIRONMENT must be development, uat, or production.');
        }
        return $environment;
    }

    public function isMockMode(): bool { return $this->environment() === 'development'; }

    /** @param array<string,mixed> $payload @param array<string,string> $headers @return array<string,mixed> */
    public function request(string $integrationSlug, string $operation, string $method, string $path, array $payload = [], array $headers = []): array
    {
        $environment = $this->environment();
        if ($environment === 'development') {
            return ['environment' => 'development', 'mock' => true, 'status' => 200, 'body' => $this->mockResponse($integrationSlug, $operation, $payload), 'headers' => ['content-type' => ['application/json'], 'x-iwc-mode' => ['deterministic-mock']]];
        }

        $integration = ApiIntegration::query()->where('slug', $integrationSlug)->where('status', 'active')->first();
        if (! $integration) throw new RuntimeException("Integration [{$integrationSlug}] is missing or inactive.");
        $configuration = $integration->environment($environment);
        if (! $configuration || ! $configuration->enabled || blank($configuration->base_url)) throw new RuntimeException("The {$environment} environment is not enabled or has no base URL.");

        $url = $this->resolveUrl($configuration, $operation, $path, $payload);
        $this->assertPublicHttpsUrl($url);
        $client = Http::acceptJson()->asJson()
            ->connectTimeout((int) config('integrations.connect_timeout_seconds', 5))
            ->timeout((int) config('integrations.timeout_seconds', 20))
            ->withOptions(['verify' => true, 'allow_redirects' => false]);
        $headers = array_merge($headers, $this->authorizationHeaders($configuration));
        if (in_array($configuration->auth_method, ['afyalink_configured_bearer', 'afyalink_signed_jwt'], true) && $configuration->agent_id) $payload['agent'] ??= $configuration->agent_id;
        if ($configuration->facility_id) $headers['X-Facility-Id'] = $configuration->facility_id;
        if ($configuration->facility_id_type) $headers['X-Facility-Id-Type'] = $configuration->facility_id_type;
        $client = $client->withHeaders($headers);
        if (in_array($operation, $configuration->encrypted_operations ?? [], true)) {
            if (strtoupper($method) === 'GET' || strtoupper($method) === 'DELETE') throw new RuntimeException('This operation is configured for encrypted payloads and requires a body-capable HTTP method.');
            if (blank($configuration->provider_public_key)) throw new RuntimeException('This operation requires encryption but the provider public key is not configured.');
            $payload = ['data' => app(AfyaLinkPayloadCipher::class)->encrypt($payload, $configuration->provider_public_key)];
        }

        try {
            $response = match (strtoupper($method)) {
                'GET' => $client->get($url, $payload),
                'POST' => $client->post($url, $payload),
                'PUT' => $client->put($url, $payload),
                'PATCH' => $client->patch($url, $payload),
                'DELETE' => $client->delete($url, $payload),
                default => throw new RuntimeException('Unsupported integration HTTP method.'),
            };
        } catch (ConnectionException $exception) {
            // Never hide live failures by returning a mock response.
            throw new RuntimeException("{$environment} provider connection failed or timed out.", previous: $exception);
        }

        $body = $response->json();
        if (in_array($operation, $configuration->encrypted_operations ?? [], true) && is_array($body) && is_string($body['data'] ?? null)) {
            if (blank($configuration->private_key)) throw new RuntimeException('The provider returned encrypted data but the clinic private key is not configured.');
            $body = app(AfyaLinkPayloadCipher::class)->decrypt($body['data'], $configuration->private_key);
            $decodedBody = json_decode($body, true);
            if (json_last_error() === JSON_ERROR_NONE) $body = $decodedBody;
        } elseif (! is_array($body)) {
            $body = $response->body();
        }
        $responseHeaders = array_intersect_key($response->headers(), array_flip(['content-type', 'x-request-id', 'x-correlation-id']));
        return ['environment' => $environment, 'mock' => false, 'status' => $response->status(), 'body' => $body, 'headers' => $responseHeaders];
    }

    /** Admin console only: call a documented read-only endpoint in the explicitly selected environment. */
    public function testReadOnlyOperation(ApiIntegration $integration, string $environment, string $operation, array $payload): array
    {
        $allowed = ['eligibility.check', 'patient.benefits', 'patient.benefits.interventions', 'patient.benefits.utilization', 'patient.pomsf_balances', 'patient.sub_benefits', 'facility.bed_occupancy'];
        if (! in_array($operation, $allowed, true)) throw new RuntimeException('The console only allows documented read-only API operations.');
        if (! in_array($environment, ['development', 'uat', 'production'], true)) throw new RuntimeException('Invalid integration environment.');
        if ($environment === 'development') {
            return ['environment' => $environment, 'mock' => true, 'status' => 200, 'body' => $this->mockResponse($integration->slug, $operation, $payload), 'headers' => ['content-type' => ['application/json']]];
        }
        $configuration = $integration->environment($environment);
        if (! $configuration || ! $configuration->enabled || blank($configuration->base_url)) throw new RuntimeException("The {$environment} environment is disabled or has no base URL.");
        $url = $this->resolveUrl($configuration, $operation, '', $payload);
        $this->assertPublicHttpsUrl($url);
        $headers = $this->authorizationHeaders($configuration);
        if (in_array($configuration->auth_method, ['afyalink_configured_bearer', 'afyalink_signed_jwt'], true) && $configuration->agent_id) $payload['agent'] ??= $configuration->agent_id;
        if ($configuration->facility_id) $headers['X-Facility-Id'] = $configuration->facility_id;
        if ($configuration->facility_id_type) $headers['X-Facility-Id-Type'] = $configuration->facility_id_type;
        if (in_array($operation, $configuration->encrypted_operations ?? [], true)) throw new RuntimeException('This operation is configured for encrypted request payloads and cannot be tested as a GET request.');
        try {
            $response = Http::acceptJson()->withHeaders($headers)
                ->connectTimeout((int) config('integrations.connect_timeout_seconds', 5))
                ->timeout((int) config('integrations.timeout_seconds', 20))
                ->withOptions(['verify' => true, 'allow_redirects' => false])
                ->get($url, $payload);
        } catch (ConnectionException $exception) {
            throw new RuntimeException("{$environment} read-only endpoint failed or timed out.", previous: $exception);
        }
        $body = $response->json();
        if (! is_array($body)) $body = $response->body();
        return ['environment' => $environment, 'mock' => false, 'status' => $response->status(), 'body' => $body, 'headers' => array_intersect_key($response->headers(), array_flip(['content-type', 'x-request-id', 'x-correlation-id']))];
    }

    private function resolveUrl(ApiIntegrationEnvironment $configuration, string $operation, string $path, array &$payload): string
    {
        $endpoint = ($configuration->endpoint_map ?? [])[$operation] ?? $path;
        if (! is_string($endpoint) || $endpoint === '') throw new RuntimeException("No endpoint is configured for operation [{$operation}].");
        $endpoint = preg_replace_callback('/\\{([A-Za-z][A-Za-z0-9_]*)\\}/', function (array $matches) use (&$payload): string {
            $key = $matches[1];
            if (! array_key_exists($key, $payload) || ! is_scalar($payload[$key])) throw new RuntimeException("Missing required path parameter [{$key}].");
            $value = rawurlencode((string) $payload[$key]);
            unset($payload[$key]);
            return $value;
        }, $endpoint);
        return filter_var($endpoint, FILTER_VALIDATE_URL) ? $endpoint : rtrim((string) $configuration->base_url, '/') . '/' . ltrim($endpoint, '/');
    }

    public function authenticate(ApiIntegrationEnvironment $configuration): string
    {
        return match ($configuration->auth_method) {
            'oauth2_client_credentials' => $this->requestOAuthToken($configuration),
            'afyalink_configured_bearer' => $this->requestAfyaLinkToken($configuration),
            'afyalink_signed_jwt' => $this->createAfyaLinkSignedJwt($configuration),
            default => throw new RuntimeException('The selected authentication method does not use a token endpoint or has no implemented provider adapter.'),
        };
    }

    private function authorizationHeaders(ApiIntegrationEnvironment $configuration): array
    {
        return match ($configuration->auth_method) {
            'none' => [],
            'api_key' => filled($configuration->client_secret) ? ['X-API-Key' => $configuration->client_secret] : throw new RuntimeException('The provider API key is not configured.'),
            'oauth2_client_credentials', 'afyalink_configured_bearer', 'afyalink_signed_jwt' => ['Authorization' => 'Bearer ' . $this->authenticate($configuration)],
            default => throw new RuntimeException('This authentication method requires its documented provider adapter before use.'),
        };
    }

    private function requestOAuthToken(ApiIntegrationEnvironment $configuration): string
    {
        if (blank($configuration->token_url) || blank($configuration->client_id) || blank($configuration->client_secret)) throw new RuntimeException('OAuth token URL, client ID, and client secret are required.');
        $this->assertPublicHttpsUrl($configuration->token_url);
        $response = Http::asForm()->acceptJson()
            ->connectTimeout((int) config('integrations.connect_timeout_seconds', 5))
            ->timeout((int) config('integrations.timeout_seconds', 20))
            ->withOptions(['verify' => true, 'allow_redirects' => false])
            ->post($configuration->token_url, ['grant_type' => 'client_credentials', 'client_id' => $configuration->client_id, 'client_secret' => $configuration->client_secret, 'scope' => implode(' ', $configuration->scopes ?? [])]);
        $token = $response->json('access_token');
        if (! $response->successful() || ! is_string($token) || $token === '') throw new RuntimeException('OAuth token acquisition failed. Provider response and credentials were withheld.');
        return $token;
    }

    private function requestAfyaLinkToken(ApiIntegrationEnvironment $configuration): string
    {
        if (blank($configuration->base_url) || blank($configuration->username) || blank($configuration->password) || blank($configuration->consumer_key)) {
            throw new RuntimeException('AfyaLink requires the issued base URL, API username, API password, and consumer key.');
        }
        // The official AfyaLink guide documents GET {base_url}/v1/hie-auth?key={consumer_key}
        // with HTTP Basic authentication and a JWT returned in response.token.
        $tokenUrl = filled($configuration->token_url)
            ? $configuration->token_url
            : rtrim($configuration->base_url, '/') . '/v1/hie-auth';
        $this->assertPublicHttpsUrl($tokenUrl);
        $response = Http::acceptJson()
            ->withBasicAuth($configuration->username, $configuration->password)
            ->connectTimeout((int) config('integrations.connect_timeout_seconds', 5))
            ->timeout((int) config('integrations.timeout_seconds', 20))
            ->withOptions(['verify' => true, 'allow_redirects' => false])
            ->get($tokenUrl, ['key' => $configuration->consumer_key]);
        $token = $response->json('token');
        if (! $response->successful() || ! is_string($token) || $token === '') throw new RuntimeException('AfyaLink token acquisition failed. Provider response and credentials were withheld.');
        return $token;
    }

    private function createAfyaLinkSignedJwt(ApiIntegrationEnvironment $configuration): string
    {
        $key = $configuration->consumer_key;
        $secret = $configuration->consumer_secret;
        if (blank($key) || blank($secret)) throw new RuntimeException('AfyaLink signed-token authentication requires the issued consumer key and consumer secret.');
        $now = time();
        $encode = static fn (string $value): string => rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
        $header = $encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
        $payload = $encode(json_encode(['key' => $key, 'iat' => $now, 'exp' => $now + 40], JSON_THROW_ON_ERROR));
        $unsigned = $header . '.' . $payload;
        $signature = $encode(hash_hmac('sha256', $unsigned, $secret, true));
        return $unsigned . '.' . $signature;
    }

    private function assertPublicHttpsUrl(string $url): void
    {
        $parts = parse_url($url); $host = strtolower((string) ($parts['host'] ?? ''));
        if (! filter_var($url, FILTER_VALIDATE_URL) || ($parts['scheme'] ?? '') !== 'https' || $host === '') throw new RuntimeException('Live integration endpoints must be valid HTTPS URLs.');
        if (in_array($host, ['localhost', 'localhost.localdomain'], true) || str_ends_with($host, '.local')) throw new RuntimeException('Private and local destinations are blocked for live integrations.');
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $addresses = [$host];
        } else {
            $records = dns_get_record($host, DNS_A | DNS_AAAA) ?: [];
            $addresses = [];
            foreach ($records as $record) {
                if (isset($record['ip'])) $addresses[] = $record['ip'];
                if (isset($record['ipv6'])) $addresses[] = $record['ipv6'];
            }
        }
        if ($addresses === []) throw new RuntimeException('The configured host could not be resolved safely.');
        foreach ($addresses as $ip) {
            if (! filter_var($ip, FILTER_VALIDATE_IP) || ! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) throw new RuntimeException('Private and reserved network destinations are blocked for live integrations.');
        }
    }

    private function mockResponse(string $slug, string $operation, array $payload): array
    {
        $seed = (string) config('integrations.mock_seed', 'ivona-wayside-clinic-dev-v1');
        $reference = strtoupper(substr(hash('sha256', $seed . '|' . $slug . '|' . $operation . '|' . json_encode($payload)), 0, 12));
        return ['mock' => true, 'provider' => $slug, 'operation' => $operation, 'reference' => 'DEV-' . $reference, 'message' => 'Deterministic development fixture. No external provider was contacted and no live record was created.', 'data' => match ($operation) {
            'eligibility.check' => ['eligible' => true, 'status' => 'MOCK_ELIGIBLE', 'member_reference' => 'DEV-MEMBER-0001'],
            'service.verify' => ['verified' => true, 'status' => 'MOCK_VERIFIED'],
            'claim.submit' => ['accepted' => true, 'claim_reference' => 'DEV-CLAIM-' . $reference, 'status' => 'MOCK_RECEIVED'],
            'claim.status' => ['claim_reference' => 'DEV-CLAIM-' . $reference, 'status' => 'MOCK_ADJUDICATED'],
            'facility.lookup' => ['facility_code' => 'DEV-IWC-001', 'status' => 'MOCK_ACTIVE'],
            default => ['status' => 'MOCK_OK'],
        }];
    }
}

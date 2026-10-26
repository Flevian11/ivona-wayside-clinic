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
        if ($operation === 'patient.lookup_by_identifier') {
            if (blank($configuration->agent_id)) throw new RuntimeException("The {$environment} Client Registry agent ID is not configured.");
            $payload['agent'] = $configuration->agent_id;
        } elseif (in_array($configuration->auth_method, ['afyalink_configured_bearer', 'afyalink_signed_jwt'], true) && $configuration->agent_id) {
            $payload['agent'] ??= $configuration->agent_id;
        }
        $url = $this->resolveUrl($configuration, $operation, $path, $payload);
        $this->assertPublicHttpsUrl($url);
        $client = Http::acceptJson()->asJson()
            ->connectTimeout((int) config('integrations.connect_timeout_seconds', 5))
            ->timeout((int) config('integrations.timeout_seconds', 20))
            ->withOptions(['verify' => true, 'allow_redirects' => false]);
        $headers = array_merge($headers, $this->authorizationHeaders($configuration));
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

        $allowedHosts = (array) config('integrations.allowed_hosts', []);
        $hostAllowed = collect($allowedHosts)->contains(static function ($allowedHost) use ($host): bool {
            $allowedHost = strtolower(trim((string) $allowedHost));
            return $allowedHost !== '' && ($host === $allowedHost || str_ends_with($host, '.' . $allowedHost));
        });
        if (! $hostAllowed) {
            throw new RuntimeException('The live integration host is not in IWC_INTEGRATION_ALLOWED_HOSTS. Add the authority-issued host explicitly before enabling this environment.');
        }

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
        $fixtures = (array) config('integration_mock_fixtures', []);

        // Registry fixtures use synthetic test tokens only. Accept the legacy internal
        // lookup fields and the catalog's documented Client Registry query parameter `id`.
        if ($operation === 'patient.lookup_by_identifier') {
            $idNumber = strtoupper(trim((string) ($payload['id'] ?? $payload['identification_number'] ?? '')));
            $patients = (array) ($fixtures['patients'] ?? []);

            // Stable aliases used by the patient-registration screen and its test guide.
            // They map to synthetic fixture records only; they are not SHA identifiers.
            $fixtureAliases = [
                'DEV-PRINCIPAL-001' => 'DEV-NID-1001',
                'DEV-CR-001' => 'DEV-NID-1001',
            ];
            $lookupKey = $fixtureAliases[$idNumber] ?? $idNumber;
            $record = (array) ($patients[$lookupKey] ?? []);

            // The dependant alias resolves to the first confirmed dependant in the four-child
            // principal fixture, returned as a synthetic Patient-like record with provenance.
            if ($record === [] && $idNumber === 'DEV-DEPENDANT-001') {
                $principal = (array) ($patients['DEV-NID-1001'] ?? []);
                $dependant = (array) ($principal['dependants'][0]['result'][0] ?? []);
                if ($dependant !== []) {
                    $record = [
                        'id' => $dependant['id'], 'resourceType' => 'Patient',
                        'identification_type' => 'ClientRegistry ID', 'identification_number' => 'DEV-DEPENDANT-001',
                        'first_name' => $dependant['first_name'] ?? null,
                        'middle_name' => $dependant['middle_name'] ?? null,
                        'last_name' => $dependant['last_name'] ?? null,
                        'date_of_birth' => $dependant['date_of_birth'] ?? null,
                        'gender' => $dependant['gender'] ?? 'unknown',
                        'relationship' => $dependant['relationship'] ?? 'unknown',
                        'related_to' => $principal['id'] ?? null,
                        'relationship_status' => $dependant['relationship_status'] ?? 'unconfirmed',
                        'dependants' => [], 'unconfirmed_dependants' => [],
                        'mock' => true, 'fixture_id' => 'FIXTURE-DEPENDANT-ALIAS',
                    ];
                }
            }
            // Resolve dependant Client Registry IDs returned by the principal fixture.
            // This is essential because the registration submit re-fetches both records server-side.
            if ($record === []) {
                foreach ($patients as $principal) {
                    if (! is_array($principal)) continue;
                    foreach (['dependants', 'unconfirmed_dependants'] as $groupName) {
                        foreach ((array) ($principal[$groupName] ?? []) as $group) {
                            if (! is_array($group)) continue;
                            $items = isset($group['result']) && is_array($group['result']) ? $group['result'] : [$group];
                            foreach ($items as $dependent) {
                                if (! is_array($dependent) || strtoupper((string) ($dependent['id'] ?? '')) !== $idNumber) continue;
                                $record = [
                                    'id' => (string) $dependent['id'],
                                    'resourceType' => 'Patient',
                                    'identification_type' => 'ClientRegistry ID',
                                    'identification_number' => (string) $dependent['id'],
                                    'first_name' => $dependent['first_name'] ?? null,
                                    'middle_name' => $dependent['middle_name'] ?? null,
                                    'last_name' => $dependent['last_name'] ?? null,
                                    'date_of_birth' => $dependent['date_of_birth'] ?? null,
                                    'gender' => $dependent['gender'] ?? 'unknown',
                                    'relationship' => $dependent['relationship'] ?? 'unknown',
                                    'related_to' => $principal['id'] ?? null,
                                    'relationship_status' => $dependent['relationship_status'] ?? ($groupName === 'dependants' ? 'confirmed' : 'unconfirmed'),
                                    'dependants' => [],
                                    'unconfirmed_dependants' => [],
                                    'mock' => true,
                                    'fixture_id' => 'SYNTHETIC-DEPENDANT',
                                ];
                                break 3;
                            }
                        }
                    }
                    if ($record !== []) break;
                }
            }

            if ($record !== []) {
                $record['mock'] = true;
                $record['note'] = 'Synthetic fixture only. No SHA/DHA provider was contacted; this is not a real patient record.';
                return $record;
            }
            return [
                'id' => null,
                'message' => ['total' => 0, 'result' => []],
                'mock' => true,
                'note' => 'No synthetic Client Registry fixture matches this identifier. No provider was contacted.',
            ];
        }

        if ($operation === 'patient.benefits') {
            // Patient-specific synthetic fixtures: never return the same benefit list for every registry ID.
            $patientId = strtoupper(trim((string) ($payload['patient_id'] ?? '')));
            $benefitSets = [
                'DEV-CR-001' => [
                    ['code' => 'DEV-001-OPD', 'name' => 'Outpatient care', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-001-OPD'],
                    ['code' => 'DEV-001-IPD', 'name' => 'Inpatient care', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-001-IPD'],
                    ['code' => 'DEV-001-EMERGENCY', 'name' => 'Emergency services', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-001-ER'],
                ],
                'DEV-CR-002' => [
                    ['code' => 'DEV-002-OPD', 'name' => 'Outpatient care', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-002-OPD'],
                    ['code' => 'DEV-002-MAT', 'name' => 'Maternity care', 'description' => 'Synthetic patient-specific maternity scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-002-MAT'],
                ],
                'DEV-CR-003' => [
                    ['code' => 'DEV-003-MAT', 'name' => 'Maternity care', 'description' => 'Synthetic patient-specific maternity scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-003-MAT'],
                    ['code' => 'DEV-003-IPD', 'name' => 'Inpatient care', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-003-IPD'],
                    ['code' => 'DEV-003-OPD', 'name' => 'Outpatient care', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-003-OPD'],
                ],
                'DEV-CR-004' => [
                    ['code' => 'DEV-004-OPD', 'name' => 'Outpatient care', 'description' => 'Synthetic patient-specific benefit scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-004-OPD'],
                ],
                'DEV-CR-005' => [],
                'DEV-DEP-01-01' => [
                    ['code' => 'DEV-001-CHILD-01-OPD', 'name' => 'Child outpatient care', 'description' => 'Synthetic dependant-specific scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-DEP-01-01-OPD'],
                ],
                'DEV-DEP-01-02' => [
                    ['code' => 'DEV-001-CHILD-02-OPD', 'name' => 'Child outpatient care', 'description' => 'Synthetic dependant-specific scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-DEP-01-02-OPD'],
                    ['code' => 'DEV-001-CHILD-02-IPD', 'name' => 'Child inpatient care', 'description' => 'Synthetic dependant-specific scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-DEP-01-02-IPD'],
                ],
                'DEV-DEP-02-01' => [
                    ['code' => 'DEV-002-CHILD-01-OPD', 'name' => 'Child outpatient care', 'description' => 'Synthetic dependant-specific scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-DEP-02-01-OPD'],
                ],
                'DEV-DEP-03-01' => [
                    ['code' => 'DEV-003-CHILD-01-OPD', 'name' => 'Child outpatient care', 'description' => 'Synthetic dependant-specific scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-DEP-03-01-OPD'],
                ],
                'DEV-DEP-03-02' => [
                    ['code' => 'DEV-003-CHILD-02-OPD', 'name' => 'Child outpatient care', 'description' => 'Synthetic dependant-specific scenario.', 'status' => 'DEV_MOCK', 'coverage_reference' => 'DEV-COV-DEP-03-02-OPD'],
                ],
            ];
            // Synthetic dependants inherit only their explicit test fixture scenario, not a universal list.
            $dependentParents = [
                'DEV-DEP-01-01' => 'DEV-CR-001', 'DEV-DEP-01-02' => 'DEV-CR-001', 'DEV-DEP-01-03' => 'DEV-CR-001', 'DEV-DEP-01-04' => 'DEV-CR-001',
                'DEV-DEP-02-01' => 'DEV-CR-002', 'DEV-DEP-03-01' => 'DEV-CR-003', 'DEV-DEP-03-02' => 'DEV-CR-003',
            ];
            $ownerId = array_key_exists($patientId, $benefitSets) ? $patientId : ($dependentParents[$patientId] ?? $patientId);
            $benefitRows = $benefitSets[$ownerId] ?? [];
            if ($benefitRows === [] && str_starts_with($patientId, 'DEV-CR-')) {
                $suffix = substr($patientId, -6);
                $benefitRows = [
                    ['code' => 'DEV-' . $suffix . '-OPD', 'name' => 'Development outpatient care', 'description' => 'Synthetic development benefit; not an SHA entitlement.', 'status' => 'DEV_MOCK'],
                    ['code' => 'DEV-' . $suffix . '-IPD', 'name' => 'Development inpatient care', 'description' => 'Synthetic development benefit; not an SHA entitlement.', 'status' => 'DEV_MOCK'],
                ];
            }
            $benefits = array_map(static fn (array $benefit): array => $benefit + ['mock' => true], $benefitRows);
            return [
                'patient_id' => $patientId,
                'benefits' => $benefits,
                'mock' => true,
                'note' => $benefits === []
                    ? 'No synthetic benefits are configured for this patient fixture. No coverage was inferred.'
                    : 'Patient-specific synthetic development benefits only. These are not official SHA entitlements or coverage determinations.',
            ];
        }
        if ($operation === 'patient.sub_benefits') {
            $patientId = strtoupper(trim((string) ($payload['patient_id'] ?? '')));
            $benefitCode = strtoupper(trim((string) ($payload['benefit_code'] ?? '')));
            $sets = [
                'DEV-001-OPD' => [['code' => 'DEV-001-OPD-CONSULT', 'name' => 'Outpatient consultation', 'status' => 'DEV_MOCK'], ['code' => 'DEV-001-OPD-FOLLOWUP', 'name' => 'Outpatient follow-up', 'status' => 'DEV_MOCK']],
                'DEV-001-IPD' => [['code' => 'DEV-001-IPD-ADMISSION', 'name' => 'Inpatient admission', 'status' => 'DEV_MOCK'], ['code' => 'DEV-001-IPD-WARD', 'name' => 'Ward care', 'status' => 'DEV_MOCK']],
                'DEV-001-EMERGENCY' => [['code' => 'DEV-001-ER-ASSESS', 'name' => 'Emergency assessment', 'status' => 'DEV_MOCK']],
                'DEV-002-OPD' => [['code' => 'DEV-002-OPD-CONSULT', 'name' => 'Outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-002-MAT' => [['code' => 'DEV-002-MAT-ANC', 'name' => 'Antenatal care', 'status' => 'DEV_MOCK'], ['code' => 'DEV-002-MAT-DELIVERY', 'name' => 'Maternity and delivery services', 'status' => 'DEV_MOCK']],
                'DEV-003-MAT' => [['code' => 'DEV-003-MAT-ANC', 'name' => 'Antenatal care', 'status' => 'DEV_MOCK'], ['code' => 'DEV-003-MAT-DELIVERY', 'name' => 'Maternity and delivery services', 'status' => 'DEV_MOCK']],
                'DEV-003-IPD' => [['code' => 'DEV-003-IPD-ADMISSION', 'name' => 'Inpatient admission', 'status' => 'DEV_MOCK']],
                'DEV-003-OPD' => [['code' => 'DEV-003-OPD-CONSULT', 'name' => 'Outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-004-OPD' => [['code' => 'DEV-004-OPD-CONSULT', 'name' => 'Outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-001-CHILD-01-OPD' => [['code' => 'DEV-001-CHILD-01-CONSULT', 'name' => 'Child outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-001-CHILD-02-OPD' => [['code' => 'DEV-001-CHILD-02-CONSULT', 'name' => 'Child outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-001-CHILD-02-IPD' => [['code' => 'DEV-001-CHILD-02-ADMISSION', 'name' => 'Child inpatient admission', 'status' => 'DEV_MOCK']],
                'DEV-002-CHILD-01-OPD' => [['code' => 'DEV-002-CHILD-01-CONSULT', 'name' => 'Child outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-003-CHILD-01-OPD' => [['code' => 'DEV-003-CHILD-01-CONSULT', 'name' => 'Child outpatient consultation', 'status' => 'DEV_MOCK']],
                'DEV-003-CHILD-02-OPD' => [['code' => 'DEV-003-CHILD-02-CONSULT', 'name' => 'Child outpatient consultation', 'status' => 'DEV_MOCK']],
            ];
            $dependentParent = ['DEV-DEP-01-01' => 'DEV-CR-001', 'DEV-DEP-01-02' => 'DEV-CR-001', 'DEV-DEP-01-03' => 'DEV-CR-001', 'DEV-DEP-01-04' => 'DEV-CR-001', 'DEV-DEP-02-01' => 'DEV-CR-002', 'DEV-DEP-03-01' => 'DEV-CR-003', 'DEV-DEP-03-02' => 'DEV-CR-003'];
            $parent = $dependentParent[$patientId] ?? $patientId;
            $benefitOwnerPrefix = str_replace('DEV-CR-', 'DEV-', $parent);
            $subBenefits = $sets[$benefitCode] ?? [];
            if ($subBenefits !== [] && !str_starts_with($benefitCode, $benefitOwnerPrefix)) {
                $subBenefits = [];
            }
            if ($subBenefits === [] && str_starts_with($patientId, 'DEV-CR-') && str_starts_with($benefitCode, 'DEV-')) {
                $subBenefits = [['code' => $benefitCode . '-CONSULT', 'name' => 'Development consultation', 'status' => 'DEV_MOCK']];
            }
            return ['patient_id' => $patientId, 'benefit_code' => $benefitCode, 'sub_benefits' => array_map(static fn (array $item): array => $item + ['mock' => true], $subBenefits), 'mock' => true, 'note' => 'Patient/benefit-scoped synthetic sub-benefits only; not official SHA coverage.'];
        }
        if ($operation === 'preauthorization.check') {
            return ['status' => 'DEV_REVIEW_REQUIRED', 'mock' => true, 'message' => 'Development-only simulation. No official preauthorization rules or provider endpoint were queried.'];
        }
        if ($operation === 'biometric.verify') {
            $scenario = (string) ($payload['scenario'] ?? 'not_enrolled');
            return ['status' => $scenario === 'match' ? 'simulated_match' : 'simulated_no_match', 'match' => $scenario === 'match', 'mock' => true, 'note' => 'Synthetic biometric result only; no biometric sample was captured or compared.'];
        }

        // These are local workflow simulations, not claims about the official HIE
        // consent/OTP/biometric API schema. Their production endpoints and contracts
        // must be loaded from the current DHA-issued API collection before live use.
        if (in_array($operation, ['otp.request', 'consent.request_otp'], true)) {
            return [
                'status' => 'DEV_OTP_ISSUED',
                'delivery' => 'development_console_only',
                'test_code' => (string) ($fixtures['otp']['valid_test_code'] ?? '246810'),
                'expires_in_seconds' => 300,
                'mock' => true,
                'note' => 'Development-only OTP. Not sent to a phone and not a provider OTP.',
            ];
        }
        if (in_array($operation, ['otp.verify', 'consent.verify_otp'], true)) {
            $expected = (string) ($fixtures['otp']['valid_test_code'] ?? '246810');
            $provided = (string) ($payload['otp'] ?? $payload['code'] ?? '');
            return [
                'status' => hash_equals($expected, $provided) ? 'DEV_OTP_VERIFIED' : 'DEV_OTP_REJECTED',
                'verified' => hash_equals($expected, $provided),
                'mock' => true,
                'note' => 'Development-only OTP simulation; no external provider was contacted.',
            ];
        }
        if (str_starts_with($operation, 'consent.')) {
            $requested = (string) ($payload['status'] ?? 'pending');
            $scenario = (array) (($fixtures['consent_scenarios'] ?? [])[$requested] ?? ($fixtures['consent_scenarios']['pending'] ?? []));
            return $scenario + [
                'reference' => 'DEV-CONSENT-' . $reference,
                'purpose' => (string) ($payload['purpose'] ?? 'unspecified-development-purpose'),
                'note' => 'Local consent workflow simulation only. This is not an HIE consent service response.',
            ];
        }
        if (str_starts_with($operation, 'biometric.')) {
            $requested = (string) ($payload['scenario'] ?? 'not_enrolled');
            $scenario = (array) (($fixtures['biometric_scenarios'] ?? [])[$requested] ?? ($fixtures['biometric_scenarios']['not_enrolled'] ?? []));
            return $scenario + [
                'reference' => 'DEV-BIOMETRIC-' . $reference,
                'note' => 'Synthetic biometric status only. No biometric sample or template was collected or stored.',
            ];
        }

        if ($operation === 'eligibility.check') {
            $idNumber = strtoupper(trim((string) ($payload['id'] ?? $payload['identification_number'] ?? '')));
            $patient = (array) (($fixtures['patients'] ?? [])[$idNumber] ?? []);
            return [
                'age' => null,
                'dateOfBirth' => $patient['date_of_birth'] ?? null,
                'facilityBiometricsEnforced' => false,
                'fullName' => isset($patient['first_name']) ? trim(($patient['first_name'] ?? '') . ' ' . ($patient['last_name'] ?? '')) : 'DEVELOPMENT FIXTURE — NOT A REAL BENEFICIARY',
                'gender' => $patient['gender'] ?? 'unknown',
                'isAlive' => null,
                'memberCrNumber' => null,
                'requestIdNumber' => $idNumber,
                'requestIdType' => $payload['identification_type'] ?? null,
                'schemes' => [],
                'statusCode' => 'DEV_MOCK',
                'statusDesc' => 'Synthetic development response. Eligibility is NOT verified by SHA.',
                'whitelistedForOTP' => false,
                'mock' => true,
            ];
        }

        return [
            'mock' => true,
            'provider' => $slug,
            'operation' => $operation,
            'reference' => 'DEV-' . $reference,
            'message' => 'Deterministic development fixture. No external provider was contacted and no live record was created.',
            'data' => match ($operation) {
                'service.verify' => ['verified' => false, 'status' => 'DEV_NOT_VERIFIED'],
                'claim.submit' => ['accepted' => false, 'status' => 'DEV_NOT_SUBMITTED', 'note' => 'Synthetic mock does not represent SHA claim acceptance.'],
                'claim.status' => ['status' => 'review-required', 'note' => 'Synthetic mock status; no claim was submitted.'],
                'facility.lookup' => ['facility_code' => 'DEV-IWC-001', 'status' => 'DEV_MOCK'],
                default => ['status' => 'DEV_MOCK'],
            },
        ];
    }
}

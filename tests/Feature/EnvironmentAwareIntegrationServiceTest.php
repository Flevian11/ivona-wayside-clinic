<?php

namespace Tests\Feature;

use App\Services\Integrations\AfyaLinkPayloadCipher;
use App\Services\Integrations\EnvironmentAwareIntegrationService;
use RuntimeException;
use Tests\TestCase;

class EnvironmentAwareIntegrationServiceTest extends TestCase
{
    public function test_development_uses_deterministic_mock_without_contacting_provider(): void
    {
        config(['integrations.environment' => 'development']);
        $service = app(EnvironmentAwareIntegrationService::class);

        $first = $service->request('sha-edi', 'eligibility.check', 'POST', '/not-used', ['member' => 'fixture-1']);
        $second = $service->request('sha-edi', 'eligibility.check', 'POST', '/not-used', ['member' => 'fixture-1']);

        $this->assertTrue($first['mock']);
        $this->assertSame(200, $first['status']);
        $this->assertSame($first['body'], $second['body']);
        $this->assertSame('MOCK_ELIGIBLE', $first['body']['data']['status']);
    }

    public function test_uat_does_not_fall_back_to_mock_when_configuration_is_missing(): void
    {
        config(['integrations.environment' => 'uat']);
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('missing or inactive');

        app(EnvironmentAwareIntegrationService::class)->request('not-configured', 'eligibility.check', 'POST', '/not-used');
    }


    public function test_afyalink_encrypted_payload_can_be_decrypted_with_its_private_key(): void
    {
        $key = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
        $this->assertNotFalse($key);
        openssl_pkey_export($key, $privatePem);
        $details = openssl_pkey_get_details($key);
        $this->assertIsArray($details);

        $cipher = app(AfyaLinkPayloadCipher::class);
        $original = ['patient_reference' => 'DEV-001', 'status' => 'example'];
        $encrypted = $cipher->encrypt($original, $details['key']);
        $decrypted = $cipher->decrypt($encrypted, $privatePem);

        $this->assertSame($original, json_decode($decrypted, true));
    }

    public function test_invalid_runtime_environment_fails_closed(): void
    {
        config(['integrations.environment' => 'preview']);
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('must be development, uat, or production');

        app(EnvironmentAwareIntegrationService::class)->environment();
    }
}

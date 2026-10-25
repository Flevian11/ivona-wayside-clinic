<?php

namespace Tests\Feature;

use App\Services\Integrations\EnvironmentAwareIntegrationService;
use Tests\TestCase;

class DevelopmentRegistryFixturesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['integrations.environment' => 'development']);
    }

    public function test_fifteen_synthetic_registry_patients_are_available(): void
    {
        $fixtures = config('integration_mock_fixtures.patients');
        $this->assertCount(15, $fixtures);
        $this->assertArrayHasKey('DEV-NID-1001', $fixtures);
        $this->assertArrayHasKey('DEV-NID-1015', $fixtures);
    }

    public function test_registration_screen_principal_alias_resolves_to_four_dependant_fixture(): void
    {
        $response = app(EnvironmentAwareIntegrationService::class)->request(
            'dha-hie', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client',
            ['dynamic_id_search' => 1, 'agent' => 'DEV-AGENT', 'identification_type' => 'National ID', 'identification_number' => 'DEV-PRINCIPAL-001']
        );

        $this->assertTrue($response['mock']);
        $this->assertSame('DEV-CR-001', $response['body']['id']);
        $this->assertCount(4, $response['body']['dependants'][0]['result']);
    }

    public function test_registration_screen_dependant_alias_resolves_as_synthetic_record(): void
    {
        $response = app(EnvironmentAwareIntegrationService::class)->request(
            'dha-hie', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client',
            ['dynamic_id_search' => 1, 'agent' => 'DEV-AGENT', 'identification_type' => 'ClientRegistry ID', 'identification_number' => 'DEV-DEPENDANT-001']
        );

        $this->assertTrue($response['mock']);
        $this->assertSame('DEV-DEP-01-01', $response['body']['id']);
        $this->assertSame('confirmed', $response['body']['relationship_status']);
    }

    public function test_registry_fixture_supports_a_principal_with_four_dependants(): void
    {
        $response = app(EnvironmentAwareIntegrationService::class)->request(
            'dha-hie', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client',
            ['dynamic_id_search' => 1, 'agent' => 'DEV-AGENT', 'id' => 'DEV-NID-1001']
        );

        $this->assertTrue($response['mock']);
        $this->assertSame('DEV-CR-001', $response['body']['id']);
        $this->assertCount(4, $response['body']['dependants'][0]['result']);
        $this->assertStringContainsString('Synthetic fixture', $response['body']['note']);
    }

    public function test_registry_fixture_supports_a_principal_with_one_dependant(): void
    {
        $response = app(EnvironmentAwareIntegrationService::class)->request(
            'dha-hie', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client',
            ['dynamic_id_search' => 1, 'agent' => 'DEV-AGENT', 'id' => 'DEV-NID-1002']
        );

        $this->assertTrue($response['mock']);
        $this->assertCount(1, $response['body']['dependants'][0]['result']);
    }

    public function test_unknown_registry_identifier_is_not_reported_as_found(): void
    {
        $response = app(EnvironmentAwareIntegrationService::class)->request(
            'dha-hie', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client',
            ['dynamic_id_search' => 1, 'agent' => 'DEV-AGENT', 'id' => 'DEV-NID-9999']
        );

        $this->assertTrue($response['mock']);
        $this->assertNull($response['body']['id']);
    }

    public function test_otp_consent_and_biometric_workflows_are_explicitly_mocked(): void
    {
        $service = app(EnvironmentAwareIntegrationService::class);
        $otp = $service->request('dha-hie', 'otp.verify', 'POST', '/development-only/otp', ['otp' => '246810']);
        $consent = $service->request('dha-hie', 'consent.record', 'POST', '/development-only/consent', ['status' => 'granted']);
        $biometric = $service->request('dha-hie', 'biometric.check', 'POST', '/development-only/biometric', ['scenario' => 'match']);

        $this->assertTrue($otp['mock']);
        $this->assertTrue($otp['body']['verified']);
        $this->assertTrue($consent['mock']);
        $this->assertSame('granted', $consent['body']['status']);
        $this->assertTrue($biometric['mock']);
        $this->assertTrue($biometric['body']['match']);
        $this->assertFalse($biometric['body']['biometric_template_stored']);
    }
}

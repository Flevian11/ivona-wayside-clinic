<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $now = now();
        $integrationId = DB::table('api_integrations')->where('slug', 'dha-hie')->value('id');
        if (! $integrationId) return;

        $map = [
            'patient.lookup_by_identifier' => '/patients',
            'eligibility.check' => '/patients/eligibility',
            'patient.benefits' => '/patients/benefits',
            'patient.sub_benefits' => '/patients/sub-benefits',
            'patient.benefits.interventions' => '/patients/benefits/interventions',
            'patient.contacts' => '/patients/contacts',
            'patient.otp.send' => '/claims/otp',
            'patient.biometric.authorize' => '/claims/authorize',
            'patient.benefits.utilization' => '/patients/benefits/utilization',
            'patient.pomsf_balances' => '/patients/pomsf-balances',
        ];
        foreach (['uat' => 'https://ilm-dev.dha.go.ke/uat-middleware/api/v1'] as $environment => $baseUrl) {
            $existing = DB::table('api_integration_environments')->where('api_integration_id', $integrationId)->where('environment', $environment)->first();
            $currentMap = $existing && $existing->endpoint_map ? json_decode($existing->endpoint_map, true) : [];
            DB::table('api_integration_environments')->updateOrInsert(
                ['api_integration_id' => $integrationId, 'environment' => $environment],
                [
                    'base_url' => $existing && $existing->base_url ? $existing->base_url : $baseUrl,
                    'token_url' => $existing && $existing->token_url ? $existing->token_url : $baseUrl . '/tenants/token',
                    'auth_method' => 'oauth2_client_credentials',
                    'endpoint_map' => json_encode(array_merge($currentMap ?: [], $map)),
                    // Do not enable UAT until DHA issues credentials and the facility confirms onboarding.
                    'enabled' => $existing ? (bool) $existing->enabled : false,
                    'verify_tls' => true, 'updated_at' => $now, 'created_at' => $existing ? $existing->created_at : $now,
                ]
            );
        }
        // Production remains an explicit facility configuration; no host, token or credentials are guessed.
        $production = DB::table('api_integration_environments')->where('api_integration_id', $integrationId)->where('environment', 'production')->first();
        if ($production) {
            $currentMap = $production->endpoint_map ? json_decode($production->endpoint_map, true) : [];
            DB::table('api_integration_environments')->where('id', $production->id)->update([
                'endpoint_map' => json_encode(array_merge($currentMap ?: [], $map)), 'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        // Keep environment configuration intact on rollback; removing route mappings could break an active integration.
    }
};

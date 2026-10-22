<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $now = now();
        $catalog = [
            [
                'name' => 'Social Health Authority — EDI and claims',
                'slug' => 'sha-edi',
                'provider' => 'sha',
                'direction' => 'bidirectional',
                'base_url' => null,
                'token_url' => null,
                'auth_method' => 'oauth2_client_credentials',
                'client_id' => null,
                'client_secret' => null,
                'scopes' => json_encode([]),
                'status' => 'inactive',
                'notes' => 'Official SHA EDI environment URLs are prefilled per environment. Keep disabled until SHA issues credentials and confirms the applicable authentication and operation contract.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Digital Health Agency — AfyaConnect HIE',
                'slug' => 'dha-hie',
                'provider' => 'dha_hie',
                'direction' => 'bidirectional',
                'base_url' => null,
                'token_url' => null,
                'auth_method' => 'oauth2_client_credentials',
                'client_id' => null,
                'client_secret' => null,
                'scopes' => json_encode([]),
                'status' => 'inactive',
                'notes' => 'Use the AfyaConnect API catalogue and issued sandbox/production credentials. The public portal documents OAuth 2.0 client credentials and FHIR-based APIs; configure each API product and endpoint map from its official spec.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Digital Health Agency — AfyaLink registries',
                'slug' => 'dha-afyalink',
                'provider' => 'dha_hie',
                'direction' => 'bidirectional',
                'base_url' => null,
                'token_url' => null,
                'auth_method' => 'afyalink_configured_bearer',
                'client_id' => null,
                'client_secret' => null,
                'scopes' => json_encode([]),
                'status' => 'inactive',
                'notes' => 'AfyaLink authentication can use issued account-specific credentials, agent identifiers, and cryptographic keys. The exact token-generation adapter must follow the account/API product specification.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($catalog as $record) {
            DB::table('api_integrations')->updateOrInsert(['slug' => $record['slug']], $record);
        }

        $sha = DB::table('api_integrations')->where('slug', 'sha-edi')->value('id');
        foreach ([
            'development' => 'https://edi-api.provider-dev.sha.go.ke',
            'uat' => 'https://edi-api.provider-uat.sha.go.ke',
            'production' => 'https://api-edi.provider.sha.go.ke',
        ] as $environment => $url) {
            DB::table('api_integration_environments')->updateOrInsert(
                ['api_integration_id' => $sha, 'environment' => $environment],
                [
                    'base_url' => $url,
                    'token_url' => null,
                    'auth_method' => 'oauth2_client_credentials',
                    'client_id' => null,
                    'client_secret' => null,
                    'scopes' => json_encode([]),
                    'enabled' => false,
                    'verify_tls' => true,
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }

        // This exact UAT base URL and the listed GET operations are published in the AfyaConnect eClaims API catalogue.
        $hie = DB::table('api_integrations')->where('slug', 'dha-hie')->value('id');
        DB::table('api_integration_environments')->updateOrInsert(
            ['api_integration_id' => $hie, 'environment' => 'uat'],
            [
                'base_url' => 'https://ilm-dev.dha.go.ke/uat-middleware/api/v1',
                'token_url' => null,
                'auth_method' => 'oauth2_client_credentials',
                'client_id' => null,
                'client_secret' => null,
                'scopes' => json_encode([]),
                'endpoint_map' => json_encode([
                    'eligibility.check' => '/patients/eligibility',
                    'patient.benefits' => '/patients/benefits',
                    'patient.benefits.interventions' => '/patients/benefits/interventions',
                    'patient.benefits.utilization' => '/patients/benefits/utilization',
                    'patient.pomsf_balances' => '/patients/pomsf-balances',
                    'patient.sub_benefits' => '/patients/sub-benefits',
                    'facility.bed_occupancy' => '/facilities/{facilityCode}/beds/occupancy',
                ]),
                'enabled' => false,
                'verify_tls' => true,
                'updated_at' => $now,
                'created_at' => $now,
            ],
        );
    }

    public function down(): void
    {
        $ids = DB::table('api_integrations')->whereIn('slug', ['sha-edi', 'dha-hie', 'dha-afyalink'])->pluck('id');
        DB::table('api_integration_environments')->whereIn('api_integration_id', $ids)->delete();
        DB::table('api_integrations')->whereIn('slug', ['sha-edi', 'dha-hie', 'dha-afyalink'])->delete();
    }
};

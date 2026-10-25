<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $integrationId = DB::table('api_integrations')->where('slug', 'dha-afyalink')->value('id');

        if (! $integrationId) {
            return;
        }

        $now = now();
        $endpointMap = json_encode([
            'patient.lookup_by_identifier' => '/v3/client-registry/fetch-client',
        ], JSON_THROW_ON_ERROR);

        foreach (['development', 'uat', 'production'] as $environment) {
            $existing = DB::table('api_integration_environments')
                ->where('api_integration_id', $integrationId)
                ->where('environment', $environment)
                ->first();

            if ($existing) {
                $currentMap = $existing->endpoint_map ?? null;
                if (is_string($currentMap)) {
                    $decoded = json_decode($currentMap, true);
                    $currentMap = is_array($decoded) ? $decoded : [];
                }
                $currentMap = is_array($currentMap) ? $currentMap : [];
                $currentMap['patient.lookup_by_identifier'] = '/v3/client-registry/fetch-client';

                DB::table('api_integration_environments')
                    ->where('id', $existing->id)
                    ->update([
                        'endpoint_map' => json_encode($currentMap, JSON_THROW_ON_ERROR),
                        'updated_at' => $now,
                    ]);
                continue;
            }

            // Do not guess an assigned DHA host or credentials. The profile remains disabled
            // until the hospital enters its issued environment URL and credentials.
            DB::table('api_integration_environments')->insert([
                'api_integration_id' => $integrationId,
                'environment' => $environment,
                'base_url' => null,
                'token_url' => null,
                'auth_method' => 'afyalink_configured_bearer',
                'scopes' => json_encode([]),
                'enabled' => false,
                'verify_tls' => true,
                'endpoint_map' => $endpointMap,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        // Preserve operator-managed credentials and environment records on rollback.
        // This migration only corrects the Client Registry operation map.
    }
};

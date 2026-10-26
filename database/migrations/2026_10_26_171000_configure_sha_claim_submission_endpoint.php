<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $integrationId = DB::table('api_integrations')->where('slug', 'sha-edi')->value('id');
        if (!$integrationId) return;
        foreach (['development', 'uat', 'production'] as $environment) {
            $row = DB::table('api_integration_environments')->where('api_integration_id', $integrationId)->where('environment', $environment)->first();
            if (!$row) continue;
            $map = json_decode($row->endpoint_map ?? '{}', true);
            if (!is_array($map)) $map = [];
            $map['claims.submit'] = '/claims/submit';
            DB::table('api_integration_environments')->where('id', $row->id)->update(['endpoint_map' => json_encode($map), 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        $integrationId = DB::table('api_integrations')->where('slug', 'sha-edi')->value('id');
        if (!$integrationId) return;
        foreach (DB::table('api_integration_environments')->where('api_integration_id', $integrationId)->get() as $row) {
            $map = json_decode($row->endpoint_map ?? '{}', true);
            if (!is_array($map)) continue;
            unset($map['claims.submit']);
            DB::table('api_integration_environments')->where('id', $row->id)->update(['endpoint_map' => json_encode($map), 'updated_at' => now()]);
        }
    }
};

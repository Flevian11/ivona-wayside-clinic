<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $id = DB::table('api_integrations')->where('slug', 'dha-hie')->value('id');
        if (!$id) return;
        $now = now();
        $operations = [
            'patient.contacts' => '/patients/contacts',
            'consent.send_otp' => '/claims/otp',
            'consent.authorize' => '/claims/authorize',
            'consent.authorizations' => '/claims/authorizations',
        ];
        foreach (['uat', 'production'] as $environment) {
            $row = DB::table('api_integration_environments')->where('api_integration_id', $id)->where('environment', $environment)->first();
            if (!$row) continue;
            $map = json_decode((string) ($row->endpoint_map ?? '{}'), true);
            $map = is_array($map) ? $map : [];
            foreach ($operations as $key => $path) $map[$key] = $path;
            DB::table('api_integration_environments')->where('id', $row->id)->update(['endpoint_map' => json_encode($map, JSON_THROW_ON_ERROR), 'updated_at' => $now]);
        }
    }
    public function down(): void { /* Keep operator-managed endpoint maps intact on rollback. */ }
};

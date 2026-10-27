<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('patient_consents', function (Blueprint $table): void {
            if (!Schema::hasColumn('patient_consents', 'consent_token')) {
                $table->text('consent_token')->nullable()->after('consent_token_hash');
            }
            $table->index(['encounter_id', 'consent_type', 'status'], 'patient_consents_encounter_claim_status_idx');
        });
    }

    public function down(): void
    {
        Schema::table('patient_consents', function (Blueprint $table): void {
            $table->dropIndex('patient_consents_encounter_claim_status_idx');
            if (Schema::hasColumn('patient_consents', 'consent_token')) $table->dropColumn('consent_token');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('encounters', function (Blueprint $table): void {
            $table->string('sha_benefit_code', 100)->nullable()->after('coverage_type');
            $table->string('sha_benefit_name', 255)->nullable()->after('sha_benefit_code');
            $table->string('sha_preauthorization_status', 40)->nullable()->after('sha_benefit_name');
        });
    }

    public function down(): void
    {
        Schema::table('encounters', function (Blueprint $table): void {
            $table->dropColumn(['sha_benefit_code', 'sha_benefit_name', 'sha_preauthorization_status']);
        });
    }
};

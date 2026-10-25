<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('encounters', function (Blueprint $table): void {
            $table->string('sha_sub_benefit_code', 100)->nullable()->after('sha_benefit_name');
            $table->string('sha_sub_benefit_name', 255)->nullable()->after('sha_sub_benefit_code');
        });
    }

    public function down(): void
    {
        Schema::table('encounters', function (Blueprint $table): void {
            $table->dropColumn(['sha_sub_benefit_code', 'sha_sub_benefit_name']);
        });
    }
};

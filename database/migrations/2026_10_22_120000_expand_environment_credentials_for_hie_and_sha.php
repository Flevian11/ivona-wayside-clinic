<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inbound_api_keys', function (Blueprint $table) {
            $table->string('environment', 20)->default('production')->index();
        });

        Schema::table('api_integration_environments', function (Blueprint $table) {
            $table->string('agent_id')->nullable();
            $table->string('facility_id')->nullable();
            $table->string('facility_id_type')->nullable();
            $table->string('username')->nullable();
            $table->text('password')->nullable();
            $table->string('consumer_key')->nullable();
            $table->text('consumer_secret')->nullable();
            $table->text('private_key')->nullable();
            $table->text('public_key')->nullable();
            $table->text('provider_public_key')->nullable();
            $table->text('client_certificate')->nullable();
            $table->text('client_certificate_key')->nullable();
            $table->string('callback_url')->nullable();
            $table->string('validation_url')->nullable();
            $table->json('endpoint_map')->nullable();
            $table->json('encrypted_operations')->nullable();
            $table->boolean('verify_tls')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('inbound_api_keys', function (Blueprint $table) {
            $table->dropColumn('environment');
        });

        Schema::table('api_integration_environments', function (Blueprint $table) {
            $table->dropColumn(['agent_id','facility_id','facility_id_type','username','password','consumer_key','consumer_secret','private_key','public_key','provider_public_key','client_certificate','client_certificate_key','callback_url','validation_url','endpoint_map','encrypted_operations','verify_tls']);
        });
    }
};

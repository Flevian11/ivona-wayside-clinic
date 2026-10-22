<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_integrations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('provider')->default('custom');
            $table->string('direction')->default('outbound');
            $table->string('base_url')->nullable();
            $table->string('token_url')->nullable();
            $table->string('auth_method')->default('oauth2_client_credentials');
            $table->string('client_id')->nullable();
            $table->text('client_secret')->nullable();
            $table->json('scopes')->nullable();
            $table->string('status')->default('inactive');
            $table->text('notes')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('inbound_api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('prefix', 32)->unique();
            $table->string('token_hash', 64)->unique();
            $table->json('scopes');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['revoked_at', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inbound_api_keys');
        Schema::dropIfExists('api_integrations');
    }
};

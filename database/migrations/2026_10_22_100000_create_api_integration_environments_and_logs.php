<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('api_integration_environments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_integration_id')->constrained('api_integrations')->cascadeOnDelete();
            $table->string('environment');
            $table->string('base_url')->nullable();
            $table->string('token_url')->nullable();
            $table->string('auth_method')->default('oauth2_client_credentials');
            $table->string('client_id')->nullable();
            $table->text('client_secret')->nullable();
            $table->json('scopes')->nullable();
            $table->boolean('enabled')->default(false);
            $table->timestamps();
            $table->unique(['api_integration_id', 'environment']);
        });
        Schema::create('api_integration_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_integration_id')->nullable()->constrained('api_integrations')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('environment', 20);
            $table->string('operation', 80);
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->string('result', 24);
            $table->unsignedInteger('duration_ms')->nullable();
            $table->text('safe_message')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['api_integration_id', 'created_at']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('api_integration_logs');
        Schema::dropIfExists('api_integration_environments');
    }
};

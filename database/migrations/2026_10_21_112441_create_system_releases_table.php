<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_releases', function (Blueprint $table) {
            $table->id();
            $table->string('version', 50)->unique();
            $table->string('title');
            $table->string('release_type', 30);
            $table->text('summary');
            $table->longText('release_notes')->nullable();
            $table->json('features')->nullable();
            $table->json('improvements')->nullable();
            $table->json('bug_fixes')->nullable();
            $table->json('security_notes')->nullable();
            $table->json('known_issues')->nullable();
            $table->string('minimum_php_version', 30)->nullable();
            $table->string('minimum_database_version', 50)->nullable();
            $table->string('status', 20)->default('draft')->index();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('published_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('withdrawn_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_releases');
    }
};

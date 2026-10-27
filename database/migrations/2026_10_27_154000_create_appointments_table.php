<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table): void {
            $table->id();
            $table->string('appointment_number', 36)->unique();
            $table->foreignId('patient_id')->constrained()->restrictOnDelete();
            $table->timestamp('scheduled_at')->index();
            $table->string('visit_type', 40)->default('outpatient')->index();
            $table->string('department', 100)->nullable()->index();
            $table->string('priority', 24)->default('routine');
            $table->string('status', 24)->default('scheduled')->index();
            $table->string('reason', 255)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['scheduled_at', 'status']);
            $table->index(['patient_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

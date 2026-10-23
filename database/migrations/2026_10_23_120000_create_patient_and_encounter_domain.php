<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('medical_record_number', 32)->unique();
            $table->enum('registration_source', ['local', 'sha'])->default('local')->index();
            $table->string('client_registry_id')->nullable()->unique();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('full_name')->nullable()->index();
            $table->date('date_of_birth')->nullable()->index();
            $table->string('sex', 24)->nullable();
            $table->string('gender', 32)->nullable();
            $table->string('phone', 40)->nullable()->index();
            $table->string('email')->nullable();
            $table->string('preferred_language', 40)->nullable();
            $table->string('nationality', 80)->nullable();
            $table->string('county', 100)->nullable();
            $table->string('sub_county', 100)->nullable();
            $table->string('ward', 100)->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relationship', 80)->nullable();
            $table->string('emergency_contact_phone', 40)->nullable();
            $table->string('status', 24)->default('active')->index();
            $table->boolean('is_deceased')->default(false)->index();
            $table->timestamp('last_identity_verified_at')->nullable();
            $table->string('identity_verification_source', 40)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['last_name', 'first_name', 'date_of_birth'], 'patients_name_dob_idx');
        });

        Schema::create('patient_identifiers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('type', 40);
            $table->text('value_encrypted');
            $table->char('value_hash', 64);
            $table->string('issuer', 120)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_source', 40)->nullable();
            $table->timestamps();
            $table->unique(['type', 'value_hash'], 'patient_identifier_type_hash_unique');
            $table->index(['patient_id', 'type']);
        });

        Schema::create('patient_relationships', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('related_patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('relationship_type', 40);
            $table->boolean('is_principal_member')->default(false);
            $table->string('source', 40)->default('local');
            $table->string('external_relationship_reference')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['patient_id', 'related_patient_id', 'relationship_type'], 'patient_relationship_unique');
            $table->index(['related_patient_id', 'is_principal_member']);
        });

        Schema::create('encounters', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('encounter_number', 36)->unique();
            $table->foreignId('patient_id')->constrained()->restrictOnDelete();
            $table->string('visit_type', 40)->default('outpatient')->index();
            $table->string('status', 32)->default('registered')->index();
            $table->string('priority', 24)->default('routine');
            $table->timestamp('arrived_at')->index();
            $table->timestamp('triaged_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('department', 100)->nullable();
            $table->string('chief_complaint')->nullable();
            $table->text('notes')->nullable();
            $table->string('payment_type', 32)->nullable();
            $table->string('coverage_type', 32)->nullable();
            $table->foreignId('principal_member_patient_id')->nullable()->constrained('patients')->nullOnDelete();
            $table->string('sha_eligibility_status', 32)->nullable();
            $table->timestamp('sha_eligibility_checked_at')->nullable();
            $table->foreignId('registered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['patient_id', 'arrived_at']);
            $table->index(['status', 'arrived_at']);
        });

        Schema::create('patient_consents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('encounter_id')->nullable()->constrained()->nullOnDelete();
            $table->string('consent_type', 48);
            $table->string('status', 24)->index();
            $table->string('method', 32)->nullable();
            $table->string('provider', 32)->nullable();
            $table->string('provider_reference')->nullable();
            $table->string('consent_token_hash', 64)->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('granted_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->foreignId('captured_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('provider_metadata')->nullable();
            $table->timestamps();
            $table->index(['patient_id', 'consent_type', 'status']);
        });

        Schema::create('patient_integration_transactions', function (Blueprint $table): void {
            $table->id();
            $table->uuid('correlation_id')->unique();
            $table->foreignId('patient_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('encounter_id')->nullable()->constrained()->nullOnDelete();
            $table->string('provider', 40)->index();
            $table->string('operation', 80)->index();
            $table->string('environment', 24);
            $table->string('status', 24)->index();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->string('provider_reference')->nullable();
            $table->json('request_body_redacted')->nullable();
            $table->json('response_body_redacted')->nullable();
            $table->text('error_code')->nullable();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['provider', 'operation', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_integration_transactions');
        Schema::dropIfExists('patient_consents');
        Schema::dropIfExists('encounters');
        Schema::dropIfExists('patient_relationships');
        Schema::dropIfExists('patient_identifiers');
        Schema::dropIfExists('patients');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('encounters', function (Blueprint $table): void {
            $table->text('clinical_assessment')->nullable();
            $table->string('icd11_code', 80)->nullable()->index();
            $table->string('icd11_display', 255)->nullable();
            $table->string('claim_status', 32)->nullable()->index();
            $table->string('claim_reference', 120)->nullable()->index();
            $table->string('invoice_status', 32)->default('not_required');
            $table->decimal('invoice_total', 12, 2)->nullable();
            $table->json('billing_items')->nullable();
            $table->timestamp('claim_submitted_at')->nullable();
            $table->timestamp('finished_at')->nullable();
        });
        Schema::create('encounter_documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('encounter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('category', 40)->default('diagnosis_support');
            $table->string('original_name');
            $table->string('storage_path');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size_bytes');
            $table->timestamps();
            $table->index(['encounter_id', 'category']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('encounter_documents');
        Schema::table('encounters', function (Blueprint $table): void {
            $table->dropColumn(['clinical_assessment','icd11_code','icd11_display','claim_status','claim_reference','invoice_status','invoice_total','billing_items','claim_submitted_at','finished_at']);
        });
    }
};

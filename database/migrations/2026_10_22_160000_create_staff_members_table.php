<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('staff_members', function (Blueprint $table) {
            $table->id();
            $table->string('staff_number', 60)->unique();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('other_names', 150)->nullable();
            $table->string('work_email')->nullable()->unique();
            $table->string('phone', 40)->nullable();
            $table->string('department', 120)->nullable()->index();
            $table->string('job_title', 120)->nullable();
            $table->string('employment_status', 30)->default('active')->index();
            $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('staff_members'); }
};

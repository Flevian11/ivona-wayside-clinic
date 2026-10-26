<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('encounters', 'invoice_status')) {
            Schema::table('encounters', fn (Blueprint $table) => $table->string('invoice_status', 24)->default('draft')->index());
        }
        if (!Schema::hasColumn('encounters', 'invoice_total')) {
            Schema::table('encounters', fn (Blueprint $table) => $table->decimal('invoice_total', 12, 2)->default(0));
        }
        if (!Schema::hasColumn('encounters', 'billing_items')) {
            Schema::table('encounters', fn (Blueprint $table) => $table->json('billing_items')->nullable());
        }
        if (!Schema::hasColumn('encounters', 'invoice_reference')) {
            Schema::table('encounters', fn (Blueprint $table) => $table->string('invoice_reference', 80)->nullable()->unique());
        }
        if (!Schema::hasColumn('encounters', 'invoice_issued_at')) {
            Schema::table('encounters', fn (Blueprint $table) => $table->timestamp('invoice_issued_at')->nullable());
        }
    }

    public function down(): void
    {
        foreach (['invoice_issued_at', 'invoice_reference', 'billing_items', 'invoice_total', 'invoice_status'] as $column) {
            if (Schema::hasColumn('encounters', $column)) Schema::table('encounters', fn (Blueprint $table) => $table->dropColumn($column));
        }
    }
};

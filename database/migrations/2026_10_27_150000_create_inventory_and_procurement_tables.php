<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table): void {
            $table->id();
            $table->string('sku', 80)->unique();
            $table->string('name', 180)->index();
            $table->string('category', 100)->nullable()->index();
            $table->string('unit', 40)->default('unit');
            $table->decimal('quantity_on_hand', 12, 3)->default(0);
            $table->decimal('reorder_level', 12, 3)->default(0);
            $table->decimal('unit_cost', 14, 2)->default(0);
            $table->string('location', 120)->nullable();
            $table->string('supplier_name')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('inventory_movements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->string('movement_type', 24)->index();
            $table->decimal('quantity_change', 12, 3);
            $table->decimal('balance_after', 12, 3);
            $table->string('reference', 120)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['inventory_item_id', 'created_at']);
        });

        Schema::create('procurement_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('request_number', 40)->unique();
            $table->string('item_description', 180)->index();
            $table->string('category', 100)->nullable();
            $table->decimal('quantity', 12, 3);
            $table->string('unit', 40)->default('unit');
            $table->decimal('estimated_unit_cost', 14, 2)->nullable();
            $table->string('supplier_name')->nullable();
            $table->string('priority', 24)->default('normal')->index();
            $table->string('status', 24)->default('pending')->index();
            $table->text('justification')->nullable();
            $table->text('review_notes')->nullable();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'created_at']);
        });

        if (Schema::hasTable('permissions')) {
            foreach ([
                ['procurement.view', 'View procurement requests'],
                ['procurement.approve', 'Review procurement requests'],
            ] as [$name, $description]) {
                DB::table('permissions')->updateOrInsert(['name' => $name], [
                    'description' => $description,
                    'module' => 'procurement',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]);
            }
            if (Schema::hasTable('roles') && Schema::hasTable('permission_role')) {
                $viewId = DB::table('permissions')->where('name', 'procurement.view')->value('id');
                $approveId = DB::table('permissions')->where('name', 'procurement.approve')->value('id');
                $roles = DB::table('roles')->whereIn('slug', ['super-administrator', 'hospital-administrator'])->pluck('id');
                foreach ($roles as $roleId) {
                    DB::table('permission_role')->updateOrInsert(['permission_id' => $viewId, 'role_id' => $roleId], ['assigned_by' => null, 'assigned_at' => now()]);
                    DB::table('permission_role')->updateOrInsert(['permission_id' => $approveId, 'role_id' => $roleId], ['assigned_by' => null, 'assigned_at' => now()]);
                }
                $managers = DB::table('permissions')->where('name', 'procurement.manage')->value('id');
                if ($managers) {
                    $rolesWithManage = DB::table('permission_role')->where('permission_id', $managers)->pluck('role_id');
                    foreach ($rolesWithManage as $roleId) {
                        DB::table('permission_role')->updateOrInsert(['permission_id' => $viewId, 'role_id' => $roleId], ['assigned_by' => null, 'assigned_at' => now()]);
                    }
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('procurement_requests');
        Schema::dropIfExists('inventory_movements');
        Schema::dropIfExists('inventory_items');
        if (Schema::hasTable('permissions')) {
            DB::table('permissions')->whereIn('name', ['procurement.view','procurement.approve'])->delete();
        }
    }
};

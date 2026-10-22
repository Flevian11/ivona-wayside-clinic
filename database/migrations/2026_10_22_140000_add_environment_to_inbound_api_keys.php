<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { if (Schema::hasTable('inbound_api_keys') && !Schema::hasColumn('inbound_api_keys','environment')) Schema::table('inbound_api_keys', function(Blueprint $table){ $table->string('environment',20)->default('production')->index(); }); }
 public function down(): void { if (Schema::hasTable('inbound_api_keys') && Schema::hasColumn('inbound_api_keys','environment')) Schema::table('inbound_api_keys', function(Blueprint $table){ $table->dropColumn('environment'); }); }
};

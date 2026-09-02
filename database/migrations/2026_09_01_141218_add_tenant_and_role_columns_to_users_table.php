<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('student')->after('email');
            $table->foreignId('tenant_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('remember_token');
            $table->index(['tenant_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'role']);
            $table->dropForeign(['tenant_id']);
            $table->dropColumn(['role', 'tenant_id', 'is_active']);
        });
    }
};

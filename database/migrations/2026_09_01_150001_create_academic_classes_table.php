<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g., Class 10, HSC Batch
            $table->string('section')->nullable(); // e.g., Science, Batch A
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'is_active']);
            $table->unique(['tenant_id', 'name', 'section']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_classes');
    }
};

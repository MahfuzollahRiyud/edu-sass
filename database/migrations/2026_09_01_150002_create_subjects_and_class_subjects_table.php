<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. Physics, Higher Math
            $table->string('code')->nullable(); // e.g. PHY-101
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'is_active']);
            $table->unique(['tenant_id', 'name']);
        });

        Schema::create('class_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_class_id')->constrained('academic_classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'academic_class_id', 'subject_id'], 'class_subject_tenant_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_subjects');
        Schema::dropIfExists('subjects');
    }
};

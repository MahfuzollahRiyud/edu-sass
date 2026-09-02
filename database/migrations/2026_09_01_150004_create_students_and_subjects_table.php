<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('student_id'); // Format: STU-2026-00001
            $table->foreignId('academic_class_id')->constrained('academic_classes')->cascadeOnDelete();
            $table->string('phone')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable(); // male, female, other
            $table->date('admission_date');
            $table->decimal('monthly_fee', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'student_id']);
            $table->unique(['tenant_id', 'user_id']);
            $table->index(['tenant_id', 'academic_class_id']);
            $table->index(['tenant_id', 'is_active']);
        });

        Schema::create('student_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('class_subject_id')->constrained('class_subjects')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'student_id', 'class_subject_id'], 'student_subject_tenant_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_subjects');
        Schema::dropIfExists('students');
    }
};

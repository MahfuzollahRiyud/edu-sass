<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('phone')->nullable();
            $table->string('designation')->nullable(); // Senior Teacher, Lecturer
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'user_id']);
            $table->index(['tenant_id', 'is_active']);
        });

        Schema::create('teacher_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('class_subject_id')->constrained('class_subjects')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'teacher_id', 'class_subject_id'], 'teacher_class_sub_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_assignments');
        Schema::dropIfExists('teachers');
    }
};

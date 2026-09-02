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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_class_id')->constrained('academic_classes')->cascadeOnDelete();
            $table->string('title');
            $table->enum('exam_type', ['class_test', 'monthly_test', 'model_test', 'term_final'])->default('monthly_test');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_published')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'academic_class_id']);
        });

        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->foreignId('class_subject_id')->constrained('class_subjects')->cascadeOnDelete();
            $table->date('exam_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->decimal('total_marks', 6, 2)->default(100.00);
            $table->decimal('pass_marks', 6, 2)->default(33.00);
            $table->timestamps();

            $table->index(['tenant_id', 'exam_id']);
            $table->unique(['exam_id', 'class_subject_id']);
        });

        Schema::create('exam_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->foreignId('exam_schedule_id')->constrained('exam_schedules')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->decimal('marks_obtained', 6, 2)->default(0.00);
            $table->string('grade', 5)->default('F');
            $table->decimal('grade_point', 4, 2)->default(0.00);
            $table->boolean('is_absent')->default(false);
            $table->string('remarks')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'exam_id', 'student_id']);
            $table->unique(['exam_schedule_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_marks');
        Schema::dropIfExists('exam_schedules');
        Schema::dropIfExists('exams');
    }
};

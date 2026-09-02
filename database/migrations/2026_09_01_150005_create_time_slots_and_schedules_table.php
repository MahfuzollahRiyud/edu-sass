<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('label')->nullable(); // Slot 1, Morning A
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
            $table->unique(['tenant_id', 'start_time', 'end_time']);
        });

        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_subject_id')->constrained('class_subjects')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('time_slot_id')->constrained('time_slots')->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week'); // 0=Sunday, 1=Monday, ..., 6=Saturday
            $table->string('room')->nullable(); // Optional room identifier
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Prevent teacher from being double-booked on same day & slot
            $table->unique(['tenant_id', 'teacher_id', 'time_slot_id', 'day_of_week'], 'sched_teacher_slot_unique');
            // Prevent class-subject from having multiple teachers/classes on same day & slot
            $table->unique(['tenant_id', 'class_subject_id', 'time_slot_id', 'day_of_week'], 'sched_class_slot_unique');
            $table->index(['tenant_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('time_slots');
    }
};

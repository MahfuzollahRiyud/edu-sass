<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained('schedules')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->date('attendance_date');
            $table->string('status', 20)->default('present'); // present, absent, late
            $table->text('remarks')->nullable();
            $table->foreignId('marked_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'schedule_id', 'student_id', 'attendance_date'], 'attendance_record_unique');
            $table->index(['tenant_id', 'attendance_date']);
            $table->index(['tenant_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

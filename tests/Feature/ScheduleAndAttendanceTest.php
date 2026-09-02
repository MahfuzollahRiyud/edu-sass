<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\Attendance;
use App\Models\ClassSubject;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudentSubject;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TimeSlot;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleAndAttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_prevents_teacher_double_booking_schedule_conflict()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $teacherUser = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        $teacher = Teacher::create(['tenant_id' => $tenant->id, 'user_id' => $teacherUser->id]);

        $class1 = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 9']);
        $class2 = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 10']);
        $subject = Subject::create(['tenant_id' => $tenant->id, 'name' => 'English']);

        $cs1 = ClassSubject::create(['tenant_id' => $tenant->id, 'academic_class_id' => $class1->id, 'subject_id' => $subject->id]);
        $cs2 = ClassSubject::create(['tenant_id' => $tenant->id, 'academic_class_id' => $class2->id, 'subject_id' => $subject->id]);

        $slot = TimeSlot::create(['tenant_id' => $tenant->id, 'start_time' => '16:00', 'end_time' => '17:00']);

        // First schedule
        Schedule::create([
            'tenant_id' => $tenant->id,
            'class_subject_id' => $cs1->id,
            'teacher_id' => $teacher->id,
            'time_slot_id' => $slot->id,
            'day_of_week' => 1, // Monday
        ]);

        // Attempt second schedule with same teacher, day, and slot -> conflict
        $response = $this->actingAs($admin)->post(route('admin.schedules.store'), [
            'class_subject_id' => $cs2->id,
            'teacher_id' => $teacher->id,
            'time_slot_id' => $slot->id,
            'day_of_week' => 1,
        ]);

        $response->assertSessionHasErrors('time_slot_id');
    }

    public function test_teacher_can_take_attendance_for_assigned_class()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $teacherUser = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        $teacher = Teacher::create(['tenant_id' => $tenant->id, 'user_id' => $teacherUser->id]);

        $studentUser = User::factory()->create(['role' => 'student', 'tenant_id' => $tenant->id]);
        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 10']);
        $subject = Subject::create(['tenant_id' => $tenant->id, 'name' => 'Math']);
        $cs = ClassSubject::create(['tenant_id' => $tenant->id, 'academic_class_id' => $class->id, 'subject_id' => $subject->id]);

        $student = Student::create([
            'tenant_id' => $tenant->id,
            'user_id' => $studentUser->id,
            'student_id' => 'STU-2026-00001',
            'academic_class_id' => $class->id,
            'admission_date' => '2026-09-01',
            'monthly_fee' => 1000,
        ]);

        StudentSubject::create(['tenant_id' => $tenant->id, 'student_id' => $student->id, 'class_subject_id' => $cs->id]);

        $slot = TimeSlot::create(['tenant_id' => $tenant->id, 'start_time' => '17:00', 'end_time' => '18:00']);
        $schedule = Schedule::create([
            'tenant_id' => $tenant->id,
            'class_subject_id' => $cs->id,
            'teacher_id' => $teacher->id,
            'time_slot_id' => $slot->id,
            'day_of_week' => 2,
        ]);

        $response = $this->actingAs($teacherUser)->post(route('teacher.attendance.store'), [
            'schedule_id' => $schedule->id,
            'attendance_date' => '2026-09-02',
            'attendances' => [
                [
                    'student_id' => $student->id,
                    'status' => 'present',
                    'remarks' => 'Good participation',
                ],
            ],
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('attendances', [
            'tenant_id' => $tenant->id,
            'schedule_id' => $schedule->id,
            'student_id' => $student->id,
            'status' => 'present',
            'marked_by' => $teacherUser->id,
        ]);
    }
}

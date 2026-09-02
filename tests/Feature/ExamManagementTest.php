<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Exam;
use App\Models\ExamMark;
use App\Models\ExamSchedule;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\Tenant;
use App\Models\User;
use App\Services\GradingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_exam_with_schedules_and_save_marks()
    {
        $tenant = Tenant::create(['name' => 'Center 1', 'slug' => 'center-1']);

        $admin = User::factory()->create([
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        $class = AcademicClass::create([
            'tenant_id' => $tenant->id,
            'name' => 'Class 10',
            'is_active' => true,
        ]);

        $math = Subject::create([
            'tenant_id' => $tenant->id,
            'name' => 'Mathematics',
            'code' => 'MTH',
            'is_active' => true,
        ]);

        $classSubject = ClassSubject::create([
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'subject_id' => $math->id,
        ]);

        $studentUser = User::factory()->create([
            'role' => 'student',
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        $student = Student::create([
            'tenant_id' => $tenant->id,
            'user_id' => $studentUser->id,
            'student_id' => 'STU-2026-00001',
            'academic_class_id' => $class->id,
            'monthly_fee' => 1000,
            'admission_date' => now(),
            'is_active' => true,
        ]);

        // 1. Admin creates Exam
        $response = $this->actingAs($admin)->post(route('admin.exams.store'), [
            'academic_class_id' => $class->id,
            'title' => 'Term 1 Exam',
            'exam_type' => 'monthly_test',
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-15',
            'schedules' => [
                [
                    'class_subject_id' => $classSubject->id,
                    'exam_date' => '2026-09-10',
                    'total_marks' => 100,
                    'pass_marks' => 33,
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.exams.index'));
        $this->assertDatabaseHas('exams', ['title' => 'Term 1 Exam', 'tenant_id' => $tenant->id]);

        $exam = Exam::where('tenant_id', $tenant->id)->first();
        $schedule = ExamSchedule::where('exam_id', $exam->id)->first();

        // 2. Admin saves marks
        $markResponse = $this->actingAs($admin)->post(route('admin.exams.save-marks', $exam), [
            'exam_schedule_id' => $schedule->id,
            'marks' => [
                [
                    'student_id' => $student->id,
                    'marks_obtained' => 85,
                    'is_absent' => false,
                    'remarks' => 'Good',
                ],
            ],
        ]);

        $markResponse->assertRedirect();
        $this->assertDatabaseHas('exam_marks', [
            'exam_id' => $exam->id,
            'student_id' => $student->id,
            'marks_obtained' => 85.00,
            'grade' => 'A+',
            'grade_point' => 5.00,
        ]);

        // 3. Tabulation calculation
        $tabulation = GradingService::calculateTabulation($exam);
        $this->assertEquals(1, $tabulation['total_students']);
        $this->assertEquals(5.00, $tabulation['students'][0]['gpa']);
        $this->assertEquals('A+', $tabulation['students'][0]['grade']);
        $this->assertEquals(1, $tabulation['students'][0]['rank']);

        // 4. Report Card page loads
        $reportResponse = $this->actingAs($admin)->get(route('admin.exams.report-card', ['exam' => $exam, 'student' => $student]));
        $reportResponse->assertOk();
    }

    public function test_student_can_only_view_published_exams()
    {
        $tenant = Tenant::create(['name' => 'Center 2', 'slug' => 'center-2']);

        $class = AcademicClass::create([
            'tenant_id' => $tenant->id,
            'name' => 'Class 8',
            'is_active' => true,
        ]);

        $studentUser = User::factory()->create([
            'role' => 'student',
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        $student = Student::create([
            'tenant_id' => $tenant->id,
            'user_id' => $studentUser->id,
            'student_id' => 'STU-2026-00002',
            'academic_class_id' => $class->id,
            'monthly_fee' => 1000,
            'admission_date' => now(),
            'is_active' => true,
        ]);

        // Draft exam
        $draftExam = Exam::create([
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'title' => 'Draft Exam',
            'exam_type' => 'class_test',
            'start_date' => now(),
            'is_published' => false,
        ]);

        // Student cannot view unpublished exam report
        $response = $this->actingAs($studentUser)->get(route('student.results.show', $draftExam));
        $response->assertNotFound();

        // Publish exam
        $draftExam->update(['is_published' => true]);

        $response = $this->actingAs($studentUser)->get(route('student.results.show', $draftExam));
        $response->assertOk();
    }
}

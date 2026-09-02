<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_admit_student_with_generated_id_and_subjects()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 10', 'section' => 'Science']);
        $subject = Subject::create(['tenant_id' => $tenant->id, 'name' => 'Chemistry']);
        $classSubject = ClassSubject::create([
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.students.store'), [
            'name' => 'Tanvir Hossain',
            'email' => 'tanvir@student.com',
            'password' => 'password123',
            'academic_class_id' => $class->id,
            'phone' => '01811223344',
            'guardian_name' => 'Rafiq Hossain',
            'admission_date' => '2026-09-01',
            'monthly_fee' => 1500,
            'class_subject_ids' => [$classSubject->id],
            'admission_fee' => 2000,
            'admission_fee_paid' => 1000,
            'payment_method' => 'cash',
        ]);

        $response->assertRedirect(route('admin.students.index'));

        $student = Student::where('tenant_id', $tenant->id)->first();
        $this->assertNotNull($student);
        $this->assertStringStartsWith('STU-' . date('Y') . '-', $student->student_id);

        $this->assertDatabaseHas('student_subjects', [
            'tenant_id' => $tenant->id,
            'student_id' => $student->id,
            'class_subject_id' => $classSubject->id,
        ]);

        // Verify admission fee invoice & payment
        $this->assertDatabaseHas('fee_invoices', [
            'tenant_id' => $tenant->id,
            'student_id' => $student->id,
            'amount' => 2000,
            'paid_amount' => 1000,
            'due_amount' => 1000,
            'status' => 'partial',
        ]);

        $this->assertDatabaseHas('receipts', [
            'tenant_id' => $tenant->id,
        ]);
    }

    public function test_student_can_login_and_view_student_portal()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $user = User::factory()->create(['role' => 'student', 'tenant_id' => $tenant->id]);
        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 8']);

        Student::create([
            'tenant_id' => $tenant->id,
            'user_id' => $user->id,
            'student_id' => 'STU-2026-00001',
            'academic_class_id' => $class->id,
            'admission_date' => '2026-09-01',
            'monthly_fee' => 1200,
        ]);

        $response = $this->actingAs($user)->get(route('student.dashboard'));
        $response->assertOk();
    }
}

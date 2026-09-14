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

    public function test_admin_can_admit_student_with_both_admission_and_monthly_fee_payments()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 10']);
        $subject = Subject::create(['tenant_id' => $tenant->id, 'name' => 'Physics']);
        $classSubject = ClassSubject::create([
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'subject_id' => $subject->id,
            'monthly_fee' => 2000,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.students.store'), [
            'name' => 'Jahid Hasan',
            'email' => 'jahid@student.com',
            'password' => 'password123',
            'academic_class_id' => $class->id,
            'admission_date' => '2026-09-14',
            'monthly_fee' => 2000,
            'class_subject_ids' => [$classSubject->id],
            'admission_fee' => 500,
            'admission_fee_paid' => 500,
            'include_first_month_fee' => true,
            'first_month' => '2026-09',
            'first_month_fee' => 2000,
            'first_month_fee_paid' => 2000,
            'payment_method' => 'cash',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.students.index'));

        $student = Student::where('tenant_id', $tenant->id)->first();
        $this->assertNotNull($student);

        // Verify both invoices are created and marked paid
        $this->assertDatabaseHas('fee_invoices', [
            'tenant_id' => $tenant->id,
            'student_id' => $student->id,
            'amount' => 500,
            'paid_amount' => 500,
            'due_amount' => 0,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('fee_invoices', [
            'tenant_id' => $tenant->id,
            'student_id' => $student->id,
            'month' => '2026-09',
            'amount' => 2000,
            'paid_amount' => 2000,
            'due_amount' => 0,
            'status' => 'paid',
        ]);

        // Verify 2 payments and 2 receipts
        $payments = \App\Models\Payment::where('student_id', $student->id)->get();
        $this->assertCount(2, $payments);
        $this->assertEquals(2500, $payments->sum('amount'));

        $receipts = \App\Models\Receipt::where('tenant_id', $tenant->id)->get();
        $this->assertCount(2, $receipts);

        // Verify payments index page returns proper collections breakdown
        $indexResponse = $this->actingAs($admin)->get(route('admin.payments.index'));
        $indexResponse->assertOk();
        $indexResponse->assertInertia(fn ($page) => $page
            ->component('admin/payments/index')
            ->where('summary.total_collected', 2500)
            ->where('summary.monthly_collected', 2000)
            ->where('summary.admission_collected', 500)
        );
    }
}

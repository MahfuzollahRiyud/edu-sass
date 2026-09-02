<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_teacher_account_with_assignments()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 9']);
        $subject = Subject::create(['tenant_id' => $tenant->id, 'name' => 'General Math']);
        $classSubject = ClassSubject::create([
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.teachers.store'), [
            'name' => 'Sir Isaac',
            'email' => 'isaac@newton.com',
            'password' => 'password123',
            'phone' => '01711000000',
            'designation' => 'Math Faculty',
            'class_subject_ids' => [$classSubject->id],
        ]);

        $response->assertRedirect(route('admin.teachers.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'isaac@newton.com',
            'role' => 'teacher',
            'tenant_id' => $tenant->id,
        ]);

        $this->assertDatabaseHas('teachers', [
            'tenant_id' => $tenant->id,
            'designation' => 'Math Faculty',
        ]);

        $this->assertDatabaseHas('teacher_assignments', [
            'tenant_id' => $tenant->id,
            'class_subject_id' => $classSubject->id,
        ]);
    }

    public function test_teacher_can_login_and_access_teacher_dashboard()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $user = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        Teacher::create(['tenant_id' => $tenant->id, 'user_id' => $user->id, 'phone' => '01700000000']);

        $response = $this->actingAs($user)->get(route('teacher.dashboard'));

        $response->assertOk();
    }

    public function test_teacher_can_view_my_students_page()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $user = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        $teacher = Teacher::create(['tenant_id' => $tenant->id, 'user_id' => $user->id, 'phone' => '01700000000']);

        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 10']);
        $subject = Subject::create(['tenant_id' => $tenant->id, 'name' => 'Physics']);
        $classSubject = ClassSubject::create([
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);
        $teacher->classSubjects()->attach($classSubject->id, ['tenant_id' => $tenant->id]);

        $response = $this->actingAs($user)->get(route('teacher.students.index'));

        $response->assertOk();
    }
}

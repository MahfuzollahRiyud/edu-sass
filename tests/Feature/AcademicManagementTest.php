<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Subject;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_academic_class()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $response = $this->actingAs($admin)->post(route('admin.classes.store'), [
            'name' => 'Class 10',
            'section' => 'Science',
            'sort_order' => 1,
        ]);

        $response->assertRedirect(route('admin.classes.index'));
        $this->assertDatabaseHas('academic_classes', [
            'tenant_id' => $tenant->id,
            'name' => 'Class 10',
            'section' => 'Science',
        ]);
    }

    public function test_admin_can_create_subject_and_assign_to_class()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $class = AcademicClass::create([
            'tenant_id' => $tenant->id,
            'name' => 'HSC Batch',
            'section' => 'A',
        ]);

        $subject = Subject::create([
            'tenant_id' => $tenant->id,
            'name' => 'Physics 1st Paper',
            'code' => 'PHY-101',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.classes.subjects.store', $class), [
            'subject_id' => $subject->id,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('class_subjects', [
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);
    }
}

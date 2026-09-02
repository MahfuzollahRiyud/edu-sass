<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrossTenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_a_cannot_see_or_modify_tenant_b_classes()
    {
        $tenantA = Tenant::create(['name' => 'Coaching Alpha', 'slug' => 'coaching-alpha']);
        $tenantB = Tenant::create(['name' => 'Coaching Beta', 'slug' => 'coaching-beta']);

        $adminA = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenantA->id]);
        $adminB = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenantB->id]);

        $classA = AcademicClass::create(['tenant_id' => $tenantA->id, 'name' => 'Alpha Class 10']);
        $classB = AcademicClass::create(['tenant_id' => $tenantB->id, 'name' => 'Beta Class 10']);

        // Admin A visits classes index -> should only see Alpha Class 10
        $response = $this->actingAs($adminA)->get(route('admin.classes.index'));
        $response->assertSee('Alpha Class 10');
        $response->assertDontSee('Beta Class 10');

        // Admin A attempts to edit Beta Class 10 -> global scope returns 404
        $editResponse = $this->actingAs($adminA)->get(route('admin.classes.edit', $classB));
        $editResponse->assertNotFound();
    }

    public function test_tenant_a_cannot_view_tenant_b_students()
    {
        $tenantA = Tenant::create(['name' => 'Coaching Alpha', 'slug' => 'coaching-alpha']);
        $tenantB = Tenant::create(['name' => 'Coaching Beta', 'slug' => 'coaching-beta']);

        $adminA = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenantA->id]);

        $studentUserB = User::factory()->create(['role' => 'student', 'tenant_id' => $tenantB->id]);
        $classB = AcademicClass::create(['tenant_id' => $tenantB->id, 'name' => 'Beta Class']);

        $studentB = Student::create([
            'tenant_id' => $tenantB->id,
            'user_id' => $studentUserB->id,
            'student_id' => 'STU-2026-00099',
            'academic_class_id' => $classB->id,
            'admission_date' => '2026-09-01',
            'monthly_fee' => 1000,
        ]);

        $response = $this->actingAs($adminA)->get(route('admin.students.show', $studentB));
        $response->assertNotFound();
    }
}

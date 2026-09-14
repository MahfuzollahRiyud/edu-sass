<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Subject;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurriculumPresetTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_classes_index_with_curriculum_presets()
    {
        $tenant = Tenant::create(['name' => 'Apex Academy', 'slug' => 'apex-academy']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $response = $this->actingAs($admin)->get(route('admin.classes.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/classes/index')
            ->has('curriculumPresets')
            ->has('curriculumPresets.class_6_general')
            ->has('curriculumPresets.class_9_science')
            ->has('curriculumPresets.class_10_business')
        );
    }

    public function test_admin_can_import_full_bangladeshi_curriculum()
    {
        $tenant = Tenant::create(['name' => 'Apex Academy', 'slug' => 'apex-academy']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $presetsToImport = [
            'class_6_general',
            'class_7_general',
            'class_8_general',
            'class_9_science',
            'class_9_business',
            'class_9_humanities',
            'class_10_science',
            'class_10_business',
            'class_10_humanities',
        ];

        $response = $this->actingAs($admin)->post(route('admin.classes.import-curriculum'), [
            'selected_classes' => $presetsToImport,
        ]);

        $response->assertRedirect(route('admin.classes.index'));
        $response->assertSessionHasNoErrors();

        // Check classes created
        $this->assertDatabaseHas('academic_classes', [
            'tenant_id' => $tenant->id,
            'name' => 'Class 6',
            'section' => 'General',
        ]);
        $this->assertDatabaseHas('academic_classes', [
            'tenant_id' => $tenant->id,
            'name' => 'Class 9',
            'section' => 'Science',
        ]);
        $this->assertDatabaseHas('academic_classes', [
            'tenant_id' => $tenant->id,
            'name' => 'Class 9',
            'section' => 'Business Studies',
        ]);
        $this->assertDatabaseHas('academic_classes', [
            'tenant_id' => $tenant->id,
            'name' => 'Class 10',
            'section' => 'Humanities',
        ]);

        // Check 1st & 2nd paper subjects created
        $this->assertDatabaseHas('subjects', [
            'tenant_id' => $tenant->id,
            'name' => 'Bangla 1st Paper',
        ]);
        $this->assertDatabaseHas('subjects', [
            'tenant_id' => $tenant->id,
            'name' => 'Bangla 2nd Paper',
        ]);
        $this->assertDatabaseHas('subjects', [
            'tenant_id' => $tenant->id,
            'name' => 'English 1st Paper',
        ]);
        $this->assertDatabaseHas('subjects', [
            'tenant_id' => $tenant->id,
            'name' => 'English 2nd Paper',
        ]);
        $this->assertDatabaseHas('subjects', [
            'tenant_id' => $tenant->id,
            'name' => 'General Mathematics',
        ]);
        $this->assertDatabaseHas('subjects', [
            'tenant_id' => $tenant->id,
            'name' => 'Higher Mathematics',
        ]);

        // Check class-subject link
        $class9Sci = AcademicClass::where('tenant_id', $tenant->id)
            ->where('name', 'Class 9')
            ->where('section', 'Science')
            ->first();

        $higherMath = Subject::where('tenant_id', $tenant->id)
            ->where('name', 'Higher Mathematics')
            ->first();

        $this->assertNotNull($class9Sci);
        $this->assertNotNull($higherMath);

        $this->assertDatabaseHas('class_subjects', [
            'tenant_id' => $tenant->id,
            'academic_class_id' => $class9Sci->id,
            'subject_id' => $higherMath->id,
        ]);
    }

    public function test_curriculum_import_is_idempotent()
    {
        $tenant = Tenant::create(['name' => 'Apex Academy', 'slug' => 'apex-academy']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $presets = ['class_9_science', 'class_10_science'];

        // First import
        $this->actingAs($admin)->post(route('admin.classes.import-curriculum'), [
            'selected_classes' => $presets,
        ]);

        $initialClassesCount = AcademicClass::where('tenant_id', $tenant->id)->count();
        $initialSubjectsCount = Subject::where('tenant_id', $tenant->id)->count();
        $initialMappingsCount = ClassSubject::where('tenant_id', $tenant->id)->count();

        // Second import with same keys
        $response = $this->actingAs($admin)->post(route('admin.classes.import-curriculum'), [
            'selected_classes' => $presets,
        ]);

        $response->assertSessionHasNoErrors();

        // Ensure counts are identical (no duplicates created)
        $this->assertEquals($initialClassesCount, AcademicClass::where('tenant_id', $tenant->id)->count());
        $this->assertEquals($initialSubjectsCount, Subject::where('tenant_id', $tenant->id)->count());
        $this->assertEquals($initialMappingsCount, ClassSubject::where('tenant_id', $tenant->id)->count());
    }

    public function test_validation_fails_when_no_classes_selected()
    {
        $tenant = Tenant::create(['name' => 'Apex Academy', 'slug' => 'apex-academy']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $response = $this->actingAs($admin)->post(route('admin.classes.import-curriculum'), [
            'selected_classes' => [],
        ]);

        $response->assertSessionHasErrors('selected_classes');
    }
}

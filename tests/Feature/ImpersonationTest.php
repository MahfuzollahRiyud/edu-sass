<?php

namespace Tests\Feature;

use App\Models\Teacher;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImpersonationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_impersonate_teacher_and_switch_back()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);

        $admin = User::factory()->create([
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'is_active' => true,
        ]);

        $teacherUser = User::factory()->create([
            'role' => 'teacher',
            'tenant_id' => $tenant->id,
            'is_active' => true,
        ]);

        $teacher = Teacher::create([
            'tenant_id' => $tenant->id,
            'user_id' => $teacherUser->id,
        ]);

        // 1. Admin impersonates teacher
        $response = $this->actingAs($admin)->post(route('impersonate', $teacherUser));

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertEquals($teacherUser->id, auth()->id());
        $this->assertEquals($admin->id, session('impersonator_id'));

        // 2. Teacher dashboard view contains impersonation state
        $dashResponse = $this->get(route('teacher.dashboard'));
        $dashResponse->assertOk();

        // 3. Leave impersonation
        $leaveResponse = $this->post(route('impersonate.leave'));
        $leaveResponse->assertRedirect(route('admin.dashboard'));
        $this->assertEquals($admin->id, auth()->id());
        $this->assertFalse(session()->has('impersonator_id'));
    }

    public function test_admin_cannot_impersonate_user_from_different_tenant()
    {
        $tenantA = Tenant::create(['name' => 'Center A', 'slug' => 'center-a']);
        $tenantB = Tenant::create(['name' => 'Center B', 'slug' => 'center-b']);

        $adminA = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenantA->id]);
        $teacherB = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenantB->id]);

        $response = $this->actingAs($adminA)->post(route('impersonate', $teacherB));
        $response->assertForbidden();
    }

    public function test_super_admin_can_enter_any_coaching_center_and_switch_back()
    {
        $superAdmin = User::factory()->create([
            'role' => 'super_admin',
            'tenant_id' => null,
            'email_verified_at' => now(),
        ]);
        $tenant = Tenant::create(['name' => 'Branch 1', 'slug' => 'branch-1']);
        $tenantAdmin = User::factory()->create([
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        // 1. Super Admin enters coaching center
        $response = $this->actingAs($superAdmin)->post(route('super-admin.tenants.enter', $tenant));
        $response->assertRedirect(route('admin.dashboard'));
        $this->assertEquals($tenantAdmin->id, auth()->id());
        $this->assertEquals($superAdmin->id, session('impersonator_id'));

        // 2. Return back to Super Admin
        $leaveResponse = $this->withSession([
            'impersonator_id' => $superAdmin->id,
            'impersonator_role' => 'super_admin',
        ])->actingAs($tenantAdmin)->post(route('impersonate.leave'));

        $leaveResponse->assertRedirect(route('super-admin.dashboard'));
        $this->assertEquals($superAdmin->id, auth()->id());
    }

    public function test_super_admin_can_reset_tenant_admin_password()
    {
        $superAdmin = User::factory()->create([
            'role' => 'super_admin',
            'tenant_id' => null,
            'email_verified_at' => now(),
        ]);
        $tenant = Tenant::create(['name' => 'Branch 2', 'slug' => 'branch-2']);
        $tenantAdmin = User::factory()->create([
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($superAdmin)->post(route('super-admin.tenants.reset-admin-password', $tenant), [
            'admin_user_id' => $tenantAdmin->id,
            'new_password' => 'brand_new_secret_123',
        ]);

        $response->assertRedirect();
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('brand_new_secret_123', $tenantAdmin->fresh()->password));
    }
}

<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_super_admin_is_redirected_to_super_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'super_admin']);
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('super-admin.dashboard'));
    }

    public function test_super_admin_can_visit_super_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'super_admin']);
        $this->actingAs($user);

        $response = $this->get(route('super-admin.dashboard'));
        $response->assertOk();
    }

    public function test_admin_can_visit_admin_dashboard()
    {
        $tenant = Tenant::create(['name' => 'Test Coaching', 'slug' => 'test-coaching']);
        $user = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);
        $this->actingAs($user);

        $response = $this->get(route('admin.dashboard'));
        $response->assertOk();
    }

    public function test_student_cannot_visit_super_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'student']);
        $this->actingAs($user);

        $response = $this->get(route('super-admin.dashboard'));
        $response->assertForbidden();
    }
}

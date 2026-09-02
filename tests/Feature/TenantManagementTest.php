<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_view_tenants_list()
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        Tenant::create(['name' => 'ABC Academy', 'slug' => 'abc-academy']);

        $response = $this->actingAs($superAdmin)->get(route('super-admin.tenants.index'));

        $response->assertOk();
        $response->assertSee('ABC Academy');
    }

    public function test_super_admin_can_create_a_tenant_with_admin_user()
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($superAdmin)->post(route('super-admin.tenants.store'), [
            'name' => 'Bright Future Coaching',
            'slug' => 'bright-future',
            'email' => 'contact@brightfuture.com',
            'phone' => '01711223344',
            'address' => 'Dhaka, Bangladesh',
            'admin_name' => 'Karim Admin',
            'admin_email' => 'admin@brightfuture.com',
            'admin_password' => 'password123',
        ]);

        $response->assertRedirect(route('super-admin.tenants.index'));

        $this->assertDatabaseHas('tenants', [
            'name' => 'Bright Future Coaching',
            'slug' => 'bright-future',
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Karim Admin',
            'email' => 'admin@brightfuture.com',
            'role' => 'admin',
        ]);
    }

    public function test_super_admin_can_toggle_tenant_status()
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center', 'is_active' => true]);

        $response = $this->actingAs($superAdmin)->patch(route('super-admin.tenants.toggle-status', $tenant));

        $response->assertRedirect(route('super-admin.tenants.index'));
        $this->assertDatabaseHas('tenants', [
            'id' => $tenant->id,
            'is_active' => false,
        ]);
    }

    public function test_regular_admin_cannot_access_super_admin_routes()
    {
        $tenant = Tenant::create(['name' => 'Regular Center', 'slug' => 'regular-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $response = $this->actingAs($admin)->get(route('super-admin.tenants.index'));

        $response->assertForbidden();
    }
}

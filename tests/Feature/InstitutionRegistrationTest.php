<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstitutionRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_page_can_be_rendered(): void
    {
        $response = $this->get(route('institution.register'));

        $response->assertStatus(200);
    }

    public function test_institution_can_self_register_and_is_set_to_pending(): void
    {
        $response = $this->post(route('institution.register.store'), [
            'name' => 'Future Leaders Coaching',
            'slug' => 'future-leaders',
            'email' => 'contact@futureleaders.com',
            'phone' => '01700000000',
            'address' => 'Mirpur, Dhaka',
            'admin_name' => 'Kamal Hossain',
            'admin_email' => 'kamal@futureleaders.com',
            'admin_password' => 'password123',
            'admin_password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('institution.register.pending'));

        // Verify tenant is created with status pending and is_active = false
        $this->assertDatabaseHas('tenants', [
            'name' => 'Future Leaders Coaching',
            'slug' => 'future-leaders',
            'status' => 'pending',
            'is_active' => false,
        ]);

        // Verify admin user is created as inactive
        $this->assertDatabaseHas('users', [
            'name' => 'Kamal Hossain',
            'email' => 'kamal@futureleaders.com',
            'role' => 'admin',
            'is_active' => false,
        ]);
    }

    public function test_pending_tenant_admin_cannot_access_admin_dashboard(): void
    {
        $tenant = Tenant::create([
            'name' => 'Pending Coaching Academy',
            'slug' => 'pending-coaching',
            'phone' => '01800000000',
            'is_active' => false,
            'status' => 'pending',
        ]);

        $admin = User::create([
            'name' => 'Pending Admin',
            'email' => 'pending_admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        // Should be logged out and redirected to login with notice
        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }

    public function test_super_admin_can_approve_pending_institution(): void
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);

        $tenant = Tenant::create([
            'name' => 'Pending Institute',
            'slug' => 'pending-institute',
            'phone' => '01900000000',
            'is_active' => false,
            'status' => 'pending',
        ]);

        $admin = User::create([
            'name' => 'Institute Admin',
            'email' => 'admin@pendinginstitute.com',
            'password' => 'password',
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($superAdmin)->post(route('super-admin.tenants.approve', $tenant));

        $response->assertRedirect();

        // Check tenant is approved and active
        $this->assertDatabaseHas('tenants', [
            'id' => $tenant->id,
            'status' => 'approved',
            'is_active' => true,
        ]);

        // Check admin user is active
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'is_active' => true,
        ]);
    }

    public function test_super_admin_can_reject_pending_institution(): void
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);

        $tenant = Tenant::create([
            'name' => 'Fake Institute',
            'slug' => 'fake-institute',
            'phone' => '01900000000',
            'is_active' => false,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($superAdmin)->post(route('super-admin.tenants.reject', $tenant), [
            'rejection_reason' => 'Invalid phone number provided.',
        ]);

        $response->assertRedirect();

        // Check tenant is rejected and inactive
        $this->assertDatabaseHas('tenants', [
            'id' => $tenant->id,
            'status' => 'rejected',
            'is_active' => false,
            'rejection_reason' => 'Invalid phone number provided.',
        ]);
    }
}

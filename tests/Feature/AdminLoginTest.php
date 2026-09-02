<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_admin_login_and_dashboard_redirect()
    {
        $tenant = Tenant::create([
            'name' => 'Apex Coaching Academy',
            'slug' => 'apex-coaching',
        ]);

        $admin = User::factory()->create([
            'email' => 'admin@demo.com',
            'password' => 'password',
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'is_active' => true,
        ]);

        $loginResponse = $this->post('/login', [
            'email' => 'admin@demo.com',
            'password' => 'password',
        ]);

        $loginResponse->assertRedirect('/dashboard');

        $dashResponse = $this->actingAs($admin)->get('/dashboard');
        $dashResponse->assertRedirect(route('admin.dashboard'));

        $adminDashResponse = $this->actingAs($admin)->get(route('admin.dashboard'));
        $adminDashResponse->assertOk();
    }
}

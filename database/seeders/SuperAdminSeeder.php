<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Create the Super Admin user if it doesn't already exist.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'superadmin@edu-sass.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'role' => 'super_admin',
                'tenant_id' => null,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}

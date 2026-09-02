<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('super-admin/dashboard', [
            'stats' => [
                'total_tenants' => Tenant::count(),
                'active_tenants' => Tenant::where('is_active', true)->count(),
                'pending_tenants' => Tenant::where('status', 'pending')->count(),
                'total_users' => User::where('role', '!=', 'super_admin')->count(),
            ],
        ]);
    }
}

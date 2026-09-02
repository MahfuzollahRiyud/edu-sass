<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(Request $request): Response
    {
        $statusFilter = $request->query('status', 'all');

        $query = Tenant::withCount('users')->latest();

        if ($statusFilter === 'pending') {
            $query->where('status', 'pending');
        } elseif ($statusFilter === 'approved') {
            $query->where('status', 'approved');
        } elseif ($statusFilter === 'rejected') {
            $query->where('status', 'rejected');
        } elseif ($statusFilter === 'active') {
            $query->where('is_active', true);
        } elseif ($statusFilter === 'inactive') {
            $query->where('is_active', false);
        }

        $tenants = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => Tenant::count(),
            'pending' => Tenant::where('status', 'pending')->count(),
            'approved' => Tenant::where('status', 'approved')->count(),
            'rejected' => Tenant::where('status', 'rejected')->count(),
        ];

        return Inertia::render('super-admin/tenants/index', [
            'tenants' => $tenants,
            'currentFilter' => $statusFilter,
            'counts' => $counts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('super-admin/tenants/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:tenants,slug'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            // Admin account fields
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'admin_password' => ['required', 'string', 'min:8'],
        ]);

        $tenant = Tenant::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_active' => true,
            'status' => 'approved',
        ]);

        // Create the tenant admin user
        User::create([
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'password' => $validated['admin_password'],
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Coaching center created successfully.']);

        return redirect()->route('super-admin.tenants.index');
    }

    public function edit(Tenant $tenant): Response
    {
        $tenant->load('admins');

        return Inertia::render('super-admin/tenants/edit', [
            'tenant' => $tenant,
        ]);
    }

    public function update(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('tenants', 'slug')->ignore($tenant->id)],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $tenant->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Coaching center updated successfully.']);

        return redirect()->route('super-admin.tenants.index');
    }

    public function approve(Tenant $tenant): RedirectResponse
    {
        $tenant->update([
            'status' => 'approved',
            'is_active' => true,
            'rejection_reason' => null,
        ]);

        // Activate the admin user(s) of this tenant
        $tenant->users()->where('role', 'admin')->update([
            'is_active' => true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Coaching center '{$tenant->name}' has been approved and activated.",
        ]);

        return redirect()->back(fallback: route('super-admin.tenants.index'));
    }

    public function reject(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $tenant->update([
            'status' => 'rejected',
            'is_active' => false,
            'rejection_reason' => $validated['rejection_reason'] ?? 'Registration application was declined.',
        ]);

        // Deactivate all users of this tenant
        $tenant->users()->update([
            'is_active' => false,
        ]);

        Inertia::flash('toast', [
            'type' => 'warning',
            'message' => "Registration for '{$tenant->name}' has been rejected.",
        ]);

        return redirect()->back(fallback: route('super-admin.tenants.index'));
    }

    public function enter(Request $request, Tenant $tenant): RedirectResponse
    {
        $superAdmin = $request->user();

        if ($superAdmin->role !== 'super_admin') {
            abort(403, 'Unauthorized.');
        }

        $tenantAdmin = User::where('tenant_id', $tenant->id)
            ->where('role', 'admin')
            ->first();

        if (! $tenantAdmin) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'No admin user found for this coaching center.']);
            return redirect()->back(fallback: route('super-admin.tenants.index'));
        }

        // Save super admin session for 1-click return
        $request->session()->put('impersonator_id', $superAdmin->id);
        $request->session()->put('impersonator_role', 'super_admin');

        \Illuminate\Support\Facades\Auth::login($tenantAdmin);
        app()->instance('current_tenant_id', $tenant->id);

        return redirect()->route('admin.dashboard');
    }

    public function resetAdminPassword(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'admin_user_id' => ['required', 'exists:users,id'],
            'new_password' => ['required', 'string', 'min:8'],
        ]);

        $adminUser = User::where('tenant_id', $tenant->id)->findOrFail($validated['admin_user_id']);
        $adminUser->update(['password' => $validated['new_password']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Password reset successfully for ' . $adminUser->name]);

        return redirect()->back(fallback: route('super-admin.tenants.index'));
    }

    public function toggleStatus(Tenant $tenant): RedirectResponse
    {
        $newActive = ! $tenant->is_active;
        $tenant->update([
            'is_active' => $newActive,
            'status' => $newActive ? 'approved' : 'rejected',
        ]);

        $status = $newActive ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Coaching center {$status} successfully."]);

        return redirect()->back(fallback: route('super-admin.tenants.index'));
    }
}

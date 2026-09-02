<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionRegistrationController extends Controller
{
    /**
     * Show the institution registration form.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register-institution');
    }

    /**
     * Handle incoming institution registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Institute details
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:tenants,slug', 'regex:/^[a-z0-9-]+$/i'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],

            // Admin account details
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'admin_password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'slug.regex' => 'The subdomain/slug may only contain letters, numbers, and hyphens.',
            'admin_email.unique' => 'This email address is already registered as an administrator account.',
            'admin_password.confirmed' => 'The password confirmation does not match.',
        ]);

        $baseSlug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Tenant::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        DB::transaction(function () use ($validated, $slug, &$tenant) {
            $tenant = Tenant::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
                'is_active' => false,
                'status' => 'pending',
            ]);

            User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => $validated['admin_password'],
                'role' => 'admin',
                'tenant_id' => $tenant->id,
                'is_active' => false,
                'email_verified_at' => now(),
            ]);
        });

        return redirect()->route('institution.register.pending')->with('registered_institution', [
            'name' => $tenant->name,
            'admin_email' => $validated['admin_email'],
        ]);
    }

    /**
     * Show the pending registration acknowledgment screen.
     */
    public function pendingNotice(Request $request): Response
    {
        $institution = $request->session()->get('registered_institution');

        return Inertia::render('auth/registration-pending', [
            'institution' => $institution,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonateController extends Controller
{
    /**
     * Impersonate a teacher or student account.
     */
    public function impersonate(Request $request, User $user): RedirectResponse
    {
        $currentAdmin = $request->user();

        // Security check: Only admin or super_admin can impersonate
        if (! in_array($currentAdmin->role, ['admin', 'super_admin'], true)) {
            abort(403, 'Unauthorized.');
        }

        // Tenant isolation: Admin can only impersonate users within their own tenant
        if ($currentAdmin->role === 'admin' && $user->tenant_id !== $currentAdmin->tenant_id) {
            abort(403, 'Cannot impersonate a user from a different coaching center.');
        }

        // Do not allow impersonating another super admin
        if ($user->role === 'super_admin') {
            abort(403, 'Cannot impersonate a Super Admin.');
        }

        // Save original admin ID in session if not already impersonating
        if (! $request->session()->has('impersonator_id')) {
            $request->session()->put('impersonator_id', $currentAdmin->id);
            $request->session()->put('impersonator_role', $currentAdmin->role);
        }

        // Login as the target user
        Auth::login($user);

        if ($user->tenant_id) {
            app()->instance('current_tenant_id', $user->tenant_id);
        }

        return redirect()->route($user->dashboardRoute());
    }

    /**
     * Stop impersonating and return to original admin account.
     */
    public function leave(Request $request): RedirectResponse
    {
        $impersonatorId = $request->session()->get('impersonator_id');

        if (! $impersonatorId) {
            return redirect('/');
        }

        $originalAdmin = User::withoutGlobalScopes()->findOrFail($impersonatorId);

        // Re-login as original admin
        Auth::login($originalAdmin);

        // Clear impersonation session
        $request->session()->forget('impersonator_id');
        $request->session()->forget('impersonator_role');

        if ($originalAdmin->tenant_id) {
            app()->instance('current_tenant_id', $originalAdmin->tenant_id);
        } else {
            app()->forgetInstance('current_tenant_id');
        }

        return redirect()->route($originalAdmin->dashboardRoute());
    }
}

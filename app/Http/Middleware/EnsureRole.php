<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Ensure the authenticated user has one of the allowed roles.
     *
     * Usage in routes:
     *   ->middleware(EnsureRole::class.':super_admin')
     *   ->middleware(EnsureRole::class.':admin,super_admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, 'Unauthorized.');
        }

        if ($user->tenant_id) {
            app()->instance('current_tenant_id', $user->tenant_id);
        }

        // Check if user account is active
        if ($user->is_active === false || $user->is_active === 0) {
            $msg = 'Your account has been deactivated.';
            if ($user->tenant) {
                if ($user->tenant->status === 'pending' || ! $user->tenant->is_active) {
                    $msg = 'Your coaching center registration is currently pending approval by the Super Admin.';
                } elseif ($user->tenant->status === 'rejected') {
                    $msg = 'Your coaching center registration request was not approved: ' . ($user->tenant->rejection_reason ?? 'Contact support for more details.');
                }
            }

            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', $msg);
        }

        // Check if tenant itself is inactive/pending
        if ($user->tenant && (! $user->tenant->is_active || $user->tenant->status !== 'approved')) {
            $msg = match ($user->tenant->status) {
                'pending' => 'Your coaching center registration is currently pending approval by the Super Admin.',
                'rejected' => 'Your coaching center registration request was not approved: ' . ($user->tenant->rejection_reason ?? 'Contact support for details.'),
                default => 'Your coaching center account has been suspended or deactivated.',
            };

            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', $msg);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetTenantContext
{
    /**
     * Resolve the current tenant from the authenticated user and bind it
     * to the service container. This is the single source of truth for
     * tenant identification — never trust tenant_id from request input.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = $request->user()) {
            if ($user->tenant_id) {
                app()->instance('current_tenant_id', $user->tenant_id);
            }
        }

        return $next($request);
    }
}

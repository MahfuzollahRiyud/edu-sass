<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'tenant_id' => $user->tenant_id,
                    'email_verified_at' => $user->email_verified_at,
                    'is_active' => $user->is_active,
                ] : null,
            ],
            'tenant' => $user?->tenant_id ? [
                'id' => $user->tenant_id,
                'name' => $user->tenant?->name ?? 'Coaching Center',
                'email' => $user->tenant?->email,
                'phone' => $user->tenant?->phone,
                'address' => $user->tenant?->address,
            ] : null,
            'isImpersonating' => $request->session()->has('impersonator_id'),
            'impersonatorRole' => $request->session()->get('impersonator_role'),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}

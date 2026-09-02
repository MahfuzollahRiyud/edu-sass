<?php

use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\TenantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:super_admin'])
    ->prefix('super-admin')
    ->name('super-admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Tenant management
        Route::resource('tenants', TenantController::class);
        Route::post('tenants/{tenant}/approve', [TenantController::class, 'approve'])
            ->name('tenants.approve');
        Route::post('tenants/{tenant}/reject', [TenantController::class, 'reject'])
            ->name('tenants.reject');
        Route::patch('tenants/{tenant}/toggle-status', [TenantController::class, 'toggleStatus'])
            ->name('tenants.toggle-status');
        Route::post('tenants/{tenant}/enter', [TenantController::class, 'enter'])
            ->name('tenants.enter');
        Route::post('tenants/{tenant}/reset-admin-password', [TenantController::class, 'resetAdminPassword'])
            ->name('tenants.reset-admin-password');
    });

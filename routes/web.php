<?php

use App\Http\Controllers\InstitutionRegistrationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Institution Self-Registration (Public)
Route::get('register-institution', [InstitutionRegistrationController::class, 'create'])
    ->name('institution.register');
Route::post('register-institution', [InstitutionRegistrationController::class, 'store'])
    ->name('institution.register.store');
Route::get('registration-pending', [InstitutionRegistrationController::class, 'pendingNotice'])
    ->name('institution.register.pending');

Route::middleware(['auth', 'verified'])->group(function () {
    // Generic dashboard — redirects to role-specific dashboard
    Route::get('dashboard', function () {
        $user = auth()->user();
        return redirect()->route($user->dashboardRoute());
    })->name('dashboard');

    // Impersonation routes
    Route::post('impersonate/{user}', [App\Http\Controllers\ImpersonateController::class, 'impersonate'])->name('impersonate');
    Route::post('impersonate-leave', [App\Http\Controllers\ImpersonateController::class, 'leave'])->name('impersonate.leave');
});

// Super Admin routes
require __DIR__.'/super-admin.php';

// Tenant Admin routes
require __DIR__.'/admin.php';

// Teacher routes
require __DIR__.'/teacher.php';

// Student routes
require __DIR__.'/student.php';

require __DIR__.'/settings.php';

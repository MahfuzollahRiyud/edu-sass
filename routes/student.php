<?php

use App\Http\Controllers\Student\AttendanceController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\FeeController;
use App\Http\Controllers\Student\ResultController;
use App\Http\Controllers\Student\ScheduleController;
use App\Http\Controllers\Student\SubjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('subjects', [SubjectController::class, 'index'])->name('subjects');
        Route::get('routine', [ScheduleController::class, 'index'])->name('routine');
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance');
        Route::get('results', [ResultController::class, 'index'])->name('results.index');
        Route::get('results/{exam}', [ResultController::class, 'show'])->name('results.show');
        Route::get('fees', [FeeController::class, 'index'])->name('fees');
        Route::get('receipts/{receipt}', [FeeController::class, 'showReceipt'])->name('receipts.show');
    });

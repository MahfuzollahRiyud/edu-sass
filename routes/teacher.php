<?php

use App\Http\Controllers\Teacher\AttendanceController;
use App\Http\Controllers\Teacher\DashboardController;
use App\Http\Controllers\Teacher\ExamController;
use App\Http\Controllers\Teacher\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('schedule', [ScheduleController::class, 'index'])->name('schedule');
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('attendance', [AttendanceController::class, 'store'])->name('attendance.store');

        // Exams & Marks Entry
        Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
        Route::get('exams/{exam}/marks', [ExamController::class, 'marks'])->name('exams.marks');
        Route::post('exams/{exam}/marks', [ExamController::class, 'saveMarks'])->name('exams.save-marks');
    });

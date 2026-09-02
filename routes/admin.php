<?php

use App\Http\Controllers\Admin\AcademicClassController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\ClassSubjectController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\FeeInvoiceController;
use App\Http\Controllers\Admin\FeeTypeController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ReceiptController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\TeacherReportController;
use App\Http\Controllers\Admin\TimeSlotController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Classes & Subjects
        Route::resource('classes', AcademicClassController::class);
        Route::patch('classes/{class}/toggle-status', [AcademicClassController::class, 'toggleStatus'])->name('classes.toggle-status');

        Route::resource('subjects', SubjectController::class);
        Route::patch('subjects/{subject}/toggle-status', [SubjectController::class, 'toggleStatus'])->name('subjects.toggle-status');

        Route::get('classes/{class}/subjects', [ClassSubjectController::class, 'index'])->name('classes.subjects.index');
        Route::post('classes/{class}/subjects', [ClassSubjectController::class, 'store'])->name('classes.subjects.store');
        Route::delete('classes/{class}/subjects/{classSubject}', [ClassSubjectController::class, 'destroy'])->name('classes.subjects.destroy');

        // Teachers
        Route::resource('teachers', TeacherController::class);
        Route::patch('teachers/{teacher}/toggle-status', [TeacherController::class, 'toggleStatus'])->name('teachers.toggle-status');

        // Students
        Route::resource('students', StudentController::class);
        Route::patch('students/{student}/toggle-status', [StudentController::class, 'toggleStatus'])->name('students.toggle-status');

        // Time Slots & Scheduling
        Route::resource('time-slots', TimeSlotController::class);
        Route::patch('time-slots/{time_slot}/toggle-status', [TimeSlotController::class, 'toggleStatus'])->name('time-slots.toggle-status');

        Route::resource('schedules', ScheduleController::class);

        // Attendance
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');

        // Exams & Report Cards
        Route::resource('exams', ExamController::class);
        Route::patch('exams/{exam}/toggle-publish', [ExamController::class, 'togglePublish'])->name('exams.toggle-publish');
        Route::get('exams/{exam}/marks', [ExamController::class, 'marks'])->name('exams.marks');
        Route::post('exams/{exam}/marks', [ExamController::class, 'saveMarks'])->name('exams.save-marks');
        Route::get('exams/{exam}/report-card/{student}', [ExamController::class, 'reportCard'])->name('exams.report-card');

        // Fees & Billing
        Route::resource('fee-types', FeeTypeController::class);
        Route::patch('fee-types/{fee_type}/toggle-status', [FeeTypeController::class, 'toggleStatus'])->name('fee-types.toggle-status');

        Route::get('fees', [FeeInvoiceController::class, 'index'])->name('fees.index');
        Route::get('fees/create', [FeeInvoiceController::class, 'create'])->name('fees.create');
        Route::post('fees', [FeeInvoiceController::class, 'store'])->name('fees.store');
        Route::post('fees/generate-monthly', [FeeInvoiceController::class, 'generateMonthlyFees'])->name('fees.generate-monthly');

        // Payments & Receipts
        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('payments/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');

        Route::get('receipts/{receipt}', [ReceiptController::class, 'show'])->name('receipts.show');

        // Reports
        Route::get('reports/teachers', [TeacherReportController::class, 'index'])->name('reports.teachers');
    });

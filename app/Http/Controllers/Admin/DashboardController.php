<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\Payment;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\Teacher;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = date('Y-m-d');
        $todayDayOfWeek = (int) date('w');
        $currentMonth = date('Y-m');

        $totalStudents = Student::where('is_active', true)->count();
        $totalTeachers = Teacher::where('is_active', true)->count();
        $totalClasses = AcademicClass::where('is_active', true)->count();

        // Financial stats
        $totalDue = FeeInvoice::sum('due_amount');
        $todayCollection = Payment::where('payment_date', $today)->sum('amount');
        $monthlyCollection = Payment::where('payment_date', 'LIKE', "{$currentMonth}%")->sum('amount');

        // Today's classes
        $todaySchedules = Schedule::with(['classSubject.academicClass', 'classSubject.subject', 'teacher.user', 'timeSlot'])
            ->where('day_of_week', $todayDayOfWeek)
            ->where('is_active', true)
            ->orderBy('time_slot_id')
            ->get();

        // Today's attendance summary
        $todayAttendanceCount = Attendance::where('attendance_date', $today)->count();
        $todayPresentCount = Attendance::where('attendance_date', $today)->where('status', 'present')->count();

        // Recent admissions
        $recentStudents = Student::with(['user', 'academicClass'])
            ->latest()
            ->take(5)
            ->get();

        // Recent payments
        $recentPayments = Payment::with(['student.user', 'invoice.feeType', 'receipt'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_classes' => $totalClasses,
                'total_due' => (float) $totalDue,
                'today_collection' => (float) $todayCollection,
                'monthly_collection' => (float) $monthlyCollection,
                'today_classes_count' => $todaySchedules->count(),
                'today_attendance_marked' => $todayAttendanceCount,
                'today_present_marked' => $todayPresentCount,
            ],
            'todaySchedules' => $todaySchedules,
            'recentStudents' => $recentStudents,
            'recentPayments' => $recentPayments,
            'todayDate' => date('l, d F Y'),
        ]);
    }
}

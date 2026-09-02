<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = Student::with(['academicClass', 'studentSubjects.classSubject.subject', 'studentSubjects.classSubject.teachers.user'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        $todayDayOfWeek = (int) date('w');
        $classSubjectIds = $student->studentSubjects->pluck('class_subject_id');

        // Today's classes for student
        $todaySchedules = Schedule::with(['classSubject.subject', 'teacher.user', 'timeSlot'])
            ->whereIn('class_subject_id', $classSubjectIds)
            ->where('day_of_week', $todayDayOfWeek)
            ->where('is_active', true)
            ->orderBy('time_slot_id')
            ->get();

        // Attendance stats
        $totalAttendance = Attendance::where('student_id', $student->id)->count();
        $presentAttendance = Attendance::where('student_id', $student->id)->where('status', 'present')->count();
        $attendancePercentage = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 100;

        // Fee stats
        $totalFeeDue = FeeInvoice::where('student_id', $student->id)->sum('due_amount');
        $totalFeePaid = FeeInvoice::where('student_id', $student->id)->sum('paid_amount');

        return Inertia::render('student/dashboard', [
            'student' => $student,
            'todaySchedules' => $todaySchedules,
            'stats' => [
                'enrolled_subjects_count' => $student->studentSubjects->count(),
                'today_classes_count' => $todaySchedules->count(),
                'attendance_percentage' => $attendancePercentage,
                'total_due' => (float) $totalFeeDue,
                'total_paid' => (float) $totalFeePaid,
            ],
            'todayDate' => date('l, d F Y'),
        ]);
    }
}

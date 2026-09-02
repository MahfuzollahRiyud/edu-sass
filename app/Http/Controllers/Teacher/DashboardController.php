<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $teacher = Teacher::with(['classSubjects.academicClass', 'classSubjects.subject'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        $todayDayOfWeek = (int) date('w');
        $today = date('Y-m-d');

        // Today's classes for this teacher
        $todaySchedules = Schedule::with(['classSubject.academicClass', 'classSubject.subject', 'timeSlot'])
            ->where('teacher_id', $teacher->id)
            ->where('day_of_week', $todayDayOfWeek)
            ->where('is_active', true)
            ->orderBy('time_slot_id')
            ->get();

        // Total assigned classes count
        $assignedClassesCount = $teacher->classSubjects->count();

        // Today's attendance taken
        $attendanceTakenCount = Attendance::whereIn('schedule_id', $todaySchedules->pluck('id'))
            ->where('attendance_date', $today)
            ->count();

        return Inertia::render('teacher/dashboard', [
            'teacher' => $teacher,
            'todaySchedules' => $todaySchedules,
            'stats' => [
                'assigned_subjects_count' => $assignedClassesCount,
                'today_classes_count' => $todaySchedules->count(),
                'attendance_taken_count' => $attendanceTakenCount,
            ],
            'todayDate' => date('l, d F Y'),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $attendances = Attendance::with(['schedule.classSubject.subject', 'schedule.timeSlot'])
            ->where('student_id', $student->id)
            ->latest('attendance_date')
            ->paginate(30);

        $totalCount = Attendance::where('student_id', $student->id)->count();
        $presentCount = Attendance::where('student_id', $student->id)->where('status', 'present')->count();
        $absentCount = Attendance::where('student_id', $student->id)->where('status', 'absent')->count();
        $lateCount = Attendance::where('student_id', $student->id)->where('status', 'late')->count();
        $percentage = $totalCount > 0 ? round(($presentCount / $totalCount) * 100, 1) : 100;

        return Inertia::render('student/attendance', [
            'attendances' => $attendances,
            'summary' => [
                'total' => $totalCount,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'percentage' => $percentage,
            ],
        ]);
    }
}

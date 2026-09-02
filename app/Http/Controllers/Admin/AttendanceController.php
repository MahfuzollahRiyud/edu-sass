<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', date('Y-m-d'));
        $classId = $request->input('class_id');

        $attendances = Attendance::with(['student.user', 'student.academicClass', 'schedule.classSubject.subject', 'schedule.timeSlot', 'marker'])
            ->where('attendance_date', $date)
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('academic_class_id', $classId)))
            ->latest()
            ->paginate(30)
            ->withQueryString();

        $classes = AcademicClass::where('is_active', true)->orderBy('sort_order')->get();

        // Summary counts
        $totalMarked = Attendance::where('attendance_date', $date)
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('academic_class_id', $classId)))
            ->count();
        $present = Attendance::where('attendance_date', $date)
            ->where('status', 'present')
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('academic_class_id', $classId)))
            ->count();
        $absent = Attendance::where('attendance_date', $date)
            ->where('status', 'absent')
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('academic_class_id', $classId)))
            ->count();
        $late = Attendance::where('attendance_date', $date)
            ->where('status', 'late')
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('academic_class_id', $classId)))
            ->count();

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'classes' => $classes,
            'filters' => [
                'date' => $date,
                'class_id' => $classId,
            ],
            'summary' => [
                'total' => $totalMarked,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'percentage' => $totalMarked > 0 ? round(($present / $totalMarked) * 100, 1) : 0,
            ],
        ]);
    }
}

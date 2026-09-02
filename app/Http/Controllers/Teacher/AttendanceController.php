<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

        $schedules = Schedule::with(['classSubject.academicClass', 'classSubject.subject', 'timeSlot'])
            ->where('teacher_id', $teacher->id)
            ->where('is_active', true)
            ->orderBy('day_of_week')
            ->orderBy('time_slot_id')
            ->get();

        $selectedScheduleId = $request->input('schedule_id', $schedules->first()?->id);
        $date = $request->input('date', date('Y-m-d'));

        $selectedSchedule = null;
        $students = collect();
        $existingAttendances = collect();

        if ($selectedScheduleId) {
            $selectedSchedule = Schedule::with(['classSubject.academicClass', 'classSubject.subject', 'timeSlot'])
                ->where('teacher_id', $teacher->id)
                ->find($selectedScheduleId);

            if ($selectedSchedule) {
                // Students enrolled in this class-subject
                $students = $selectedSchedule->classSubject->students()
                    ->with('user')
                    ->where('is_active', true)
                    ->orderBy('student_id')
                    ->get();

                $existingAttendances = Attendance::where('schedule_id', $selectedSchedule->id)
                    ->where('attendance_date', $date)
                    ->get()
                    ->keyBy('student_id');
            }
        }

        return Inertia::render('teacher/attendance/index', [
            'schedules' => $schedules,
            'selectedSchedule' => $selectedSchedule,
            'students' => $students,
            'existingAttendances' => $existingAttendances,
            'date' => $date,
            'days' => Schedule::$days,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'schedule_id' => ['required', 'exists:schedules,id'],
            'attendance_date' => ['required', 'date'],
            'attendances' => ['required', 'array'],
            'attendances.*.student_id' => ['required', 'exists:students,id'],
            'attendances.*.status' => ['required', 'in:present,absent,late'],
            'attendances.*.remarks' => ['nullable', 'string', 'max:255'],
        ]);

        // Security check: teacher must own this schedule
        $schedule = Schedule::where('teacher_id', $teacher->id)
            ->findOrFail($validated['schedule_id']);

        foreach ($validated['attendances'] as $item) {
            Attendance::updateOrCreate(
                [
                    'tenant_id' => $tenantId,
                    'schedule_id' => $schedule->id,
                    'student_id' => $item['student_id'],
                    'attendance_date' => $validated['attendance_date'],
                ],
                [
                    'status' => $item['status'],
                    'remarks' => $item['remarks'] ?? null,
                    'marked_by' => $user->id,
                ]
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Attendance recorded successfully.']);

        return back();
    }
}

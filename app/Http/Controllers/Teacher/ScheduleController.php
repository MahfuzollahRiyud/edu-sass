<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
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

        return Inertia::render('teacher/schedule', [
            'schedules' => $schedules,
            'days' => Schedule::$days,
        ]);
    }
}

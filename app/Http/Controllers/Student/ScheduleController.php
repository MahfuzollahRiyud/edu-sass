<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = Student::with('studentSubjects')->where('user_id', $user->id)->firstOrFail();
        $classSubjectIds = $student->studentSubjects->pluck('class_subject_id');

        $schedules = Schedule::with(['classSubject.subject', 'classSubject.academicClass', 'teacher.user', 'timeSlot'])
            ->whereIn('class_subject_id', $classSubjectIds)
            ->where('is_active', true)
            ->orderBy('day_of_week')
            ->orderBy('time_slot_id')
            ->get();

        return Inertia::render('student/routine', [
            'schedules' => $schedules,
            'days' => Schedule::$days,
            'student' => $student,
        ]);
    }
}

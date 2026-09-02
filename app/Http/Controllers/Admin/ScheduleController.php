<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Schedule;
use App\Models\Teacher;
use App\Models\TimeSlot;
use App\Services\ScheduleConflictChecker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');
        $teacherId = $request->input('teacher_id');
        $dayOfWeek = $request->input('day_of_week');

        $schedules = Schedule::with([
            'classSubject.academicClass',
            'classSubject.subject',
            'teacher.user',
            'timeSlot',
        ])
            ->when($classId, fn ($q) => $q->whereHas('classSubject', fn ($cq) => $cq->where('academic_class_id', $classId)))
            ->when($teacherId, fn ($q) => $q->where('teacher_id', $teacherId))
            ->when($dayOfWeek !== null && $dayOfWeek !== '', fn ($q) => $q->where('day_of_week', $dayOfWeek))
            ->orderBy('day_of_week')
            ->orderBy('time_slot_id')
            ->paginate(20)
            ->withQueryString();

        $classes = AcademicClass::where('is_active', true)->orderBy('sort_order')->get();
        $teachers = Teacher::with('user')->where('is_active', true)->get();
        $timeSlots = TimeSlot::where('is_active', true)->orderBy('start_time')->get();

        return Inertia::render('admin/schedules/index', [
            'schedules' => $schedules,
            'classes' => $classes,
            'teachers' => $teachers,
            'timeSlots' => $timeSlots,
            'days' => Schedule::$days,
            'filters' => [
                'class_id' => $classId,
                'teacher_id' => $teacherId,
                'day_of_week' => $dayOfWeek,
            ],
        ]);
    }

    public function create(): Response
    {
        $classSubjects = ClassSubject::with(['academicClass', 'subject'])
            ->get()
            ->map(fn ($cs) => [
                'id' => $cs->id,
                'name' => $cs->display_name,
            ]);

        $teachers = Teacher::with('user')->where('is_active', true)->get();
        $timeSlots = TimeSlot::where('is_active', true)->orderBy('start_time')->get();

        return Inertia::render('admin/schedules/create', [
            'classSubjects' => $classSubjects,
            'teachers' => $teachers,
            'timeSlots' => $timeSlots,
            'days' => Schedule::$days,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'class_subject_id' => ['required', 'exists:class_subjects,id'],
            'teacher_id' => ['required', 'exists:teachers,id'],
            'time_slot_id' => ['required', 'exists:time_slots,id'],
            'day_of_week' => ['required', 'integer', 'between:0,6'],
            'room' => ['nullable', 'string', 'max:50'],
        ]);

        $conflict = ScheduleConflictChecker::hasConflict(
            $tenantId,
            (int) $validated['day_of_week'],
            (int) $validated['time_slot_id'],
            (int) $validated['teacher_id'],
            (int) $validated['class_subject_id']
        );

        if ($conflict) {
            return back()->withErrors(['time_slot_id' => $conflict]);
        }

        Schedule::create([
            'tenant_id' => $tenantId,
            'class_subject_id' => $validated['class_subject_id'],
            'teacher_id' => $validated['teacher_id'],
            'time_slot_id' => $validated['time_slot_id'],
            'day_of_week' => $validated['day_of_week'],
            'room' => $validated['room'] ?? null,
            'is_active' => true,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Class schedule added successfully.']);

        return redirect()->route('admin.schedules.index');
    }

    public function edit(Schedule $schedule): Response
    {
        $classSubjects = ClassSubject::with(['academicClass', 'subject'])
            ->get()
            ->map(fn ($cs) => [
                'id' => $cs->id,
                'name' => $cs->display_name,
            ]);

        $teachers = Teacher::with('user')->where('is_active', true)->get();
        $timeSlots = TimeSlot::where('is_active', true)->orderBy('start_time')->get();

        return Inertia::render('admin/schedules/edit', [
            'schedule' => $schedule,
            'classSubjects' => $classSubjects,
            'teachers' => $teachers,
            'timeSlots' => $timeSlots,
            'days' => Schedule::$days,
        ]);
    }

    public function update(Request $request, Schedule $schedule): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'class_subject_id' => ['required', 'exists:class_subjects,id'],
            'teacher_id' => ['required', 'exists:teachers,id'],
            'time_slot_id' => ['required', 'exists:time_slots,id'],
            'day_of_week' => ['required', 'integer', 'between:0,6'],
            'room' => ['nullable', 'string', 'max:50'],
        ]);

        $conflict = ScheduleConflictChecker::hasConflict(
            $tenantId,
            (int) $validated['day_of_week'],
            (int) $validated['time_slot_id'],
            (int) $validated['teacher_id'],
            (int) $validated['class_subject_id'],
            $schedule->id
        );

        if ($conflict) {
            return back()->withErrors(['time_slot_id' => $conflict]);
        }

        $schedule->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Class schedule updated successfully.']);

        return redirect()->route('admin.schedules.index');
    }

    public function destroy(Schedule $schedule): RedirectResponse
    {
        $schedule->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Schedule deleted successfully.']);

        return redirect()->route('admin.schedules.index');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimeSlotController extends Controller
{
    public function index(): Response
    {
        $timeSlots = TimeSlot::withCount('schedules')
            ->orderBy('start_time')
            ->paginate(15);

        return Inertia::render('admin/time-slots/index', [
            'timeSlots' => $timeSlots,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/time-slots/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'label' => ['nullable', 'string', 'max:100'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        $exists = TimeSlot::where('start_time', $validated['start_time'])
            ->where('end_time', $validated['end_time'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['start_time' => 'A time slot with these exact hours already exists.']);
        }

        TimeSlot::create([
            'tenant_id' => $tenantId,
            'label' => $validated['label'] ?? null,
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'is_active' => true,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Time slot created successfully.']);

        return redirect()->route('admin.time-slots.index');
    }

    public function edit(TimeSlot $timeSlot): Response
    {
        return Inertia::render('admin/time-slots/edit', [
            'timeSlot' => $timeSlot,
        ]);
    }

    public function update(Request $request, TimeSlot $timeSlot): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['nullable', 'string', 'max:100'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        $exists = TimeSlot::where('start_time', $validated['start_time'])
            ->where('end_time', $validated['end_time'])
            ->where('id', '!=', $timeSlot->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['start_time' => 'A time slot with these exact hours already exists.']);
        }

        $timeSlot->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Time slot updated successfully.']);

        return redirect()->route('admin.time-slots.index');
    }

    public function toggleStatus(TimeSlot $timeSlot): RedirectResponse
    {
        $timeSlot->update(['is_active' => ! $timeSlot->is_active]);

        $status = $timeSlot->is_active ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Time slot {$status} successfully."]);

        return redirect()->route('admin.time-slots.index');
    }

    public function destroy(TimeSlot $timeSlot): RedirectResponse
    {
        if ($timeSlot->schedules()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete time slot with assigned schedules.']);
        }

        $timeSlot->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Time slot deleted successfully.']);

        return redirect()->route('admin.time-slots.index');
    }
}

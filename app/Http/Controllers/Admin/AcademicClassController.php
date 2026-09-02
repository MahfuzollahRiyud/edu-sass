<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicClassController extends Controller
{
    public function index(): Response
    {
        $classes = AcademicClass::withCount(['students', 'subjects'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('admin/classes/index', [
            'classes' => $classes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/classes/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'section' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        // Check unique within tenant
        $exists = AcademicClass::where('name', $validated['name'])
            ->where('section', $validated['section'] ?? null)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'This class and section combination already exists.']);
        }

        AcademicClass::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'section' => $validated['section'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => true,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Class created successfully.']);

        return redirect()->route('admin.classes.index');
    }

    public function edit(AcademicClass $class): Response
    {
        return Inertia::render('admin/classes/edit', [
            'academicClass' => $class,
        ]);
    }

    public function update(Request $request, AcademicClass $class): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'section' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $exists = AcademicClass::where('name', $validated['name'])
            ->where('section', $validated['section'] ?? null)
            ->where('id', '!=', $class->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'This class and section combination already exists.']);
        }

        $class->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Class updated successfully.']);

        return redirect()->route('admin.classes.index');
    }

    public function toggleStatus(AcademicClass $class): RedirectResponse
    {
        $class->update(['is_active' => ! $class->is_active]);

        $status = $class->is_active ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Class {$status} successfully."]);

        return redirect()->route('admin.classes.index');
    }

    public function destroy(AcademicClass $class): RedirectResponse
    {
        if ($class->students()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete class with enrolled students.']);
        }

        $class->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Class deleted successfully.']);

        return redirect()->route('admin.classes.index');
    }
}

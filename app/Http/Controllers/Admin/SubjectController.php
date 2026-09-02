<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(): Response
    {
        $subjects = Subject::withCount(['classes'])
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('admin/subjects/index', [
            'subjects' => $subjects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/subjects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
        ]);

        $exists = Subject::where('name', $validated['name'])->exists();
        if ($exists) {
            return back()->withErrors(['name' => 'A subject with this name already exists.']);
        }

        Subject::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'code' => $validated['code'] ?? null,
            'is_active' => true,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject created successfully.']);

        return redirect()->route('admin.subjects.index');
    }

    public function edit(Subject $subject): Response
    {
        return Inertia::render('admin/subjects/edit', [
            'subject' => $subject,
        ]);
    }

    public function update(Request $request, Subject $subject): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
        ]);

        $exists = Subject::where('name', $validated['name'])
            ->where('id', '!=', $subject->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'A subject with this name already exists.']);
        }

        $subject->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject updated successfully.']);

        return redirect()->route('admin.subjects.index');
    }

    public function toggleStatus(Subject $subject): RedirectResponse
    {
        $subject->update(['is_active' => ! $subject->is_active]);

        $status = $subject->is_active ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Subject {$status} successfully."]);

        return redirect()->route('admin.subjects.index');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject deleted successfully.']);

        return redirect()->route('admin.subjects.index');
    }
}

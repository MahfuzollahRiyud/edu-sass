<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassSubjectController extends Controller
{
    public function index(AcademicClass $class): Response
    {
        $class->load(['classSubjects.subject', 'classSubjects.teachers.user']);
        $availableSubjects = Subject::where('is_active', true)
            ->whereNotIn('id', $class->subjects->pluck('id'))
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/classes/subjects', [
            'academicClass' => $class,
            'availableSubjects' => $availableSubjects,
        ]);
    }

    public function store(Request $request, AcademicClass $class): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'monthly_fee' => ['nullable', 'numeric', 'min:0'],
        ]);

        $exists = ClassSubject::where('academic_class_id', $class->id)
            ->where('subject_id', $validated['subject_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['subject_id' => 'This subject is already assigned to this class.']);
        }

        ClassSubject::create([
            'tenant_id' => $tenantId,
            'academic_class_id' => $class->id,
            'subject_id' => $validated['subject_id'],
            'monthly_fee' => $validated['monthly_fee'] ?? 0.00,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject assigned to class successfully.']);

        return back();
    }

    public function update(Request $request, AcademicClass $class, ClassSubject $classSubject): RedirectResponse
    {
        $validated = $request->validate([
            'monthly_fee' => ['required', 'numeric', 'min:0'],
        ]);

        $classSubject->update([
            'monthly_fee' => $validated['monthly_fee'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject monthly fee updated successfully.']);

        return back();
    }

    public function destroy(AcademicClass $class, ClassSubject $classSubject): RedirectResponse
    {
        $classSubject->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject removed from class successfully.']);

        return back();
    }
}

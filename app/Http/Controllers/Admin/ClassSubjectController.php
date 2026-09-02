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
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject assigned to class successfully.']);

        return back();
    }

    public function destroy(AcademicClass $class, ClassSubject $classSubject): RedirectResponse
    {
        $classSubject->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject removed from class successfully.']);

        return back();
    }
}

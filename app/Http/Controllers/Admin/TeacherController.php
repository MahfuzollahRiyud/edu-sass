<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassSubject;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function index(): Response
    {
        $teachers = Teacher::with(['user', 'classSubjects.academicClass', 'classSubjects.subject'])
            ->withCount('schedules')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/teachers/index', [
            'teachers' => $teachers,
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

        return Inertia::render('admin/teachers/create', [
            'classSubjects' => $classSubjects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            'designation' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'class_subject_ids' => ['nullable', 'array'],
            'class_subject_ids.*' => ['exists:class_subjects,id'],
        ]);

        DB::transaction(function () use ($validated, $tenantId) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'teacher',
                'tenant_id' => $tenantId,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $teacher = Teacher::create([
                'tenant_id' => $tenantId,
                'user_id' => $user->id,
                'phone' => $validated['phone'] ?? null,
                'designation' => $validated['designation'] ?? null,
                'address' => $validated['address'] ?? null,
                'is_active' => true,
            ]);

            if (! empty($validated['class_subject_ids'])) {
                foreach ($validated['class_subject_ids'] as $csId) {
                    TeacherAssignment::create([
                        'tenant_id' => $tenantId,
                        'teacher_id' => $teacher->id,
                        'class_subject_id' => $csId,
                    ]);
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Teacher account created successfully.']);

        return redirect()->route('admin.teachers.index');
    }

    public function edit(Teacher $teacher): Response
    {
        if ($teacher->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $teacher->load(['user', 'classSubjects']);
        $classSubjects = ClassSubject::with(['academicClass', 'subject'])
            ->get()
            ->map(fn ($cs) => [
                'id' => $cs->id,
                'name' => $cs->display_name,
            ]);

        return Inertia::render('admin/teachers/edit', [
            'teacher' => $teacher,
            'assignedClassSubjectIds' => $teacher->classSubjects->pluck('id'),
            'classSubjects' => $classSubjects,
        ]);
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        if ($teacher->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $teacher->user_id],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            'designation' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'class_subject_ids' => ['nullable', 'array'],
            'class_subject_ids.*' => ['exists:class_subjects,id'],
        ]);

        DB::transaction(function () use ($validated, $teacher, $tenantId) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            if (! empty($validated['password'])) {
                $userData['password'] = $validated['password'];
            }
            $teacher->user->update($userData);

            $teacher->update([
                'phone' => $validated['phone'] ?? null,
                'designation' => $validated['designation'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);

            // Sync assignments
            TeacherAssignment::where('teacher_id', $teacher->id)->delete();
            if (! empty($validated['class_subject_ids'])) {
                foreach ($validated['class_subject_ids'] as $csId) {
                    TeacherAssignment::create([
                        'tenant_id' => $tenantId,
                        'teacher_id' => $teacher->id,
                        'class_subject_id' => $csId,
                    ]);
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Teacher updated successfully.']);

        return redirect()->route('admin.teachers.index');
    }

    public function toggleStatus(Teacher $teacher): RedirectResponse
    {
        $teacher->update(['is_active' => ! $teacher->is_active]);
        $teacher->user->update(['is_active' => $teacher->is_active]);

        $status = $teacher->is_active ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Teacher {$status} successfully."]);

        return redirect()->route('admin.teachers.index');
    }
}

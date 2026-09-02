<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassSubject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

        // Get all class-subjects assigned to this teacher
        $assignedClassSubjects = $teacher->classSubjects()
            ->with(['academicClass', 'subject'])
            ->get();

        $selectedClassSubjectId = $request->input('class_subject_id', $assignedClassSubjects->first()?->id);

        $selectedClassSubject = null;
        $students = collect();

        if ($selectedClassSubjectId) {
            $selectedClassSubject = $teacher->classSubjects()
                ->with(['academicClass', 'subject'])
                ->find($selectedClassSubjectId);

            if ($selectedClassSubject) {
                $students = $selectedClassSubject->students()
                    ->with(['user', 'academicClass'])
                    ->where('is_active', true)
                    ->orderBy('student_id')
                    ->get();
            }
        }

        return Inertia::render('teacher/students/index', [
            'assignedClassSubjects' => $assignedClassSubjects,
            'selectedClassSubject' => $selectedClassSubject,
            'students' => $students,
            'filters' => [
                'class_subject_id' => $selectedClassSubjectId,
            ],
        ]);
    }
}

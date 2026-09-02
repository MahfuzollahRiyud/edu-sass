<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = Student::with(['studentSubjects.classSubject.subject', 'studentSubjects.classSubject.teachers.user', 'academicClass'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('student/subjects', [
            'student' => $student,
        ]);
    }
}

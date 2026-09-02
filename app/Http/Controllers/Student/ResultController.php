<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Student;
use App\Services\GradingService;
use Inertia\Inertia;
use Inertia\Response;

class ResultController extends Controller
{
    public function index(): Response
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        // Published exams for this student's class
        $exams = Exam::where('academic_class_id', $student->academic_class_id)
            ->where('is_published', true)
            ->with(['academicClass', 'examSchedules.classSubject.subject'])
            ->latest('start_date')
            ->get();

        $examSummaries = $exams->map(function ($exam) use ($student) {
            $tabulation = GradingService::calculateTabulation($exam);
            $myResult = collect($tabulation['students'])->firstWhere('student_id', $student->id);

            return [
                'exam_id' => $exam->id,
                'title' => $exam->title,
                'exam_type' => $exam->exam_type,
                'start_date' => $exam->start_date->format('M d, Y'),
                'class_name' => $exam->academicClass?->name,
                'result' => $myResult,
            ];
        });

        return Inertia::render('student/results', [
            'student' => $student->load('academicClass'),
            'examSummaries' => $examSummaries,
        ]);
    }

    public function show(Exam $exam): Response
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        if ($exam->academic_class_id !== $student->academic_class_id || ! $exam->is_published) {
            abort(404);
        }

        $tabulation = GradingService::calculateTabulation($exam);
        $studentResult = collect($tabulation['students'])->firstWhere('student_id', $student->id);

        return Inertia::render('admin/exams/report-card', [
            'exam' => $exam->load('academicClass'),
            'student' => $student->load(['user', 'academicClass']),
            'result' => $studentResult,
        ]);
    }
}

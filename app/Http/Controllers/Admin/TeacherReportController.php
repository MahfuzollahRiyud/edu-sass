<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherReportController extends Controller
{
    public function index(Request $request): Response
    {
        $teachers = Teacher::with([
            'user',
            'classSubjects.academicClass',
            'classSubjects.subject',
            'classSubjects.students.user',
        ])
        ->where('is_active', true)
        ->get()
        ->map(function ($teacher) {
            $allStudentIds = collect();
            $totalMonthlyFee = 0;

            $subjectBreakdowns = $teacher->classSubjects->map(function ($cs) use (&$allStudentIds, &$totalMonthlyFee) {
                $enrolledStudents = $cs->students;
                $studentCount = $enrolledStudents->count();
                $subjectFeeSum = (float) $cs->monthly_fee > 0
                    ? $studentCount * (float) $cs->monthly_fee
                    : (float) $enrolledStudents->sum('monthly_fee');

                foreach ($enrolledStudents as $student) {
                    $allStudentIds->push($student->id);
                }
                $totalMonthlyFee += $subjectFeeSum;

                return [
                    'id' => $cs->id,
                    'class_name' => $cs->academicClass?->name . ($cs->academicClass?->section ? ' (' . $cs->academicClass->section . ')' : ''),
                    'subject_name' => $cs->subject?->name,
                    'student_count' => $studentCount,
                    'estimated_revenue' => $subjectFeeSum,
                ];
            });

            return [
                'id' => $teacher->id,
                'name' => $teacher->user?->name,
                'email' => $teacher->user?->email,
                'phone' => $teacher->phone,
                'designation' => $teacher->designation ?: 'Instructor',
                'unique_students_count' => $allStudentIds->unique()->count(),
                'total_assigned_classes' => $teacher->classSubjects->count(),
                'total_estimated_revenue' => $totalMonthlyFee,
                'subjects' => $subjectBreakdowns,
            ];
        });

        $summary = [
            'total_teachers' => $teachers->count(),
            'total_students_enrolled' => $teachers->sum('unique_students_count'),
            'total_revenue_potential' => $teachers->sum('total_estimated_revenue'),
        ];

        return Inertia::render('admin/reports/teachers', [
            'teachers' => $teachers,
            'summary' => $summary,
        ]);
    }
}

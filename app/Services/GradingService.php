<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\ExamMark;
use App\Models\Student;

class GradingService
{
    /**
     * Calculate Grade & Grade Point from percentage.
     *
     * @return array{grade: string, grade_point: float, percentage: float}
     */
    public static function calculateGrade(float $marksObtained, float $totalMarks = 100.0, bool $isAbsent = false): array
    {
        if ($isAbsent || $totalMarks <= 0) {
            return ['grade' => 'F', 'grade_point' => 0.00, 'percentage' => 0.0];
        }

        $percentage = ($marksObtained / $totalMarks) * 100;

        if ($percentage >= 80) {
            return ['grade' => 'A+', 'grade_point' => 5.00, 'percentage' => round($percentage, 2)];
        } elseif ($percentage >= 70) {
            return ['grade' => 'A', 'grade_point' => 4.00, 'percentage' => round($percentage, 2)];
        } elseif ($percentage >= 60) {
            return ['grade' => 'A-', 'grade_point' => 3.50, 'percentage' => round($percentage, 2)];
        } elseif ($percentage >= 50) {
            return ['grade' => 'B', 'grade_point' => 3.00, 'percentage' => round($percentage, 2)];
        } elseif ($percentage >= 40) {
            return ['grade' => 'C', 'grade_point' => 2.00, 'percentage' => round($percentage, 2)];
        } elseif ($percentage >= 33) {
            return ['grade' => 'D', 'grade_point' => 1.00, 'percentage' => round($percentage, 2)];
        } else {
            return ['grade' => 'F', 'grade_point' => 0.00, 'percentage' => round($percentage, 2)];
        }
    }

    /**
     * Convert GPA (0.00 - 5.00) to letter Grade.
     */
    public static function gpaToGrade(float $gpa, bool $hasFailedSubject = false): string
    {
        if ($hasFailedSubject || $gpa < 1.0) {
            return 'F';
        }

        if ($gpa >= 5.0) {
            return 'A+';
        } elseif ($gpa >= 4.0) {
            return 'A';
        } elseif ($gpa >= 3.5) {
            return 'A-';
        } elseif ($gpa >= 3.0) {
            return 'B';
        } elseif ($gpa >= 2.0) {
            return 'C';
        } elseif ($gpa >= 1.0) {
            return 'D';
        }

        return 'F';
    }

    /**
     * Calculate tabulation sheet and rankings for an entire exam.
     */
    public static function calculateTabulation(Exam $exam): array
    {
        $exam->load([
            'academicClass',
            'examSchedules.classSubject.subject',
            'examMarks.student.user',
        ]);

        $schedules = $exam->examSchedules;
        $totalMaxMarks = $schedules->sum('total_marks');

        // Get all students enrolled in this class
        $students = Student::where('academic_class_id', $exam->academic_class_id)
            ->where('is_active', true)
            ->with(['user', 'academicClass'])
            ->get();

        $studentResults = [];

        foreach ($students as $student) {
            $studentMarks = $exam->examMarks->where('student_id', $student->id);

            $subjectMarksList = [];
            $totalMarksObtained = 0.0;
            $totalGradePoints = 0.0;
            $hasFailed = false;
            $gradedSubjectCount = 0;

            foreach ($schedules as $schedule) {
                $markRecord = $studentMarks->firstWhere('exam_schedule_id', $schedule->id);
                $obtained = $markRecord ? (float) $markRecord->marks_obtained : 0.0;
                $isAbsent = $markRecord ? (bool) $markRecord->is_absent : false;
                $gradeInfo = self::calculateGrade($obtained, (float) $schedule->total_marks, $isAbsent);

                if ($gradeInfo['grade'] === 'F') {
                    $hasFailed = true;
                }

                $subjectMarksList[] = [
                    'schedule_id' => $schedule->id,
                    'subject_name' => $schedule->classSubject?->subject?->name ?? 'Subject',
                    'total_marks' => (float) $schedule->total_marks,
                    'pass_marks' => (float) $schedule->pass_marks,
                    'marks_obtained' => $obtained,
                    'grade' => $gradeInfo['grade'],
                    'grade_point' => $gradeInfo['grade_point'],
                    'is_absent' => $isAbsent,
                ];

                $totalMarksObtained += $isAbsent ? 0 : $obtained;
                $totalGradePoints += $gradeInfo['grade_point'];
                $gradedSubjectCount++;
            }

            $gpa = $gradedSubjectCount > 0 ? round($totalGradePoints / $gradedSubjectCount, 2) : 0.00;
            if ($hasFailed) {
                $gpa = 0.00;
            }

            $overallGrade = self::gpaToGrade($gpa, $hasFailed);
            $percentage = $totalMaxMarks > 0 ? round(($totalMarksObtained / $totalMaxMarks) * 100, 2) : 0.0;

            $studentResults[] = [
                'student_id' => $student->id,
                'student_code' => $student->student_id,
                'student_name' => $student->user?->name ?? 'Unknown',
                'student_roll' => $student->roll_number ?? '—',
                'subject_marks' => $subjectMarksList,
                'total_marks_obtained' => $totalMarksObtained,
                'total_max_marks' => $totalMaxMarks,
                'percentage' => $percentage,
                'gpa' => $gpa,
                'grade' => $overallGrade,
                'has_failed' => $hasFailed,
                'rank' => null, // to be populated
            ];
        }

        // Sort by passed first, then total marks desc, then GPA desc
        usort($studentResults, function ($a, $b) {
            if ($a['has_failed'] !== $b['has_failed']) {
                return $a['has_failed'] ? 1 : -1;
            }
            if ($b['total_marks_obtained'] !== $a['total_marks_obtained']) {
                return $b['total_marks_obtained'] <=> $a['total_marks_obtained'];
            }
            return $b['gpa'] <=> $a['gpa'];
        });

        // Assign ranks (1st, 2nd, 3rd...)
        $rank = 1;
        foreach ($studentResults as &$res) {
            if (! $res['has_failed']) {
                $res['rank'] = $rank++;
            } else {
                $res['rank'] = 'Failed';
            }
        }

        return [
            'schedules' => $schedules->map(fn ($s) => [
                'id' => $s->id,
                'subject_name' => $s->classSubject?->subject?->name,
                'total_marks' => (float) $s->total_marks,
                'pass_marks' => (float) $s->pass_marks,
            ]),
            'students' => $studentResults,
            'total_students' => count($studentResults),
            'passed_students' => count(array_filter($studentResults, fn ($r) => ! $r['has_failed'])),
            'failed_students' => count(array_filter($studentResults, fn ($r) => $r['has_failed'])),
        ];
    }
}

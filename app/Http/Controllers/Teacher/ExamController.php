<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamMark;
use App\Models\ExamSchedule;
use App\Models\Student;
use App\Models\Teacher;
use App\Services\GradingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $teacher = Teacher::where('user_id', auth()->id())->firstOrFail();
        $classSubjectIds = $teacher->classSubjects()->pluck('class_subjects.id');

        // Exams that have schedules for this teacher's assigned subjects
        $exams = Exam::whereHas('examSchedules', function ($q) use ($classSubjectIds) {
            $q->whereIn('class_subject_id', $classSubjectIds);
        })
            ->with(['academicClass', 'examSchedules.classSubject.subject'])
            ->latest('start_date')
            ->paginate(10);

        return Inertia::render('teacher/exams/index', [
            'exams' => $exams,
        ]);
    }

    public function marks(Exam $exam, Request $request): Response
    {
        $teacher = Teacher::where('user_id', auth()->id())->firstOrFail();
        $myClassSubjectIds = $teacher->classSubjects()->pluck('class_subjects.id');

        $exam->load([
            'academicClass',
            'examSchedules' => fn ($q) => $q->whereIn('class_subject_id', $myClassSubjectIds)->with('classSubject.subject'),
        ]);

        $schedules = $exam->examSchedules;

        if ($schedules->isEmpty()) {
            abort(403, 'You do not have any assigned subjects for this exam.');
        }

        $selectedScheduleId = $request->input('schedule_id', $schedules->first()?->id);
        $currentSchedule = $schedules->firstWhere('id', (int) $selectedScheduleId) ?? $schedules->first();

        // Get students in this class
        $students = Student::where('academic_class_id', $exam->academic_class_id)
            ->where('is_active', true)
            ->with(['user'])
            ->orderBy('student_id')
            ->get();

        $existingMarks = $currentSchedule ? ExamMark::where('exam_schedule_id', $currentSchedule->id)
            ->get()
            ->keyBy('student_id') : collect();

        $studentMarks = $students->map(function ($stu) use ($existingMarks) {
            $rec = $existingMarks->get($stu->id);
            return [
                'student_id' => $stu->id,
                'student_code' => $stu->student_id,
                'student_name' => $stu->user?->name,
                'marks_obtained' => $rec ? (float) $rec->marks_obtained : 0.0,
                'is_absent' => $rec ? (bool) $rec->is_absent : false,
                'grade' => $rec?->grade ?? 'F',
                'grade_point' => $rec ? (float) $rec->grade_point : 0.0,
                'remarks' => $rec?->remarks ?? '',
            ];
        });

        return Inertia::render('teacher/exams/marks', [
            'exam' => $exam,
            'schedules' => $schedules->map(fn ($s) => [
                'id' => $s->id,
                'subject_name' => $s->classSubject?->subject?->name,
                'total_marks' => (float) $s->total_marks,
                'pass_marks' => (float) $s->pass_marks,
            ]),
            'currentSchedule' => $currentSchedule ? [
                'id' => $currentSchedule->id,
                'subject_name' => $currentSchedule->classSubject?->subject?->name,
                'total_marks' => (float) $currentSchedule->total_marks,
                'pass_marks' => (float) $currentSchedule->pass_marks,
            ] : null,
            'studentMarks' => $studentMarks,
        ]);
    }

    public function saveMarks(Request $request, Exam $exam): RedirectResponse
    {
        $teacher = Teacher::where('user_id', auth()->id())->firstOrFail();
        $myClassSubjectIds = $teacher->classSubjects()->pluck('class_subjects.id');
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'exam_schedule_id' => ['required', 'exists:exam_schedules,id'],
            'marks' => ['required', 'array'],
            'marks.*.student_id' => ['required', 'exists:students,id'],
            'marks.*.marks_obtained' => ['required', 'numeric', 'min:0'],
            'marks.*.is_absent' => ['required', 'boolean'],
            'marks.*.remarks' => ['nullable', 'string', 'max:255'],
        ]);

        $schedule = ExamSchedule::where('tenant_id', $tenantId)
            ->whereIn('class_subject_id', $myClassSubjectIds)
            ->findOrFail($validated['exam_schedule_id']);

        DB::transaction(function () use ($validated, $schedule, $exam, $tenantId) {
            foreach ($validated['marks'] as $row) {
                $obtained = (float) $row['marks_obtained'];
                $isAbsent = (bool) $row['is_absent'];
                $gradeData = GradingService::calculateGrade($obtained, (float) $schedule->total_marks, $isAbsent);

                ExamMark::updateOrCreate(
                    [
                        'exam_schedule_id' => $schedule->id,
                        'student_id' => $row['student_id'],
                    ],
                    [
                        'tenant_id' => $tenantId,
                        'exam_id' => $exam->id,
                        'marks_obtained' => $isAbsent ? 0 : $obtained,
                        'grade' => $gradeData['grade'],
                        'grade_point' => $gradeData['grade_point'],
                        'is_absent' => $isAbsent,
                        'remarks' => $row['remarks'] ?? null,
                    ]
                );
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject marks submitted successfully.']);

        return redirect()->back();
    }
}

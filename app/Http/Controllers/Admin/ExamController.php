<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Exam;
use App\Models\ExamMark;
use App\Models\ExamSchedule;
use App\Models\Student;
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
        $tenantId = app('current_tenant_id');

        $query = Exam::with(['academicClass', 'examSchedules.classSubject.subject'])
            ->withCount(['examSchedules', 'examMarks']);

        if ($request->filled('academic_class_id')) {
            $query->where('academic_class_id', $request->academic_class_id);
        }

        $exams = $query->latest('start_date')->paginate(12)->withQueryString();
        $classes = AcademicClass::orderBy('name')->get(['id', 'name', 'section']);

        return Inertia::render('admin/exams/index', [
            'exams' => $exams,
            'classes' => $classes,
            'filters' => $request->only(['academic_class_id']),
        ]);
    }

    public function create(): Response
    {
        $classes = AcademicClass::with(['classSubjects.subject'])
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/exams/create', [
            'classes' => $classes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'academic_class_id' => ['required', 'exists:academic_classes,id'],
            'title' => ['required', 'string', 'max:255'],
            'exam_type' => ['required', 'in:class_test,monthly_test,model_test,term_final'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'description' => ['nullable', 'string', 'max:1000'],
            'schedules' => ['required', 'array', 'min:1'],
            'schedules.*.class_subject_id' => ['required', 'exists:class_subjects,id'],
            'schedules.*.exam_date' => ['nullable', 'date'],
            'schedules.*.start_time' => ['nullable', 'date_format:H:i'],
            'schedules.*.end_time' => ['nullable', 'date_format:H:i'],
            'schedules.*.total_marks' => ['required', 'numeric', 'min:1'],
            'schedules.*.pass_marks' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $tenantId) {
            $exam = Exam::create([
                'tenant_id' => $tenantId,
                'academic_class_id' => $validated['academic_class_id'],
                'title' => $validated['title'],
                'exam_type' => $validated['exam_type'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? $validated['start_date'],
                'description' => $validated['description'] ?? null,
                'is_published' => false,
            ]);

            foreach ($validated['schedules'] as $sched) {
                ExamSchedule::create([
                    'tenant_id' => $tenantId,
                    'exam_id' => $exam->id,
                    'class_subject_id' => $sched['class_subject_id'],
                    'exam_date' => $sched['exam_date'] ?? $exam->start_date,
                    'start_time' => $sched['start_time'] ?? null,
                    'end_time' => $sched['end_time'] ?? null,
                    'total_marks' => $sched['total_marks'],
                    'pass_marks' => $sched['pass_marks'],
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Exam created with subject schedules successfully.']);

        return redirect()->route('admin.exams.index');
    }

    public function show(Exam $exam): Response
    {
        if ($exam->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $tabulation = GradingService::calculateTabulation($exam);

        return Inertia::render('admin/exams/show', [
            'exam' => $exam->load('academicClass'),
            'tabulation' => $tabulation,
        ]);
    }

    public function togglePublish(Exam $exam): RedirectResponse
    {
        if ($exam->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $exam->update(['is_published' => ! $exam->is_published]);

        $status = $exam->is_published ? 'published' : 'unpublished';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Exam results {$status} successfully."]);

        return redirect()->back();
    }

    public function marks(Exam $exam, Request $request): Response
    {
        if ($exam->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $exam->load([
            'academicClass',
            'examSchedules.classSubject.subject',
        ]);

        $schedules = $exam->examSchedules;
        $selectedScheduleId = $request->input('schedule_id', $schedules->first()?->id);
        $currentSchedule = $schedules->firstWhere('id', (int) $selectedScheduleId) ?? $schedules->first();

        // Get students in this class
        $students = Student::where('academic_class_id', $exam->academic_class_id)
            ->where('is_active', true)
            ->with(['user'])
            ->orderBy('student_id')
            ->get();

        // Existing marks for this schedule
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

        return Inertia::render('admin/exams/marks', [
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
        if ($exam->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'exam_schedule_id' => ['required', 'exists:exam_schedules,id'],
            'marks' => ['required', 'array'],
            'marks.*.student_id' => ['required', 'exists:students,id'],
            'marks.*.marks_obtained' => ['required', 'numeric', 'min:0'],
            'marks.*.is_absent' => ['required', 'boolean'],
            'marks.*.remarks' => ['nullable', 'string', 'max:255'],
        ]);

        $schedule = ExamSchedule::where('tenant_id', $tenantId)->findOrFail($validated['exam_schedule_id']);

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

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject marks saved successfully.']);

        return redirect()->back();
    }

    public function reportCard(Exam $exam, Student $student): Response
    {
        if ($exam->tenant_id !== app('current_tenant_id') || $student->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $student->load(['user', 'academicClass']);
        $tabulation = GradingService::calculateTabulation($exam);
        $studentResult = collect($tabulation['students'])->firstWhere('student_id', $student->id);

        return Inertia::render('admin/exams/report-card', [
            'exam' => $exam->load('academicClass'),
            'student' => $student,
            'result' => $studentResult,
        ]);
    }

    public function destroy(Exam $exam): RedirectResponse
    {
        if ($exam->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $exam->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Exam deleted successfully.']);

        return redirect()->route('admin.exams.index');
    }
}

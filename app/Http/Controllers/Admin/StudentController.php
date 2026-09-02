<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\FeeInvoice;
use App\Models\FeeType;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Student;
use App\Models\StudentSubject;
use App\Models\User;
use App\Services\ReceiptNumberGenerator;
use App\Services\StudentIdGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $classId = $request->input('class_id');

        $students = Student::with(['user', 'academicClass', 'studentSubjects.classSubject.subject'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('student_id', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%");
                        });
                });
            })
            ->when($classId, fn ($q) => $q->where('academic_class_id', $classId))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $classes = AcademicClass::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'classes' => $classes,
            'filters' => [
                'search' => $search,
                'class_id' => $classId,
            ],
        ]);
    }

    public function create(): Response
    {
        $classes = AcademicClass::with(['classSubjects.subject'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $feeTypes = FeeType::where('is_active', true)->get();

        return Inertia::render('admin/students/create', [
            'classes' => $classes,
            'feeTypes' => $feeTypes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'academic_class_id' => ['required', 'exists:academic_classes,id'],
            'phone' => ['nullable', 'string', 'max:20'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'admission_date' => ['required', 'date'],
            'monthly_fee' => ['required', 'numeric', 'min:0'],
            'class_subject_ids' => ['required', 'array', 'min:1'],
            'class_subject_ids.*' => ['exists:class_subjects,id'],
            // Optional admission fee payment
            'admission_fee' => ['nullable', 'numeric', 'min:0'],
            'admission_fee_paid' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['nullable', 'string', 'in:cash,bank,other'],
        ]);

        DB::transaction(function () use ($validated, $tenantId, $request) {
            $studentId = StudentIdGenerator::generate($tenantId);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'student',
                'tenant_id' => $tenantId,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $student = Student::create([
                'tenant_id' => $tenantId,
                'user_id' => $user->id,
                'student_id' => $studentId,
                'academic_class_id' => $validated['academic_class_id'],
                'phone' => $validated['phone'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_phone' => $validated['guardian_phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'admission_date' => $validated['admission_date'],
                'monthly_fee' => $validated['monthly_fee'],
                'is_active' => true,
            ]);

            // Assign subjects
            foreach ($validated['class_subject_ids'] as $csId) {
                StudentSubject::create([
                    'tenant_id' => $tenantId,
                    'student_id' => $student->id,
                    'class_subject_id' => $csId,
                ]);
            }

            // Create Admission Fee invoice if provided
            if (! empty($validated['admission_fee']) && $validated['admission_fee'] > 0) {
                $admissionFeeType = FeeType::firstOrCreate(
                    ['tenant_id' => $tenantId, 'name' => 'Admission Fee'],
                    ['is_recurring' => false, 'default_amount' => $validated['admission_fee'], 'is_active' => true]
                );

                $admissionFeeAmount = (float) $validated['admission_fee'];
                $paidAmount = min($admissionFeeAmount, (float) ($validated['admission_fee_paid'] ?? 0));
                $dueAmount = max(0, $admissionFeeAmount - $paidAmount);

                $status = 'unpaid';
                if ($dueAmount == 0) {
                    $status = 'paid';
                } elseif ($paidAmount > 0) {
                    $status = 'partial';
                }

                $invoice = FeeInvoice::create([
                    'tenant_id' => $tenantId,
                    'student_id' => $student->id,
                    'fee_type_id' => $admissionFeeType->id,
                    'title' => 'Admission Fee — ' . $student->name,
                    'amount' => $admissionFeeAmount,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'status' => $status,
                    'issue_date' => $validated['admission_date'],
                    'notes' => 'Generated at admission time',
                ]);

                if ($paidAmount > 0) {
                    $payment = Payment::create([
                        'tenant_id' => $tenantId,
                        'fee_invoice_id' => $invoice->id,
                        'student_id' => $student->id,
                        'amount' => $paidAmount,
                        'payment_method' => $validated['payment_method'] ?? 'cash',
                        'payment_date' => $validated['admission_date'],
                        'received_by' => $request->user()->id,
                        'notes' => 'Admission fee initial payment',
                    ]);

                    Receipt::create([
                        'tenant_id' => $tenantId,
                        'payment_id' => $payment->id,
                        'receipt_number' => ReceiptNumberGenerator::generate($tenantId),
                    ]);
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Student admitted successfully.']);

        return redirect()->route('admin.students.index');
    }

    public function show(Student $student): Response
    {
        if ($student->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $student->load([
            'user',
            'academicClass',
            'studentSubjects.classSubject.subject',
            'studentSubjects.classSubject.teachers.user',
            'feeInvoices.feeType',
            'feeInvoices.payments.receipt',
            'attendances.schedule.classSubject.subject',
        ]);

        $totalPaid = $student->feeInvoices->sum('paid_amount');
        $totalDue = $student->feeInvoices->sum('due_amount');
        $attendanceCount = $student->attendances->count();
        $presentCount = $student->attendances->where('status', 'present')->count();
        $attendancePercentage = $attendanceCount > 0 ? round(($presentCount / $attendanceCount) * 100, 1) : 100;

        return Inertia::render('admin/students/show', [
            'student' => $student,
            'stats' => [
                'total_paid' => $totalPaid,
                'total_due' => $totalDue,
                'attendance_percentage' => $attendancePercentage,
                'total_attendances' => $attendanceCount,
            ],
        ]);
    }

    public function edit(Student $student): Response
    {
        if ($student->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $student->load(['user', 'academicClass.classSubjects.subject', 'studentSubjects']);

        $classes = AcademicClass::with(['classSubjects.subject'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('admin/students/edit', [
            'student' => $student,
            'classes' => $classes,
            'assignedClassSubjectIds' => $student->studentSubjects->pluck('class_subject_id'),
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        if ($student->tenant_id !== app('current_tenant_id')) {
            abort(404);
        }

        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $student->user_id],
            'password' => ['nullable', 'string', 'min:8'],
            'academic_class_id' => ['required', 'exists:academic_classes,id'],
            'phone' => ['nullable', 'string', 'max:20'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'admission_date' => ['required', 'date'],
            'monthly_fee' => ['required', 'numeric', 'min:0'],
            'class_subject_ids' => ['required', 'array', 'min:1'],
            'class_subject_ids.*' => ['exists:class_subjects,id'],
        ]);

        DB::transaction(function () use ($validated, $student, $tenantId) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            if (! empty($validated['password'])) {
                $userData['password'] = $validated['password'];
            }
            $student->user->update($userData);

            $student->update([
                'academic_class_id' => $validated['academic_class_id'],
                'phone' => $validated['phone'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_phone' => $validated['guardian_phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'admission_date' => $validated['admission_date'],
                'monthly_fee' => $validated['monthly_fee'],
            ]);

            // Sync student subjects
            StudentSubject::where('student_id', $student->id)->delete();
            foreach ($validated['class_subject_ids'] as $csId) {
                StudentSubject::create([
                    'tenant_id' => $tenantId,
                    'student_id' => $student->id,
                    'class_subject_id' => $csId,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Student updated successfully.']);

        return redirect()->route('admin.students.index');
    }

    public function toggleStatus(Student $student): RedirectResponse
    {
        $student->update(['is_active' => ! $student->is_active]);
        $student->user->update(['is_active' => $student->is_active]);

        $status = $student->is_active ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Student {$status} successfully."]);

        return redirect()->route('admin.students.index');
    }
}

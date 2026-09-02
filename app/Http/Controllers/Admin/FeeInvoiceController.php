<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\FeeInvoice;
use App\Models\FeeType;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FeeInvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status');
        $month = $request->input('month');
        $studentId = $request->input('student_id');
        $classId = $request->input('class_id');

        $invoices = FeeInvoice::with(['student.user', 'student.academicClass', 'feeType'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($month, fn ($q) => $q->where('month', $month))
            ->when($studentId, fn ($q) => $q->where('student_id', $studentId))
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($sq) => $sq->where('academic_class_id', $classId)))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $classes = AcademicClass::where('is_active', true)->orderBy('sort_order')->get();
        $feeTypes = FeeType::where('is_active', true)->get();

        // Financial summary
        $totalAmount = FeeInvoice::sum('amount');
        $totalPaid = FeeInvoice::sum('paid_amount');
        $totalDue = FeeInvoice::sum('due_amount');

        return Inertia::render('admin/fees/index', [
            'invoices' => $invoices,
            'classes' => $classes,
            'feeTypes' => $feeTypes,
            'summary' => [
                'total_amount' => $totalAmount,
                'total_paid' => $totalPaid,
                'total_due' => $totalDue,
            ],
            'filters' => [
                'status' => $status,
                'month' => $month,
                'class_id' => $classId,
            ],
        ]);
    }

    public function create(): Response
    {
        $students = Student::with(['user', 'academicClass'])
            ->where('is_active', true)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => "{$s->name} ({$s->student_id}) — {$s->academicClass->full_name}",
            ]);

        $feeTypes = FeeType::where('is_active', true)->get();
        $classes = AcademicClass::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('admin/fees/create', [
            'students' => $students,
            'feeTypes' => $feeTypes,
            'classes' => $classes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'fee_type_id' => ['required', 'exists:fee_types,id'],
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'month' => ['nullable', 'string', 'max:7'],
            'due_date' => ['nullable', 'date'],
            'issue_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        FeeInvoice::create([
            'tenant_id' => $tenantId,
            'student_id' => $validated['student_id'],
            'fee_type_id' => $validated['fee_type_id'],
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'paid_amount' => 0,
            'due_amount' => $validated['amount'],
            'status' => 'unpaid',
            'month' => $validated['month'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'issue_date' => $validated['issue_date'],
            'notes' => $validated['notes'] ?? null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Fee invoice created successfully.']);

        return redirect()->route('admin.fees.index');
    }

    /**
     * Batch generate monthly fees for all active students in a class or all classes.
     */
    public function generateMonthlyFees(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'month' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'], // e.g. 2026-09
            'academic_class_id' => ['nullable', 'exists:academic_classes,id'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date'],
        ]);

        $monthlyFeeType = FeeType::firstOrCreate(
            ['tenant_id' => $tenantId, 'name' => 'Monthly Fee'],
            ['is_recurring' => true, 'default_amount' => 0, 'is_active' => true]
        );

        $students = Student::where('is_active', true)
            ->when($validated['academic_class_id'] ?? null, fn ($q, $cid) => $q->where('academic_class_id', $cid))
            ->get();

        $monthName = date('F Y', strtotime($validated['month'] . '-01'));
        $count = 0;

        DB::transaction(function () use ($students, $tenantId, $monthlyFeeType, $validated, $monthName, &$count) {
            foreach ($students as $student) {
                // Check if invoice already exists for this month & student
                $exists = FeeInvoice::where('student_id', $student->id)
                    ->where('fee_type_id', $monthlyFeeType->id)
                    ->where('month', $validated['month'])
                    ->exists();

                if (! $exists && (float) $student->monthly_fee > 0) {
                    FeeInvoice::create([
                        'tenant_id' => $tenantId,
                        'student_id' => $student->id,
                        'fee_type_id' => $monthlyFeeType->id,
                        'title' => "{$monthName} Monthly Fee",
                        'amount' => $student->monthly_fee,
                        'paid_amount' => 0,
                        'due_amount' => $student->monthly_fee,
                        'status' => 'unpaid',
                        'month' => $validated['month'],
                        'due_date' => $validated['due_date'] ?? null,
                        'issue_date' => $validated['issue_date'],
                    ]);
                    $count++;
                }
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Generated {$count} monthly fee invoices for {$monthName}.",
        ]);

        return redirect()->route('admin.fees.index');
    }
}

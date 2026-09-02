<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\FeeInvoice;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Student;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $invoices = FeeInvoice::with(['feeType', 'payments.receipt'])
            ->where('student_id', $student->id)
            ->latest('issue_date')
            ->get();

        $payments = Payment::with(['invoice.feeType', 'receipt'])
            ->where('student_id', $student->id)
            ->latest('payment_date')
            ->get();

        $totalAmount = $invoices->sum('amount');
        $totalPaid = $invoices->sum('paid_amount');
        $totalDue = $invoices->sum('due_amount');

        return Inertia::render('student/fees', [
            'invoices' => $invoices,
            'payments' => $payments,
            'student' => $student,
            'summary' => [
                'total_amount' => $totalAmount,
                'total_paid' => $totalPaid,
                'total_due' => $totalDue,
            ],
        ]);
    }

    public function showReceipt(Request $request, Receipt $receipt): Response
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Security check: ensure receipt belongs to this student
        if ($receipt->payment->student_id !== $student->id) {
            abort(403, 'Unauthorized.');
        }

        $receipt->load([
            'payment.student.user',
            'payment.student.academicClass',
            'payment.invoice.feeType',
            'payment.receiver',
        ]);

        $tenant = Tenant::find($receipt->tenant_id);

        return Inertia::render('admin/receipts/show', [
            'receipt' => $receipt,
            'tenant' => $tenant,
        ]);
    }
}

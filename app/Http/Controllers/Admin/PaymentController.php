<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeeInvoice;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Student;
use App\Services\ReceiptNumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $date = $request->input('date');
        $method = $request->input('method');

        $payments = Payment::with(['student.user', 'student.academicClass', 'invoice.feeType', 'receipt', 'receiver'])
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($sq) use ($search) {
                    $sq->where('student_id', 'LIKE', "%{$search}%")
                        ->orWhereHas('user', fn ($uq) => $uq->where('name', 'LIKE', "%{$search}%"));
                })->orWhereHas('receipt', fn ($rq) => $rq->where('receipt_number', 'LIKE', "%{$search}%"));
            })
            ->when($date, fn ($q) => $q->where('payment_date', $date))
            ->when($method, fn ($q) => $q->where('payment_method', $method))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $totalCollected = Payment::sum('amount');
        $todayCollected = Payment::where('payment_date', date('Y-m-d'))->sum('amount');

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'summary' => [
                'total_collected' => $totalCollected,
                'today_collected' => $todayCollected,
            ],
            'filters' => [
                'search' => $search,
                'date' => $date,
                'method' => $method,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $invoiceId = $request->input('invoice_id');
        $selectedInvoice = null;

        if ($invoiceId) {
            $selectedInvoice = FeeInvoice::with(['student.user', 'student.academicClass', 'feeType'])
                ->where('status', '!=', 'paid')
                ->find($invoiceId);
        }

        $dueInvoices = FeeInvoice::with(['student.user', 'student.academicClass', 'feeType'])
            ->where('status', '!=', 'paid')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/payments/create', [
            'selectedInvoice' => $selectedInvoice,
            'dueInvoices' => $dueInvoices,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');
        $user = $request->user();

        $validated = $request->validate([
            'fee_invoice_id' => ['required', 'exists:fee_invoices,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string', 'in:cash,bank,other'],
            'payment_date' => ['required', 'date'],
            'reference' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $invoice = FeeInvoice::findOrFail($validated['fee_invoice_id']);

        if ((float) $validated['amount'] > (float) $invoice->due_amount) {
            return back()->withErrors(['amount' => "Payment amount cannot exceed the remaining due amount of ৳{$invoice->due_amount}."]);
        }

        $receipt = null;

        DB::transaction(function () use ($validated, $invoice, $tenantId, $user, &$receipt) {
            $payment = Payment::create([
                'tenant_id' => $tenantId,
                'fee_invoice_id' => $invoice->id,
                'student_id' => $invoice->student_id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'payment_date' => $validated['payment_date'],
                'reference' => $validated['reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'received_by' => $user->id,
            ]);

            $receipt = Receipt::create([
                'tenant_id' => $tenantId,
                'payment_id' => $payment->id,
                'receipt_number' => ReceiptNumberGenerator::generate($tenantId),
            ]);

            // Recalculate invoice totals and status (paid, partial, unpaid)
            $invoice->recalculateAmounts();
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Payment of ৳{$validated['amount']} recorded successfully. Receipt #{$receipt->receipt_number} generated.",
        ]);

        return redirect()->route('admin.receipts.show', $receipt->id);
    }
}

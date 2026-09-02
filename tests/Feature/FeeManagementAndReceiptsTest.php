<?php

namespace Tests\Feature;

use App\Models\AcademicClass;
use App\Models\FeeInvoice;
use App\Models\FeeType;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeeManagementAndReceiptsTest extends TestCase
{
    use RefreshDatabase;

    public function test_batch_generate_monthly_fees_and_record_partial_payments()
    {
        $tenant = Tenant::create(['name' => 'Demo Center', 'slug' => 'demo-center']);
        $admin = User::factory()->create(['role' => 'admin', 'tenant_id' => $tenant->id]);

        $class = AcademicClass::create(['tenant_id' => $tenant->id, 'name' => 'Class 10']);
        $studentUser = User::factory()->create(['role' => 'student', 'tenant_id' => $tenant->id]);

        $student = Student::create([
            'tenant_id' => $tenant->id,
            'user_id' => $studentUser->id,
            'student_id' => 'STU-2026-00001',
            'academic_class_id' => $class->id,
            'admission_date' => '2026-09-01',
            'monthly_fee' => 1500,
        ]);

        // Batch generate monthly fees
        $response = $this->actingAs($admin)->post(route('admin.fees.generate-monthly'), [
            'month' => '2026-09',
            'issue_date' => '2026-09-01',
        ]);

        $response->assertRedirect(route('admin.fees.index'));

        $invoice = FeeInvoice::where('student_id', $student->id)->where('month', '2026-09')->first();
        $this->assertNotNull($invoice);
        $this->assertEquals(1500, $invoice->amount);
        $this->assertEquals(1500, $invoice->due_amount);
        $this->assertEquals('unpaid', $invoice->status);

        // Record partial payment of 1000
        $payResponse = $this->actingAs($admin)->post(route('admin.payments.store'), [
            'fee_invoice_id' => $invoice->id,
            'amount' => 1000,
            'payment_method' => 'cash',
            'payment_date' => '2026-09-05',
        ]);

        $invoice->refresh();
        $this->assertEquals(1000, $invoice->paid_amount);
        $this->assertEquals(500, $invoice->due_amount);
        $this->assertEquals('partial', $invoice->status);

        $payment = Payment::where('fee_invoice_id', $invoice->id)->first();
        $this->assertNotNull($payment);

        $receipt = Receipt::where('payment_id', $payment->id)->first();
        $this->assertNotNull($receipt);
        $this->assertStringStartsWith('REC-' . date('Y') . '-', $receipt->receipt_number);

        // Verify redirect to view receipt
        $payResponse->assertRedirect(route('admin.receipts.show', $receipt->id));
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Admission Fee, Monthly Fee, Exam Fee, Registration Fee, Fine, Other Fee
            $table->boolean('is_recurring')->default(false); // monthly = true
            $table->decimal('default_amount', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['tenant_id', 'name']);
            $table->index(['tenant_id', 'is_active']);
        });

        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('fee_type_id')->constrained('fee_types')->cascadeOnDelete();
            $table->string('title'); // e.g. September 2026 Monthly Fee, Admission Fee 2026
            $table->decimal('amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('due_amount', 10, 2);
            $table->string('status', 20)->default('unpaid'); // unpaid, partial, paid
            $table->string('month', 7)->nullable(); // e.g., 2026-09 for recurring monthly fees
            $table->date('due_date')->nullable();
            $table->date('issue_date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'student_id']);
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'month']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fee_invoice_id')->constrained('fee_invoices')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method', 30)->default('cash'); // cash, bank, other
            $table->date('payment_date');
            $table->string('reference')->nullable(); // TxID, bank ref
            $table->text('notes')->nullable();
            $table->foreignId('received_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['tenant_id', 'fee_invoice_id']);
            $table->index(['tenant_id', 'student_id']);
            $table->index(['tenant_id', 'payment_date']);
        });

        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->string('receipt_number'); // e.g. REC-2026-00001
            $table->timestamps();

            $table->unique(['tenant_id', 'receipt_number']);
            $table->unique(['tenant_id', 'payment_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('fee_invoices');
        Schema::dropIfExists('fee_types');
    }
};

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use App\Models\Tenant;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
    public function show(Receipt $receipt): Response
    {
        if ($receipt->tenant_id !== app('current_tenant_id')) {
            abort(404);
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

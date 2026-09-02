<?php

namespace App\Services;

use App\Models\Receipt;

class ReceiptNumberGenerator
{
    /**
     * Generate a unique receipt number for a tenant.
     * Format: REC-{YEAR}-{5-DIGIT-SEQUENCE}
     * Example: REC-2026-00001
     */
    public static function generate(int $tenantId): string
    {
        $year = date('Y');
        $prefix = "REC-{$year}-";

        $latest = Receipt::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('receipt_number', 'LIKE', "{$prefix}%")
            ->orderBy('receipt_number', 'desc')
            ->value('receipt_number');

        if ($latest) {
            $lastNumber = (int) substr($latest, strlen($prefix));
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad((string) $nextNumber, 5, '0', STR_PAD_LEFT);
    }
}

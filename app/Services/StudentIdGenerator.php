<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Facades\DB;

class StudentIdGenerator
{
    /**
     * Generate a unique student ID for a tenant.
     * Format: STU-{YEAR}-{5-DIGIT-SEQUENCE}
     * Example: STU-2026-00001
     */
    public static function generate(int $tenantId): string
    {
        $year = date('Y');
        $prefix = "STU-{$year}-";

        // Query the max student_id for this tenant with matching prefix
        $latest = Student::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('student_id', 'LIKE', "{$prefix}%")
            ->orderBy('student_id', 'desc')
            ->value('student_id');

        if ($latest) {
            $lastNumber = (int) substr($latest, strlen($prefix));
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad((string) $nextNumber, 5, '0', STR_PAD_LEFT);
    }
}

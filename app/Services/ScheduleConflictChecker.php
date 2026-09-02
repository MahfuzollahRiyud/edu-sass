<?php

namespace App\Services;

use App\Models\Schedule;

class ScheduleConflictChecker
{
    /**
     * Check if a teacher or class has a scheduling conflict.
     */
    public static function hasConflict(
        int $tenantId,
        int $dayOfWeek,
        int $timeSlotId,
        int $teacherId,
        int $classSubjectId,
        ?int $ignoreScheduleId = null
    ): ?string {
        // Check teacher conflict
        $teacherConflict = Schedule::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('day_of_week', $dayOfWeek)
            ->where('time_slot_id', $timeSlotId)
            ->where('teacher_id', $teacherId)
            ->where('is_active', true)
            ->when($ignoreScheduleId, fn ($q) => $q->where('id', '!=', $ignoreScheduleId))
            ->exists();

        if ($teacherConflict) {
            return 'The selected teacher already has a class scheduled during this time slot on this day.';
        }

        // Check class-subject conflict
        $classConflict = Schedule::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('day_of_week', $dayOfWeek)
            ->where('time_slot_id', $timeSlotId)
            ->where('class_subject_id', $classSubjectId)
            ->where('is_active', true)
            ->when($ignoreScheduleId, fn ($q) => $q->where('id', '!=', $ignoreScheduleId))
            ->exists();

        if ($classConflict) {
            return 'This class already has a subject scheduled during this time slot on this day.';
        }

        return null;
    }
}

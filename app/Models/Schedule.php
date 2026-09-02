<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'class_subject_id',
        'teacher_id',
        'time_slot_id',
        'day_of_week',
        'room',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public static array $days = [
        0 => 'Sunday',
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
    ];

    public function classSubject(): BelongsTo
    {
        return $this->belongsTo(ClassSubject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function getDayNameAttribute(): string
    {
        return self::$days[$this->day_of_week] ?? 'Unknown';
    }
}

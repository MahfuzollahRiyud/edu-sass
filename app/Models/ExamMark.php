<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamMark extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'exam_id',
        'exam_schedule_id',
        'student_id',
        'marks_obtained',
        'grade',
        'grade_point',
        'is_absent',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'marks_obtained' => 'decimal:2',
            'grade_point' => 'decimal:2',
            'is_absent' => 'boolean',
        ];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function examSchedule(): BelongsTo
    {
        return $this->belongsTo(ExamSchedule::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}

<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamSchedule extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'exam_id',
        'class_subject_id',
        'exam_date',
        'start_time',
        'end_time',
        'total_marks',
        'pass_marks',
    ];

    protected function casts(): array
    {
        return [
            'exam_date' => 'date',
            'total_marks' => 'decimal:2',
            'pass_marks' => 'decimal:2',
        ];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function classSubject(): BelongsTo
    {
        return $this->belongsTo(ClassSubject::class);
    }

    public function examMarks(): HasMany
    {
        return $this->hasMany(ExamMark::class);
    }
}

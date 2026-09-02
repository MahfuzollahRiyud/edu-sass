<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassSubject extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'academic_class_id',
        'subject_id',
    ];

    public function academicClass(): BelongsTo
    {
        return $this->belongsTo(AcademicClass::class, 'academic_class_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function teacherAssignments(): HasMany
    {
        return $this->hasMany(TeacherAssignment::class);
    }

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(Teacher::class, 'teacher_assignments', 'class_subject_id', 'teacher_id')
            ->withTimestamps();
    }

    public function studentSubjects(): HasMany
    {
        return $this->hasMany(StudentSubject::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_subjects', 'class_subject_id', 'student_id')
            ->withTimestamps();
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function getDisplayNameAttribute(): string
    {
        $className = $this->academicClass ? $this->academicClass->full_name : 'Class';
        $subjectName = $this->subject ? $this->subject->name : 'Subject';
        return "{$className} — {$subjectName}";
    }
}

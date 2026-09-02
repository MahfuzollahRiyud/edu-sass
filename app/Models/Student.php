<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'student_id',
        'academic_class_id',
        'phone',
        'guardian_name',
        'guardian_phone',
        'address',
        'date_of_birth',
        'gender',
        'admission_date',
        'monthly_fee',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'admission_date' => 'date',
            'monthly_fee' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function academicClass(): BelongsTo
    {
        return $this->belongsTo(AcademicClass::class);
    }

    public function studentSubjects(): HasMany
    {
        return $this->hasMany(StudentSubject::class);
    }

    public function classSubjects(): BelongsToMany
    {
        return $this->belongsToMany(ClassSubject::class, 'student_subjects', 'student_id', 'class_subject_id')
            ->withTimestamps();
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function feeInvoices(): HasMany
    {
        return $this->hasMany(FeeInvoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getNameAttribute(): string
    {
        return $this->user ? $this->user->name : '';
    }

    public function getEmailAttribute(): string
    {
        return $this->user ? $this->user->email : '';
    }
}

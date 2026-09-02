<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'phone',
        'designation',
        'address',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TeacherAssignment::class);
    }

    public function classSubjects(): BelongsToMany
    {
        return $this->belongsToMany(ClassSubject::class, 'teacher_assignments', 'teacher_id', 'class_subject_id')
            ->withTimestamps();
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
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

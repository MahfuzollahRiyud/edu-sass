<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'name',
        'code',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function classSubjects(): HasMany
    {
        return $this->hasMany(ClassSubject::class);
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(AcademicClass::class, 'class_subjects', 'subject_id', 'academic_class_id')
            ->withTimestamps()
            ->withPivot('id');
    }
}

<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimeSlot extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'label',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function getFormattedTimeAttribute(): string
    {
        $start = date('h:i A', strtotime($this->start_time));
        $end = date('h:i A', strtotime($this->end_time));
        return $this->label ? "{$this->label} ({$start} - {$end})" : "{$start} - {$end}";
    }
}

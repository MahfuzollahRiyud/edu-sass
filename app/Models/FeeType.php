<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeType extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'is_recurring',
        'default_amount',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_recurring' => 'boolean',
            'default_amount' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(FeeInvoice::class);
    }
}

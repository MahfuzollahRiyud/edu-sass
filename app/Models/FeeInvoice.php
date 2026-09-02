<?php

namespace App\Models;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeInvoice extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'student_id',
        'fee_type_id',
        'title',
        'amount',
        'paid_amount',
        'due_amount',
        'status',
        'month',
        'due_date',
        'issue_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'due_amount' => 'decimal:2',
            'due_date' => 'date',
            'issue_date' => 'date',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Recalculate paid and due amounts based on actual payments.
     */
    public function recalculateAmounts(): void
    {
        $totalPaid = $this->payments()->sum('amount');
        $this->paid_amount = $totalPaid;
        $this->due_amount = max(0, (float)$this->amount - (float)$totalPaid);

        if ($this->due_amount <= 0) {
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partial';
        } else {
            $this->status = 'unpaid';
        }

        $this->save();
    }
}

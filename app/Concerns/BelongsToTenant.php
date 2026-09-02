<?php

namespace App\Concerns;

use App\Models\Tenant;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Apply this trait to any model that belongs to a tenant.
 *
 * It automatically:
 * 1. Adds a global scope to filter queries by the current tenant
 * 2. Sets tenant_id on new records from the current tenant context
 * 3. Provides a `tenant()` relationship
 */
trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function (Model $model) {
            if (! $model->tenant_id && app()->bound('current_tenant_id')) {
                $model->tenant_id = app('current_tenant_id');
            }
        });
    }

    /**
     * Get the tenant that owns this record.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Get the qualified tenant column name for query building.
     */
    public function qualifiedTenantColumn(): string
    {
        return $this->getTable().'.tenant_id';
    }
}

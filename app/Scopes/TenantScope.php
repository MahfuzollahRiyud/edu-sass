<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    /**
     * Apply the tenant scope to a given Eloquent query builder.
     *
     * This automatically adds `WHERE tenant_id = ?` to all queries
     * on models that use the BelongsToTenant trait.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = app()->bound('current_tenant_id')
            ? app('current_tenant_id')
            : null;

        if ($tenantId) {
            $builder->where($model->getTable().'.tenant_id', $tenantId);
        }
    }
}

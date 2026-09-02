<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeeType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeTypeController extends Controller
{
    public function index(): Response
    {
        $feeTypes = FeeType::withCount('invoices')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('admin/fees/types/index', [
            'feeTypes' => $feeTypes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/fees/types/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $tenantId = app('current_tenant_id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_recurring' => ['required', 'boolean'],
            'default_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $exists = FeeType::where('name', $validated['name'])->exists();
        if ($exists) {
            return back()->withErrors(['name' => 'A fee type with this name already exists.']);
        }

        FeeType::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'is_recurring' => $validated['is_recurring'],
            'default_amount' => $validated['default_amount'],
            'is_active' => true,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Fee type created successfully.']);

        return redirect()->route('admin.fee-types.index');
    }

    public function edit(FeeType $feeType): Response
    {
        return Inertia::render('admin/fees/types/edit', [
            'feeType' => $feeType,
        ]);
    }

    public function update(Request $request, FeeType $feeType): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_recurring' => ['required', 'boolean'],
            'default_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $exists = FeeType::where('name', $validated['name'])
            ->where('id', '!=', $feeType->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'A fee type with this name already exists.']);
        }

        $feeType->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Fee type updated successfully.']);

        return redirect()->route('admin.fee-types.index');
    }

    public function toggleStatus(FeeType $feeType): RedirectResponse
    {
        $feeType->update(['is_active' => ! $feeType->is_active]);

        $status = $feeType->is_active ? 'activated' : 'deactivated';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Fee type {$status} successfully."]);

        return redirect()->route('admin.fee-types.index');
    }
}

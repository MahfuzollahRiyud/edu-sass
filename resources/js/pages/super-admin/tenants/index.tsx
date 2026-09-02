import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Check,
    Clock,
    Globe,
    LogIn,
    Plus,
    Power,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PaginatedData, Tenant } from '@/types';

type Props = {
    tenants: PaginatedData<Tenant>;
    currentFilter: string;
    counts: {
        all: number;
        pending: number;
        approved: number;
        rejected: number;
    };
};

export default function TenantsIndex({ tenants, currentFilter, counts }: Props) {
    const [rejectingTenant, setRejectingTenant] = useState<Tenant | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    const handleApprove = (tenant: Tenant) => {
        if (confirm(`Are you sure you want to approve and activate "${tenant.name}"?`)) {
            router.post(`/super-admin/tenants/${tenant.id}/approve`);
        }
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingTenant) return;

        setIsSubmittingReject(true);
        router.post(
            `/super-admin/tenants/${rejectingTenant.id}/reject`,
            { rejection_reason: rejectionReason },
            {
                onFinish: () => {
                    setIsSubmittingReject(false);
                    setRejectingTenant(null);
                    setRejectionReason('');
                },
            },
        );
    };

    return (
        <>
            <Head title="Coaching Centers" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Coaching Centers
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage all coaching institutes, approve new applications, and control access.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/super-admin/tenants/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Center Manually
                        </Link>
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
                    <FilterButton
                        label="All Centers"
                        active={currentFilter === 'all' || !currentFilter}
                        count={counts.all}
                        href="/super-admin/tenants?status=all"
                    />
                    <FilterButton
                        label="Pending Approval"
                        active={currentFilter === 'pending'}
                        count={counts.pending}
                        badgeVariant={counts.pending > 0 ? 'warning' : 'default'}
                        href="/super-admin/tenants?status=pending"
                    />
                    <FilterButton
                        label="Approved / Active"
                        active={currentFilter === 'approved' || currentFilter === 'active'}
                        count={counts.approved}
                        href="/super-admin/tenants?status=approved"
                    />
                    <FilterButton
                        label="Rejected"
                        active={currentFilter === 'rejected'}
                        count={counts.rejected}
                        href="/super-admin/tenants?status=rejected"
                    />
                </div>

                {/* Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="px-4 py-3 text-left font-medium">
                                        Institution
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Subdomain / Slug
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Contact
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Users
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-muted-foreground px-4 py-12 text-center"
                                        >
                                            <Building2 className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p className="font-medium text-foreground">
                                                No coaching centers found in this filter.
                                            </p>
                                            <p className="text-xs mt-1">
                                                {currentFilter === 'pending'
                                                    ? 'No pending registration applications.'
                                                    : 'Create a new coaching center to get started.'}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                                {tenants.data.map((tenant) => (
                                    <tr
                                        key={tenant.id}
                                        className="hover:bg-muted/40 border-b last:border-b-0 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-foreground">
                                                {tenant.name}
                                            </div>
                                            {tenant.address && (
                                                <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                                                    {tenant.address}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                                                <Globe className="h-3 w-3" />
                                                {tenant.slug}
                                            </span>
                                        </td>
                                        <td className="text-xs text-muted-foreground px-4 py-3 space-y-0.5">
                                            <div>{tenant.phone || '—'}</div>
                                            <div className="text-[11px] text-muted-foreground/80">{tenant.email || ''}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center font-medium text-xs">
                                            {tenant.users_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {tenant.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                                    Pending Review
                                                </span>
                                            )}
                                            {tenant.status === 'rejected' && (
                                                <span
                                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    title={tenant.rejection_reason || 'Rejected'}
                                                >
                                                    <XCircle className="h-3 w-3" />
                                                    Rejected
                                                </span>
                                            )}
                                            {(!tenant.status || tenant.status === 'approved') && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        tenant.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {tenant.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Pending Actions */}
                                                {tenant.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                                            onClick={() => handleApprove(tenant)}
                                                            title="Approve and activate"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                            <span>Approve</span>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                                            onClick={() => {
                                                                setRejectingTenant(tenant);
                                                                setRejectionReason('');
                                                            }}
                                                            title="Reject application"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            <span>Reject</span>
                                                        </Button>
                                                    </>
                                                )}

                                                {/* Approved / Active Actions */}
                                                {tenant.status !== 'pending' && (
                                                    <>
                                                        {tenant.is_active && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10 font-medium"
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/super-admin/tenants/${tenant.id}/enter`,
                                                                    )
                                                                }
                                                                title="Enter Coaching Center"
                                                            >
                                                                <LogIn className="h-3.5 w-3.5" />
                                                                <span>Enter</span>
                                                            </Button>
                                                        )}
                                                        {tenant.status === 'rejected' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 gap-1 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-50"
                                                                onClick={() => handleApprove(tenant)}
                                                                title="Re-approve"
                                                            >
                                                                <Check className="h-3.5 w-3.5" />
                                                                <span>Approve</span>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-xs"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/super-admin/tenants/${tenant.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                router.patch(
                                                                    `/super-admin/tenants/${tenant.id}/toggle-status`,
                                                                )
                                                            }
                                                            title={
                                                                tenant.is_active
                                                                    ? 'Deactivate'
                                                                    : 'Activate'
                                                            }
                                                        >
                                                            <Power
                                                                className={`h-4 w-4 ${
                                                                    tenant.is_active
                                                                        ? 'text-emerald-500'
                                                                        : 'text-muted-foreground'
                                                                }`}
                                                            />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reject Modal Dialog */}
                {rejectingTenant && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-destructive" />
                                    Reject Application
                                </h3>
                                <button
                                    onClick={() => setRejectingTenant(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to reject the registration request for{' '}
                                <strong className="text-foreground">{rejectingTenant.name}</strong>?
                            </p>

                            <form onSubmit={handleRejectSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground">
                                        Reason for rejection (Optional note)
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="e.g. Incomplete information, invalid phone number, etc."
                                        rows={3}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setRejectingTenant(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={isSubmittingReject}
                                    >
                                        Confirm Rejection
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

TenantsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/super-admin/dashboard' },
        { title: 'Coaching Centers', href: '/super-admin/tenants' },
    ],
};

function FilterButton({
    label,
    active,
    count,
    href,
    badgeVariant = 'default',
}: {
    label: string;
    active: boolean;
    count?: number;
    href: string;
    badgeVariant?: 'default' | 'warning';
}) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
            <span>{label}</span>
            {typeof count === 'number' && (
                <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        active
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : badgeVariant === 'warning' && count > 0
                            ? 'bg-amber-500 text-white'
                            : 'bg-background text-muted-foreground border'
                    }`}
                >
                    {count}
                </span>
            )}
        </Link>
    );
}

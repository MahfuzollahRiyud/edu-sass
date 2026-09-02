import { Head, Link, router } from '@inertiajs/react';
import { CreditCard, Plus, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FeeType, PaginatedData } from '@/types';

type Props = {
    feeTypes: PaginatedData<FeeType>;
};

export default function FeeTypesIndex({ feeTypes }: Props) {
    return (
        <>
            <Head title="Fee Types Configuration" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Fee Types & Heads</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Configure fee structures (e.g. Admission Fee, Monthly Tuition, Exam Fee).
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/fees">Back to Invoices</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/fee-types/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Fee Type
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Fee Type Name</th>
                                    <th className="px-4 py-3 text-center font-medium">Type</th>
                                    <th className="px-4 py-3 text-right font-medium">Default Amount</th>
                                    <th className="px-4 py-3 text-center font-medium">Total Invoices</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeTypes.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No fee types created yet.</p>
                                        </td>
                                    </tr>
                                )}
                                {feeTypes.data.map((ft) => (
                                    <tr key={ft.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">{ft.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                                                    ft.is_recurring
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}
                                            >
                                                {ft.is_recurring ? 'Monthly Recurring' : 'One-time'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">
                                            ৳{Number(ft.default_amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                                            {ft.invoices_count ?? 0} invoices
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    ft.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {ft.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/fee-types/${ft.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(`/admin/fee-types/${ft.id}/toggle-status`)}
                                                    title={ft.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

FeeTypesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Fees', href: '/admin/fees' },
        { title: 'Fee Types', href: '/admin/fee-types' },
    ],
};

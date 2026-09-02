import { Head, Link, router, useForm } from '@inertiajs/react';
import { CreditCard, Download, FileText, Plus, Receipt, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AcademicClass, FeeInvoice, FeeType, PaginatedData } from '@/types';
import { useState, type FormEvent } from 'react';

type Props = {
    invoices: PaginatedData<FeeInvoice>;
    classes: AcademicClass[];
    feeTypes: FeeType[];
    summary: {
        total_amount: number;
        total_paid: number;
        total_due: number;
    };
    filters: {
        status?: string;
        month?: string;
        class_id?: string;
    };
};

export default function FeesIndex({ invoices, classes, feeTypes, summary, filters }: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [month, setMonth] = useState(filters.month || '');
    const [classId, setClassId] = useState(filters.class_id || '');
    const [showBatchModal, setShowBatchModal] = useState(false);

    function applyFilter(newStatus = status, newMonth = month, newClassId = classId) {
        router.get('/admin/fees', { status: newStatus, month: newMonth, class_id: newClassId }, { preserveState: true });
    }

    // Monthly Fee batch generator form
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const today = new Date().toISOString().split('T')[0];
    const { data: batchData, setData: setBatchData, post: postBatch, processing: batchProcessing } = useForm({
        month: currentMonthStr,
        academic_class_id: '',
        issue_date: today,
        due_date: '',
    });

    function handleBatchSubmit(e: FormEvent) {
        e.preventDefault();
        postBatch('/admin/fees/generate-monthly', {
            onSuccess: () => setShowBatchModal(false),
        });
    }

    return (
        <>
            <Head title="Fee Management & Invoices" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Student Fees & Invoices</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage billing invoices, track dues, record payments, and issue receipts.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/fee-types">
                                Fee Types
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => setShowBatchModal(true)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate Monthly Fees
                        </Button>
                        <Button asChild>
                            <Link href="/admin/fees/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Invoice
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Invoiced</p>
                        <p className="mt-1 text-2xl font-bold">৳{Number(summary.total_amount).toLocaleString()}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Collected</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">৳{Number(summary.total_paid).toLocaleString()}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Outstanding Due</p>
                        <p className="mt-1 text-2xl font-bold text-red-600 font-mono">৳{Number(summary.total_due).toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm sm:w-44"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            applyFilter(e.target.value, month, classId);
                        }}
                    >
                        <option value="">All Payment Statuses</option>
                        <option value="unpaid">Unpaid Only</option>
                        <option value="partial">Partial Paid</option>
                        <option value="paid">Fully Paid</option>
                    </select>

                    <Input
                        type="month"
                        className="sm:w-44"
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            applyFilter(status, e.target.value, classId);
                        }}
                    />

                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm sm:w-56"
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value);
                            applyFilter(status, month, e.target.value);
                        }}
                    >
                        <option value="">All Academic Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `(${cls.section})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Invoices Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Student</th>
                                    <th className="px-4 py-3 text-left font-medium">Invoice Title</th>
                                    <th className="px-4 py-3 text-right font-medium">Total Amount</th>
                                    <th className="px-4 py-3 text-right font-medium">Paid</th>
                                    <th className="px-4 py-3 text-right font-medium">Remaining Due</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-4 py-12 text-center">
                                            <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No invoices found matching your filters.</p>
                                        </td>
                                    </tr>
                                )}
                                {invoices.data.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{inv.student?.user?.name}</div>
                                            <div className="text-muted-foreground text-xs font-mono">
                                                {inv.student?.student_id} • {inv.student?.academic_class?.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {inv.title}
                                            {inv.month && <span className="block text-xs text-muted-foreground">{inv.month}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-medium">
                                            ৳{Number(inv.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-green-600">
                                            ৳{Number(inv.paid_amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-bold text-red-600">
                                            ৳{Number(inv.due_amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    inv.status === 'paid'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : inv.status === 'partial'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {inv.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {Number(inv.due_amount) > 0 ? (
                                                <Button size="sm" asChild>
                                                    <Link href={`/admin/payments/create?invoice_id=${inv.id}`}>
                                                        Pay Now
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-green-600 font-medium">Paid in full</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Batch Monthly Fee Generator Modal */}
                {showBatchModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-card w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold">Generate Monthly Invoices</h2>
                                <p className="text-muted-foreground text-xs mt-1">
                                    This will create monthly fee invoices for all active students based on their individual set monthly fee.
                                </p>
                            </div>

                            <form onSubmit={handleBatchSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="batch_month">Month *</Label>
                                    <Input
                                        id="batch_month"
                                        type="month"
                                        value={batchData.month}
                                        onChange={(e) => setBatchData('month', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="batch_class">Academic Class (Optional)</Label>
                                    <select
                                        id="batch_class"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                        value={batchData.academic_class_id}
                                        onChange={(e) => setBatchData('academic_class_id', e.target.value)}
                                    >
                                        <option value="">All Classes</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name} {cls.section ? `(${cls.section})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="batch_issue_date">Issue Date *</Label>
                                    <Input
                                        id="batch_issue_date"
                                        type="date"
                                        value={batchData.issue_date}
                                        onChange={(e) => setBatchData('issue_date', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowBatchModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={batchProcessing}>
                                        {batchProcessing ? 'Generating...' : 'Generate Invoices'}
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

FeesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Fees', href: '/admin/fees' },
    ],
};

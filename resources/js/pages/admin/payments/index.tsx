import { Head, Link, router } from '@inertiajs/react';
import { Download, Plus, Receipt, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PaginatedData, Payment } from '@/types';
import { useState } from 'react';

type Props = {
    payments: PaginatedData<Payment>;
    summary: {
        total_collected: number;
        today_collected: number;
    };
    filters: {
        search?: string;
        date?: string;
        method?: string;
    };
};

export default function PaymentsIndex({ payments, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [method, setMethod] = useState(filters.method || '');

    function handleFilter(e?: React.FormEvent) {
        if (e) e.preventDefault();
        router.get('/admin/payments', { search, date, method }, { preserveState: true });
    }

    return (
        <>
            <Head title="Payment Collections & Receipts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Payment Collections & Receipts</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            View recorded payments, transaction receipts, and collection reports.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/payments/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Record Payment
                        </Link>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total All-Time Collection</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">৳{Number(summary.total_collected).toLocaleString()}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Today's Collection</p>
                        <p className="mt-1 text-2xl font-bold text-primary">৳{Number(summary.today_collected).toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by student name, ID, or receipt #..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Input
                        type="date"
                        className="sm:w-44"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            router.get('/admin/payments', { search, date: e.target.value, method }, { preserveState: true });
                        }}
                    />

                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm sm:w-44"
                        value={method}
                        onChange={(e) => {
                            setMethod(e.target.value);
                            router.get('/admin/payments', { search, date, method: e.target.value }, { preserveState: true });
                        }}
                    >
                        <option value="">All Methods</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="other">Other</option>
                    </select>

                    <Button type="submit" variant="secondary">
                        Filter
                    </Button>
                </form>

                {/* Payments Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Receipt #</th>
                                    <th className="px-4 py-3 text-left font-medium">Student</th>
                                    <th className="px-4 py-3 text-left font-medium">Fee Title</th>
                                    <th className="px-4 py-3 text-right font-medium">Amount Paid</th>
                                    <th className="px-4 py-3 text-center font-medium">Payment Method</th>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-right font-medium">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-4 py-12 text-center">
                                            <Receipt className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No payment records found.</p>
                                        </td>
                                    </tr>
                                )}
                                {payments.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-mono font-bold text-xs text-primary">
                                            {p.receipt?.receipt_number || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{p.student?.user?.name}</div>
                                            <div className="text-muted-foreground text-xs font-mono">{p.student?.student_id}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-xs">{p.invoice?.title}</div>
                                            <div className="text-muted-foreground text-xs">{p.invoice?.fee_type?.name}</div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-bold text-green-600">
                                            ৳{Number(p.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-medium uppercase">
                                                {p.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {p.payment_date}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {p.receipt && (
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/admin/receipts/${p.receipt.id}`}>
                                                        View Receipt
                                                    </Link>
                                                </Button>
                                            )}
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

PaymentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
    ],
};

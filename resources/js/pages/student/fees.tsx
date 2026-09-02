import { Head, Link } from '@inertiajs/react';
import { CreditCard, Download, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FeeInvoice, Payment, Student } from '@/types';

type Props = {
    invoices: FeeInvoice[];
    payments: Payment[];
    student: Student;
    summary: {
        total_amount: number;
        total_paid: number;
        total_due: number;
    };
};

export default function StudentFees({ invoices, payments, student, summary }: Props) {
    return (
        <>
            <Head title="My Fees & Payments" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Fee Invoices & Receipts</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        View all billing statements, dues, payment logs, and printable money receipts.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Invoiced</p>
                        <p className="mt-1 text-2xl font-bold">৳{Number(summary.total_amount).toLocaleString()}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Paid</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">৳{Number(summary.total_paid).toLocaleString()}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Remaining Outstanding Due</p>
                        <p className="mt-1 text-2xl font-bold text-red-600 font-mono">৳{Number(summary.total_due).toLocaleString()}</p>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-sm">Billing Invoices</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Invoice Title</th>
                                    <th className="px-4 py-3 text-left font-medium">Fee Head</th>
                                    <th className="px-4 py-3 text-right font-medium">Total Amount</th>
                                    <th className="px-4 py-3 text-right font-medium">Paid</th>
                                    <th className="px-4 py-3 text-right font-medium">Due</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center text-xs">
                                            No fee invoices issued yet.
                                        </td>
                                    </tr>
                                )}
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">
                                            {inv.title}
                                            <div className="text-xs text-muted-foreground">Issued: {inv.issue_date}</div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {inv.fee_type?.name}
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
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payments & Receipts History */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-sm">Payment Receipts History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Receipt #</th>
                                    <th className="px-4 py-3 text-left font-medium">Paid Towards</th>
                                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                                    <th className="px-4 py-3 text-center font-medium">Method</th>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center text-xs">
                                            No payment records found.
                                        </td>
                                    </tr>
                                )}
                                {payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-mono font-bold text-xs text-primary">
                                            {p.receipt?.receipt_number || '—'}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-xs">
                                            {p.invoice?.title}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-bold text-green-600">
                                            ৳{Number(p.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center uppercase text-xs">
                                            {p.payment_method}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {p.payment_date}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {p.receipt && (
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/student/receipts/${p.receipt.id}`}>
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

StudentFees.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Fees & Payments', href: '/student/fees' },
    ],
};

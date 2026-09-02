import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Receipt, Tenant } from '@/types';

type Props = {
    receipt: Receipt;
    tenant: Tenant | null;
};

export default function ReceiptShow({ receipt, tenant }: Props) {
    const payment = receipt.payment;
    const student = payment?.student;
    const invoice = payment?.invoice;

    function handlePrint() {
        window.print();
    }

    return (
        <>
            <Head title={`Receipt #${receipt.receipt_number}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                {/* Action Bar (hidden during printing) */}
                <div className="print:hidden flex items-center justify-between">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/payments">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Link>
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Money Receipt
                    </Button>
                </div>

                {/* Printable Receipt Card */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-8 shadow-sm print:border-none print:shadow-none print:p-0">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-primary tracking-tight">
                                {tenant?.name || 'Coaching Center'}
                            </h1>
                            {tenant?.address && <p className="text-muted-foreground text-xs mt-1">{tenant.address}</p>}
                            {tenant?.phone && <p className="text-muted-foreground text-xs">Phone: {tenant.phone}</p>}
                            {tenant?.email && <p className="text-muted-foreground text-xs">Email: {tenant.email}</p>}
                        </div>
                        <div className="text-right">
                            <div className="inline-block bg-primary/10 text-primary font-bold text-xs uppercase px-3 py-1 rounded">
                                Money Receipt
                            </div>
                            <p className="font-mono text-xs font-bold mt-2">
                                Receipt #{receipt.receipt_number}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Date: {payment?.payment_date}
                            </p>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="grid grid-cols-2 gap-4 py-6 border-b text-sm">
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-xs uppercase font-medium">Student Information</span>
                            <div className="font-bold text-base">{student?.user?.name}</div>
                            <div className="text-muted-foreground text-xs font-mono">Student ID: {student?.student_id}</div>
                            <div className="text-muted-foreground text-xs">
                                Class: {student?.academic_class?.name} {student?.academic_class?.section ? `(${student.academic_class.section})` : ''}
                            </div>
                            {student?.phone && <div className="text-muted-foreground text-xs">Contact: {student.phone}</div>}
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-muted-foreground text-xs uppercase font-medium">Payment Information</span>
                            <div className="text-xs">
                                <span className="text-muted-foreground">Payment Method: </span>
                                <span className="font-semibold uppercase">{payment?.payment_method}</span>
                            </div>
                            {payment?.reference && (
                                <div className="text-xs">
                                    <span className="text-muted-foreground">Reference: </span>
                                    <span className="font-mono">{payment.reference}</span>
                                </div>
                            )}
                            <div className="text-xs">
                                <span className="text-muted-foreground">Received By: </span>
                                <span>{payment?.receiver?.name || 'Authorized Staff'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="py-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/20">
                                    <th className="px-4 py-2 text-left font-medium">Description / Particulars</th>
                                    <th className="px-4 py-2 text-right font-medium">Invoice Total</th>
                                    <th className="px-4 py-2 text-right font-medium">Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-3">
                                        <div className="font-semibold">{invoice?.title}</div>
                                        <div className="text-xs text-muted-foreground">Fee Head: {invoice?.fee_type?.name}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                                        ৳{Number(invoice?.amount ?? 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-primary text-base">
                                        ৳{Number(payment?.amount ?? 0).toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Balance Summary */}
                        <div className="flex justify-end mt-4">
                            <div className="w-64 space-y-1.5 text-xs bg-muted/20 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Invoiced:</span>
                                    <span className="font-mono">৳{Number(invoice?.amount ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Paid to Date:</span>
                                    <span className="font-mono text-green-600 font-semibold">
                                        ৳{Number(invoice?.paid_amount ?? 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-1 font-bold text-sm">
                                    <span>Remaining Balance:</span>
                                    <span className="font-mono text-red-600">
                                        ৳{Number(invoice?.due_amount ?? 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Signature */}
                    <div className="pt-12 mt-6 border-t flex justify-between items-end text-xs text-muted-foreground">
                        <div>
                            <p className="flex items-center gap-1 text-green-600 font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Payment Verified
                            </p>
                            <p className="mt-1">This is a computer-generated money receipt.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-40 border-b border-foreground/30 mb-1"></div>
                            <span>Authorized Signature</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ReceiptShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
        { title: 'Receipt', href: '#' },
    ],
};

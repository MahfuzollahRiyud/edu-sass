import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FeeInvoice } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    selectedInvoice: FeeInvoice | null;
    dueInvoices: FeeInvoice[];
};

export default function PaymentCreate({ selectedInvoice, dueInvoices }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const initialInvoiceId = selectedInvoice?.id ? String(selectedInvoice.id) : dueInvoices[0]?.id ? String(dueInvoices[0].id) : '';
    const initialDueAmount = selectedInvoice ? String(selectedInvoice.due_amount) : dueInvoices[0] ? String(dueInvoices[0].due_amount) : '0';

    const { data, setData, post, processing, errors } = useForm({
        fee_invoice_id: initialInvoiceId,
        amount: initialDueAmount,
        payment_method: 'cash',
        payment_date: today,
        reference: '',
        notes: '',
    });

    const activeInvoice = dueInvoices.find((inv) => String(inv.id) === data.fee_invoice_id) || selectedInvoice;

    function handleInvoiceChange(invoiceId: string) {
        setData('fee_invoice_id', invoiceId);
        const inv = dueInvoices.find((i) => String(i.id) === invoiceId);
        if (inv) {
            setData((prev) => ({
                ...prev,
                fee_invoice_id: invoiceId,
                amount: String(inv.due_amount),
            }));
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/payments');
    }

    return (
        <>
            <Head title="Record Payment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Record Fee Payment</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Accept student fees, record full or partial payments, and generate printable receipts.
                    </p>
                </div>

                {dueInvoices.length === 0 && !selectedInvoice ? (
                    <div className="bg-card border rounded-xl p-8 text-center max-w-xl">
                        <p className="text-muted-foreground">There are no outstanding invoices with pending dues.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/admin/fees">Go to Invoices</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fee_invoice_id">Select Unpaid / Partial Invoice *</Label>
                            <select
                                id="fee_invoice_id"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={data.fee_invoice_id}
                                onChange={(e) => handleInvoiceChange(e.target.value)}
                                required
                            >
                                {dueInvoices.map((inv) => (
                                    <option key={inv.id} value={inv.id}>
                                        {inv.student?.user?.name} ({inv.student?.student_id}) — {inv.title} (Due: ৳{Number(inv.due_amount).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.fee_invoice_id} />
                        </div>

                        {activeInvoice && (
                            <div className="bg-muted/40 p-4 rounded-lg border space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Invoice Amount:</span>
                                    <span className="font-mono font-medium">৳{Number(activeInvoice.amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Already Paid:</span>
                                    <span className="font-mono text-green-600">৳{Number(activeInvoice.paid_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-1">
                                    <span>Remaining Due to Pay:</span>
                                    <span className="font-mono text-red-600 text-sm">৳{Number(activeInvoice.due_amount).toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Payment Amount (৳) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="1"
                                    max={activeInvoice ? Number(activeInvoice.due_amount) : undefined}
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={errors.amount} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_method">Payment Method *</Label>
                                <select
                                    id="payment_method"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value as 'cash' | 'bank' | 'other')}
                                    required
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="other">Other (bKash/Nagad Ref)</option>
                                </select>
                                <InputError message={errors.payment_method} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="payment_date">Payment Date *</Label>
                                <Input
                                    id="payment_date"
                                    type="date"
                                    value={data.payment_date}
                                    onChange={(e) => setData('payment_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.payment_date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference">Transaction Reference / Note</Label>
                                <Input
                                    id="reference"
                                    value={data.reference}
                                    onChange={(e) => setData('reference', e.target.value)}
                                    placeholder="Optional check / TxID"
                                />
                                <InputError message={errors.reference} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing || !data.amount || Number(data.amount) <= 0}>
                                {processing ? 'Recording...' : 'Record Payment & Print Receipt'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/payments">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

PaymentCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
        { title: 'Record Payment', href: '/admin/payments/create' },
    ],
};

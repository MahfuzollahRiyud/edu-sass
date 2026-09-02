import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AcademicClass, FeeType } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    students: { id: number; name: string }[];
    feeTypes: FeeType[];
    classes: AcademicClass[];
};

export default function FeeCreate({ students, feeTypes }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        student_id: students[0]?.id ? String(students[0].id) : '',
        fee_type_id: feeTypes[0]?.id ? String(feeTypes[0].id) : '',
        title: '',
        amount: feeTypes[0]?.default_amount ? String(feeTypes[0].default_amount) : '1000',
        month: '',
        due_date: '',
        issue_date: today,
        notes: '',
    });

    function handleFeeTypeChange(typeId: string) {
        setData('fee_type_id', typeId);
        const selected = feeTypes.find((ft) => String(ft.id) === typeId);
        if (selected) {
            setData((prev) => ({
                ...prev,
                fee_type_id: typeId,
                title: selected.name,
                amount: String(selected.default_amount || '1000'),
            }));
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/fees');
    }

    return (
        <>
            <Head title="Create Fee Invoice" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Fee Invoice</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Issue a customized invoice or bill for a student.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="student_id">Select Student *</Label>
                        <select
                            id="student_id"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={data.student_id}
                            onChange={(e) => setData('student_id', e.target.value)}
                            required
                        >
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.student_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fee_type_id">Fee Head / Type *</Label>
                        <select
                            id="fee_type_id"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={data.fee_type_id}
                            onChange={(e) => handleFeeTypeChange(e.target.value)}
                            required
                        >
                            {feeTypes.map((ft) => (
                                <option key={ft.id} value={ft.id}>
                                    {ft.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.fee_type_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Invoice Title *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. September 2026 Monthly Tuition, Model Test Fee"
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Bill Amount (৳) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="1"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="month">Month (Optional)</Label>
                            <Input
                                id="month"
                                type="month"
                                value={data.month}
                                onChange={(e) => setData('month', e.target.value)}
                            />
                            <InputError message={errors.month} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="issue_date">Issue Date *</Label>
                            <Input
                                id="issue_date"
                                type="date"
                                value={data.issue_date}
                                onChange={(e) => setData('issue_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.issue_date} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                            />
                            <InputError message={errors.due_date} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Additional details..."
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Invoice'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/fees">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

FeeCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Fees', href: '/admin/fees' },
        { title: 'Create Invoice', href: '/admin/fees/create' },
    ],
};

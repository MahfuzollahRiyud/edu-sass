import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FeeType } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    feeType: FeeType;
};

export default function FeeTypeEdit({ feeType }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: feeType.name,
        is_recurring: feeType.is_recurring,
        default_amount: String(feeType.default_amount),
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/fee-types/${feeType.id}`);
    }

    return (
        <>
            <Head title={`Edit Fee Type — ${feeType.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Fee Type</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update configuration for {feeType.name}.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Fee Type Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="default_amount">Default Amount (৳) *</Label>
                        <Input
                            id="default_amount"
                            type="number"
                            min="0"
                            value={data.default_amount}
                            onChange={(e) => setData('default_amount', e.target.value)}
                            required
                        />
                        <InputError message={errors.default_amount} />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_recurring"
                            checked={data.is_recurring}
                            onChange={(e) => setData('is_recurring', e.target.checked)}
                            className="rounded border-input text-primary h-4 w-4"
                        />
                        <Label htmlFor="is_recurring" className="font-normal cursor-pointer">
                            Is this a monthly recurring fee?
                        </Label>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/fee-types">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

FeeTypeEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Fee Types', href: '/admin/fee-types' },
        { title: 'Edit', href: '#' },
    ],
};

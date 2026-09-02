import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

export default function ClassCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        section: '',
        sort_order: 0,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/classes');
    }

    return (
        <>
            <Head title="Create Class" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Academic Class</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Create a new class or batch for your coaching center.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., Class 10, HSC Batch 2026"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="section">Section / Group / Batch (Optional)</Label>
                        <Input
                            id="section"
                            value={data.section}
                            onChange={(e) => setData('section', e.target.value)}
                            placeholder="e.g., Science, Batch A, Morning"
                        />
                        <InputError message={errors.section} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sort_order">Display Order (Optional)</Label>
                        <Input
                            id="sort_order"
                            type="number"
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                        />
                        <InputError message={errors.sort_order} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Create Class'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/classes">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ClassCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
        { title: 'Add Class', href: '/admin/classes/create' },
    ],
};

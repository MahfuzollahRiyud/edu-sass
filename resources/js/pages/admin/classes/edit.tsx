import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AcademicClass } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    academicClass: AcademicClass;
};

export default function ClassEdit({ academicClass }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: academicClass.name,
        section: academicClass.section ?? '',
        sort_order: academicClass.sort_order ?? 0,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/classes/${academicClass.id}`);
    }

    return (
        <>
            <Head title={`Edit Class — ${academicClass.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Academic Class</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update details for {academicClass.name}.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="section">Section / Group / Batch</Label>
                        <Input
                            id="section"
                            value={data.section}
                            onChange={(e) => setData('section', e.target.value)}
                        />
                        <InputError message={errors.section} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sort_order">Display Order</Label>
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
                            {processing ? 'Saving...' : 'Save Changes'}
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

ClassEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
        { title: 'Edit', href: '#' },
    ],
};

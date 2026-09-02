import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Subject } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    subject: Subject;
};

export default function SubjectEdit({ subject }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: subject.name,
        code: subject.code ?? '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/subjects/${subject.id}`);
    }

    return (
        <>
            <Head title={`Edit Subject — ${subject.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Subject</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update details for {subject.name}.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Subject Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Subject Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        <InputError message={errors.code} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/subjects">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SubjectEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Subjects', href: '/admin/subjects' },
        { title: 'Edit', href: '#' },
    ],
};

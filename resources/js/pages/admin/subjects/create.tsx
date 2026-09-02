import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

export default function SubjectCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/subjects');
    }

    return (
        <>
            <Head title="Create Subject" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Subject</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Create a new subject for curriculum assignment.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Subject Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Physics, General Math, English Literature"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Subject Code (Optional)</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="e.g. PHY-101, MATH-201"
                        />
                        <InputError message={errors.code} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Create Subject'}
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

SubjectCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Subjects', href: '/admin/subjects' },
        { title: 'Add Subject', href: '/admin/subjects/create' },
    ],
};

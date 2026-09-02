import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

type Props = {
    classSubjects: { id: number; name: string }[];
};

export default function TeacherCreate({ classSubjects }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        address: '',
        class_subject_ids: [] as number[],
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/teachers');
    }

    function toggleClassSubject(id: number) {
        const current = [...data.class_subject_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('class_subject_ids', current);
    }

    return (
        <>
            <Head title="Create Teacher" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Teacher</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Create a login account for a teacher and assign teaching subjects.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold">Teacher Account & Profile</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Md. Hasan Ali"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Login Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="teacher@example.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Login Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation / Title (Optional)</Label>
                            <Input
                                id="designation"
                                value={data.designation}
                                onChange={(e) => setData('designation', e.target.value)}
                                placeholder="e.g. Senior Lecturer in Physics, Math Instructor"
                            />
                            <InputError message={errors.designation} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Contact address"
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    {/* Class & Subject Assignments */}
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold">Assign Classes & Subjects</h2>
                        <p className="text-muted-foreground text-xs">
                            Select the class-subject combinations this teacher is authorized to teach.
                        </p>

                        {classSubjects.length === 0 ? (
                            <p className="text-muted-foreground text-xs italic bg-muted/40 p-3 rounded-md">
                                No class-subject pairs available. First assign subjects to classes under Academic Classes.
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto border p-3 rounded-lg bg-card">
                                {classSubjects.map((cs) => {
                                    const isChecked = data.class_subject_ids.includes(cs.id);
                                    return (
                                        <label
                                            key={cs.id}
                                            className={`flex items-center gap-2.5 p-2 rounded-md border text-sm cursor-pointer transition-colors ${
                                                isChecked
                                                    ? 'bg-primary/10 border-primary text-primary font-medium'
                                                    : 'hover:bg-muted/50 border-input'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleClassSubject(cs.id)}
                                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                            />
                                            <span>{cs.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Teacher Account'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/teachers">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TeacherCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Teachers', href: '/admin/teachers' },
        { title: 'Add Teacher', href: '/admin/teachers/create' },
    ],
};

import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Teacher } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    teacher: Teacher;
    assignedClassSubjectIds: number[];
    classSubjects: { id: number; name: string }[];
};

export default function TeacherEdit({ teacher, assignedClassSubjectIds, classSubjects }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: teacher.user?.name ?? '',
        email: teacher.user?.email ?? '',
        password: '',
        phone: teacher.phone ?? '',
        designation: teacher.designation ?? '',
        address: teacher.address ?? '',
        class_subject_ids: assignedClassSubjectIds,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/teachers/${teacher.id}`);
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
            <Head title={`Edit Teacher — ${teacher.user?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Teacher</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update profile and teaching assignments for {teacher.user?.name}.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold">Teacher Account</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
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
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Reset Password (leave empty to keep current)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Optional"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                value={data.designation}
                                onChange={(e) => setData('designation', e.target.value)}
                            />
                            <InputError message={errors.designation} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    {/* Class & Subject Assignments */}
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold">Assign Classes & Subjects</h2>
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
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
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

TeacherEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Teachers', href: '/admin/teachers' },
        { title: 'Edit Teacher', href: '#' },
    ],
};

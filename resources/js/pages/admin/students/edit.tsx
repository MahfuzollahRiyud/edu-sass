import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AcademicClass, Student } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    student: Student;
    classes: AcademicClass[];
    assignedClassSubjectIds: number[];
};

export default function StudentEdit({ student, classes, assignedClassSubjectIds }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.user?.name ?? '',
        email: student.user?.email ?? '',
        password: '',
        academic_class_id: String(student.academic_class_id),
        phone: student.phone ?? '',
        guardian_name: student.guardian_name ?? '',
        guardian_phone: student.guardian_phone ?? '',
        address: student.address ?? '',
        date_of_birth: student.date_of_birth ? String(student.date_of_birth).split('T')[0] : '',
        gender: student.gender ?? 'male',
        admission_date: student.admission_date ? String(student.admission_date).split('T')[0] : '',
        monthly_fee: String(student.monthly_fee),
        class_subject_ids: assignedClassSubjectIds,
    });

    const selectedClass = classes.find((c) => String(c.id) === String(data.academic_class_id));

    function handleClassChange(classId: string) {
        setData('academic_class_id', classId);
        const cls = classes.find((c) => String(c.id) === classId);
        if (cls && cls.class_subjects) {
            setData('class_subject_ids', cls.class_subjects.map((cs) => cs.id));
        } else {
            setData('class_subject_ids', []);
        }
    }

    function toggleSubject(id: number) {
        const current = [...data.class_subject_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('class_subject_ids', current);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/students/${student.id}`);
    }

    return (
        <>
            <Head title={`Edit Student — ${student.user?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Student</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update information for {student.user?.name} ({student.student_id}).
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold border-b pb-2">Student Account & Profile</h2>
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

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="password">Reset Password (optional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Leave blank to keep current"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="guardian_name">Guardian Name</Label>
                                <Input
                                    id="guardian_name"
                                    value={data.guardian_name}
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                />
                                <InputError message={errors.guardian_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guardian_phone">Guardian Phone</Label>
                                <Input
                                    id="guardian_phone"
                                    value={data.guardian_phone}
                                    onChange={(e) => setData('guardian_phone', e.target.value)}
                                />
                                <InputError message={errors.guardian_phone} />
                            </div>
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

                    <div className="space-y-4">
                        <h2 className="text-base font-semibold border-b pb-2">Academic Information</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="academic_class_id">Class *</Label>
                                <select
                                    id="academic_class_id"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    value={data.academic_class_id}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    required
                                >
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} {c.section ? `(${c.section})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.academic_class_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admission_date">Admission Date *</Label>
                                <Input
                                    id="admission_date"
                                    type="date"
                                    value={data.admission_date}
                                    onChange={(e) => setData('admission_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.admission_date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monthly_fee">Monthly Tuition Fee (৳) *</Label>
                                <Input
                                    id="monthly_fee"
                                    type="number"
                                    min="0"
                                    value={data.monthly_fee}
                                    onChange={(e) => setData('monthly_fee', e.target.value)}
                                    required
                                />
                                <InputError message={errors.monthly_fee} />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label>Enrolled Subjects *</Label>
                            {selectedClass?.class_subjects && selectedClass.class_subjects.length > 0 ? (
                                <div className="grid gap-2 sm:grid-cols-3 border p-3 rounded-lg bg-card">
                                    {selectedClass.class_subjects.map((cs) => {
                                        const isChecked = data.class_subject_ids.includes(cs.id);
                                        return (
                                            <label
                                                key={cs.id}
                                                className={`flex items-center gap-2 p-2 rounded border text-sm cursor-pointer ${
                                                    isChecked
                                                        ? 'bg-primary/10 border-primary text-primary font-medium'
                                                        : 'hover:bg-muted/50 border-input'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleSubject(cs.id)}
                                                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                                />
                                                <span>{cs.subject?.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-xs italic">No subjects in selected class.</p>
                            )}
                            <InputError message={errors.class_subject_ids} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing || data.class_subject_ids.length === 0}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/students">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StudentEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Students', href: '/admin/students' },
        { title: 'Edit Student', href: '#' },
    ],
};

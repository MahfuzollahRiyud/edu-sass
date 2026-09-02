import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AcademicClass, Subject } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    academicClass: AcademicClass;
    availableSubjects: Subject[];
};

export default function ClassSubjectsManager({ academicClass, availableSubjects }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        subject_id: availableSubjects[0]?.id ? String(availableSubjects[0].id) : '',
        monthly_fee: '',
    });

    function handleAddSubject(e: FormEvent) {
        e.preventDefault();
        post(`/admin/classes/${academicClass.id}/subjects`, {
            onSuccess: () => reset(),
        });
    }

    function handleUpdateFee(classSubjectId: number, currentFee: number) {
        const newFee = prompt('Enter new Monthly Fee for this subject (৳):', String(currentFee || '0'));
        if (newFee !== null && !isNaN(Number(newFee)) && Number(newFee) >= 0) {
            router.post(`/admin/classes/${academicClass.id}/subjects/${classSubjectId}`, {
                _method: 'PATCH',
                monthly_fee: Number(newFee),
            }, { preserveScroll: true });
        }
    }

    function handleRemoveSubject(classSubjectId: number) {
        if (confirm('Are you sure you want to remove this subject from the class?')) {
            router.delete(`/admin/classes/${academicClass.id}/subjects/${classSubjectId}`);
        }
    }

    return (
        <>
            <Head title={`Subjects — ${academicClass.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Subjects for {academicClass.name} {academicClass.section && `(${academicClass.section})`}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Assign subjects and set individual subject monthly fees (e.g. ৳1,200/month).
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/classes">Back to Classes</Link>
                    </Button>
                </div>

                {/* Add Subject Form */}
                {availableSubjects.length > 0 && (
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                        <h2 className="text-sm font-medium mb-3">Assign New Subject & Set Monthly Fee</h2>
                        <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-2xl items-end">
                            <div className="sm:col-span-6 space-y-1">
                                <Label htmlFor="subject_id">Select Subject *</Label>
                                <select
                                    id="subject_id"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.subject_id}
                                    onChange={(e) => setData('subject_id', e.target.value)}
                                    required
                                >
                                    {availableSubjects.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} {s.code ? `(${s.code})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.subject_id} />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                                <Label htmlFor="monthly_fee">Monthly Fee (৳)</Label>
                                <input
                                    id="monthly_fee"
                                    type="number"
                                    min="0"
                                    step="50"
                                    placeholder="e.g. 1200"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.monthly_fee}
                                    onChange={(e) => setData('monthly_fee', e.target.value)}
                                />
                                <InputError message={errors.monthly_fee} />
                            </div>

                            <div className="sm:col-span-3">
                                <Button type="submit" className="w-full" disabled={processing || !data.subject_id}>
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    Assign
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Assigned Subjects Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="p-4 border-b">
                        <h2 className="font-medium text-sm">
                            Currently Assigned Subjects ({academicClass.class_subjects?.length ?? 0})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Subject</th>
                                    <th className="px-4 py-3 text-left font-medium">Code</th>
                                    <th className="px-4 py-3 text-right font-medium">Monthly Fee</th>
                                    <th className="px-4 py-3 text-left font-medium">Assigned Teachers</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!academicClass.class_subjects || academicClass.class_subjects.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center">
                                            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No subjects assigned to this class yet.</p>
                                        </td>
                                    </tr>
                                )}
                                {academicClass.class_subjects?.map((cs) => (
                                    <tr key={cs.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">
                                            {cs.subject?.name}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {cs.subject?.code || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateFee(cs.id, cs.monthly_fee ?? 0)}
                                                className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                                                title="Click to change fee"
                                            >
                                                ৳{Number(cs.monthly_fee ?? 0).toLocaleString()}
                                                <span className="text-[10px] text-muted-foreground font-normal">(edit)</span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            {cs.teachers && cs.teachers.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {cs.teachers.map((t) => (
                                                        <span key={t.id} className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs">
                                                            {t.user?.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">No teacher assigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveSubject(cs.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

ClassSubjectsManager.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
        { title: 'Manage Subjects', href: '#' },
    ],
};

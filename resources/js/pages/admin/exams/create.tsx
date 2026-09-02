import { Head, Link, useForm } from '@inertiajs/react';
import { Award, Calendar, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AcademicClass, ClassSubject } from '@/types';

type Props = {
    classes: (AcademicClass & {
        class_subjects?: (ClassSubject & { subject?: { name: string; code: string } })[];
    })[];
};

type ScheduleInput = {
    class_subject_id: number;
    subject_name: string;
    exam_date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    pass_marks: number;
};

export default function ExamsCreate({ classes }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        academic_class_id: string;
        title: string;
        exam_type: string;
        start_date: string;
        end_date: string;
        description: string;
        schedules: ScheduleInput[];
    }>({
        academic_class_id: classes[0]?.id?.toString() ?? '',
        title: '',
        exam_type: 'monthly_test',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        description: '',
        schedules: [],
    });

    // Auto-populate schedules when class changes
    useEffect(() => {
        const selectedClass = classes.find(
            (c) => c.id.toString() === data.academic_class_id,
        );
        if (selectedClass && selectedClass.class_subjects) {
            const initialSchedules: ScheduleInput[] = selectedClass.class_subjects.map(
                (cs) => ({
                    class_subject_id: cs.id,
                    subject_name: cs.subject?.name ?? `Subject #${cs.id}`,
                    exam_date: data.start_date,
                    start_time: '10:00',
                    end_time: '12:00',
                    total_marks: 100,
                    pass_marks: 33,
                }),
            );
            setData('schedules', initialSchedules);
        }
    }, [data.academic_class_id]);

    function updateSchedule(index: number, field: keyof ScheduleInput, value: any) {
        const updated = [...data.schedules];
        updated[index] = { ...updated[index], [field]: value };
        setData('schedules', updated);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/exams');
    }

    return (
        <>
            <Head title="Create Exam" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Examination</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Schedule an examination and configure subjects, full marks, and passing criteria.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Exam Info */}
                    <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
                        <h2 className="text-base font-semibold">General Information</h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Exam Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. 1st Monthly Model Test 2026"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="academic_class_id">Target Class *</Label>
                                <select
                                    id="academic_class_id"
                                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.academic_class_id}
                                    onChange={(e) => setData('academic_class_id', e.target.value)}
                                    required
                                >
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} {cls.section ? `(${cls.section})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.academic_class_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="exam_type">Exam Type *</Label>
                                <select
                                    id="exam_type"
                                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.exam_type}
                                    onChange={(e) => setData('exam_type', e.target.value)}
                                    required
                                >
                                    <option value="class_test">Class Test (Daily/Weekly)</option>
                                    <option value="monthly_test">Monthly Assessment</option>
                                    <option value="model_test">Model Test</option>
                                    <option value="term_final">Term Final Exam</option>
                                </select>
                                <InputError message={errors.exam_type} />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Instructions / Remarks (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Special instructions for students and teachers"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Subject Schedules & Marks Configuration */}
                    <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold">Subject Wise Exam & Marks Distribution</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Configure the subjects included in this exam, along with full marks and pass marks.
                                </p>
                            </div>
                        </div>

                        {data.schedules.length === 0 ? (
                            <div className="text-center py-6 text-sm text-muted-foreground italic">
                                No subjects mapped to this class yet. Please assign subjects to this class first.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase">
                                            <th className="px-3 py-2 text-left">Subject</th>
                                            <th className="px-3 py-2 text-left">Exam Date</th>
                                            <th className="px-3 py-2 text-center">Total Marks</th>
                                            <th className="px-3 py-2 text-center">Pass Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {data.schedules.map((sched, idx) => (
                                            <tr key={sched.class_subject_id}>
                                                <td className="px-3 py-2.5 font-medium">
                                                    {sched.subject_name}
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <Input
                                                        type="date"
                                                        className="h-8 text-xs max-w-[150px]"
                                                        value={sched.exam_date}
                                                        onChange={(e) => updateSchedule(idx, 'exam_date', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <Input
                                                        type="number"
                                                        className="h-8 text-xs w-20 mx-auto text-center font-bold"
                                                        value={sched.total_marks}
                                                        onChange={(e) =>
                                                            updateSchedule(idx, 'total_marks', Number(e.target.value))
                                                        }
                                                        min={1}
                                                        required
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <Input
                                                        type="number"
                                                        className="h-8 text-xs w-20 mx-auto text-center"
                                                        value={sched.pass_marks}
                                                        onChange={(e) =>
                                                            updateSchedule(idx, 'pass_marks', Number(e.target.value))
                                                        }
                                                        min={0}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <InputError message={errors.schedules} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing || data.schedules.length === 0}>
                            {processing ? 'Creating Exam...' : 'Create & Schedule Exam'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/exams">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ExamsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Exams & Results', href: '/admin/exams' },
        { title: 'Create', href: '#' },
    ],
};

import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, FileSpreadsheet, Save, UserX } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Schedule = {
    id: number;
    subject_name: string;
    total_marks: number;
    pass_marks: number;
};

type StudentMarkRow = {
    student_id: number;
    student_code: string;
    student_name: string;
    marks_obtained: number;
    is_absent: boolean;
    grade: string;
    grade_point: number;
    remarks: string;
};

type Props = {
    exam: {
        id: number;
        title: string;
        academic_class?: { name: string };
    };
    schedules: Schedule[];
    currentSchedule: Schedule | null;
    studentMarks: StudentMarkRow[];
};

export default function AdminExamsMarks({
    exam,
    schedules,
    currentSchedule,
    studentMarks: initialStudentMarks,
}: Props) {
    const [marks, setMarks] = useState<StudentMarkRow[]>(initialStudentMarks);
    const [saving, setSaving] = useState(false);

    function handleScheduleChange(schedId: number) {
        router.get(
            `/admin/exams/${exam.id}/marks`,
            { schedule_id: schedId },
            { preserveState: false },
        );
    }

    function updateMark(studentId: number, field: keyof StudentMarkRow, value: any) {
        setMarks((prev) =>
            prev.map((row) => {
                if (row.student_id !== studentId) return row;
                return { ...row, [field]: value };
            }),
        );
    }

    function toggleAbsent(studentId: number) {
        setMarks((prev) =>
            prev.map((row) => {
                if (row.student_id !== studentId) return row;
                const newAbsent = !row.is_absent;
                return {
                    ...row,
                    is_absent: newAbsent,
                    marks_obtained: newAbsent ? 0 : row.marks_obtained,
                };
            }),
        );
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!currentSchedule) return;

        setSaving(true);
        router.post(
            `/admin/exams/${exam.id}/marks`,
            {
                exam_schedule_id: currentSchedule.id,
                marks: marks.map((m) => ({
                    student_id: m.student_id,
                    marks_obtained: m.marks_obtained,
                    is_absent: m.is_absent,
                    remarks: m.remarks,
                })),
            },
            {
                onFinish: () => setSaving(false),
            },
        );
    }

    return (
        <>
            <Head title={`Marks Entry — ${exam.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0 -ml-1">
                                <Link href={`/admin/exams/${exam.id}`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {exam.academic_class?.name}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Marks Entry: {exam.title}</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Enter marks subject by subject. Grade & GPA will be calculated automatically.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/exams/${exam.id}`}>View Tabulation</Link>
                        </Button>
                    </div>
                </div>

                {/* Subject Selector Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b pb-3">
                    {schedules.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => handleScheduleChange(s.id)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                                currentSchedule?.id === s.id
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                            }`}
                        >
                            <span>{s.subject_name}</span>
                            <span className="text-[10px] opacity-80">({s.total_marks} marks)</span>
                        </button>
                    ))}
                </div>

                {/* Marks Entry Form */}
                {currentSchedule ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-muted/20 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h2 className="font-semibold text-sm">
                                        Subject: {currentSchedule.subject_name}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Full Marks: <strong>{currentSchedule.total_marks}</strong> | Pass Marks:{' '}
                                        <strong>{currentSchedule.pass_marks}</strong>
                                    </p>
                                </div>
                                <Button type="submit" disabled={saving} size="sm" className="gap-1.5 self-end">
                                    <Save className="h-4 w-4" />
                                    {saving ? 'Saving...' : 'Save Marks'}
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40 text-xs text-muted-foreground uppercase">
                                            <th className="px-4 py-3 text-left">Student Code</th>
                                            <th className="px-4 py-3 text-left">Student Name</th>
                                            <th className="px-4 py-3 text-center">Marks Obtained (0 – {currentSchedule.total_marks})</th>
                                            <th className="px-4 py-3 text-center">Attendance</th>
                                            <th className="px-4 py-3 text-left">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {marks.map((row) => (
                                            <tr
                                                key={row.student_id}
                                                className={`hover:bg-muted/30 ${
                                                    row.is_absent ? 'bg-muted/50 opacity-75' : ''
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                    {row.student_code}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-foreground">
                                                    {row.student_name}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Input
                                                        type="number"
                                                        className="h-8 w-28 text-center mx-auto font-bold text-sm"
                                                        disabled={row.is_absent}
                                                        value={row.marks_obtained}
                                                        onChange={(e) =>
                                                            updateMark(
                                                                row.student_id,
                                                                'marks_obtained',
                                                                Math.min(
                                                                    Number(e.target.value),
                                                                    currentSchedule.total_marks,
                                                                ),
                                                            )
                                                        }
                                                        min={0}
                                                        max={currentSchedule.total_marks}
                                                        step="0.5"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleAbsent(row.student_id)}
                                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                                                            row.is_absent
                                                                ? 'bg-destructive/10 text-destructive border-destructive/30'
                                                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800'
                                                        }`}
                                                    >
                                                        {row.is_absent ? 'Absent' : 'Present'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="text"
                                                        placeholder="Optional notes"
                                                        className="h-8 text-xs max-w-xs"
                                                        value={row.remarks}
                                                        onChange={(e) =>
                                                            updateMark(
                                                                row.student_id,
                                                                'remarks',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={saving} className="gap-2 px-6">
                                <Save className="h-4 w-4" />
                                {saving ? 'Saving...' : 'Save All Marks'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                        No subject schedule selected.
                    </div>
                )}
            </div>
        </>
    );
}

AdminExamsMarks.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Exams & Results', href: '/admin/exams' },
        { title: 'Marks Entry', href: '#' },
    ],
};

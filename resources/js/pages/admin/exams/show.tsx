import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    CheckCircle,
    Eye,
    FileSpreadsheet,
    Globe,
    Printer,
    Trophy,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass } from '@/types';

type SubjectSchedule = {
    id: number;
    subject_name: string;
    total_marks: number;
    pass_marks: number;
};

type SubjectMarkDetail = {
    schedule_id: number;
    subject_name: string;
    total_marks: number;
    pass_marks: number;
    marks_obtained: number;
    grade: string;
    grade_point: number;
    is_absent: boolean;
};

type StudentTabulation = {
    student_id: number;
    student_code: string;
    student_name: string;
    student_roll: string;
    subject_marks: SubjectMarkDetail[];
    total_marks_obtained: number;
    total_max_marks: number;
    percentage: number;
    gpa: number;
    grade: string;
    has_failed: boolean;
    rank: number | string;
};

type Props = {
    exam: {
        id: number;
        title: string;
        exam_type: string;
        start_date: string;
        is_published: boolean;
        academic_class?: AcademicClass;
    };
    tabulation: {
        schedules: SubjectSchedule[];
        students: StudentTabulation[];
        total_students: number;
        passed_students: number;
        failed_students: number;
    };
};

export default function ExamsShow({ exam, tabulation }: Props) {
    const passRate =
        tabulation.total_students > 0
            ? Math.round((tabulation.passed_students / tabulation.total_students) * 100)
            : 0;

    return (
        <>
            <Head title={`Tabulation Sheet — ${exam.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0 -ml-1">
                                <Link href="/admin/exams">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {exam.academic_class?.name}
                            </span>
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                    exam.is_published
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}
                            >
                                {exam.is_published ? 'Published' : 'Unpublished (Draft)'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{exam.title}</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Official Tabulation Sheet, GPA & Merit Positions.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={exam.is_published ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => router.patch(`/admin/exams/${exam.id}/toggle-publish`)}
                            className="gap-1.5"
                        >
                            <Globe className="h-4 w-4" />
                            {exam.is_published ? 'Unpublish Results' : 'Publish Results to Students'}
                        </Button>

                        <Button variant="outline" size="sm" asChild className="gap-1.5">
                            <Link href={`/admin/exams/${exam.id}/marks`}>
                                <FileSpreadsheet className="h-4 w-4 text-primary" />
                                Edit Marks
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <div className="text-xs text-muted-foreground font-medium">Total Students</div>
                        <div className="text-2xl font-bold mt-1">{tabulation.total_students}</div>
                    </div>
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <div className="text-xs text-muted-foreground font-medium">Passed Students</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">{tabulation.passed_students}</div>
                    </div>
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <div className="text-xs text-muted-foreground font-medium">Failed Students</div>
                        <div className="text-2xl font-bold text-red-600 mt-1">{tabulation.failed_students}</div>
                    </div>
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <div className="text-xs text-muted-foreground font-medium">Class Pass Rate</div>
                        <div className="text-2xl font-bold text-primary mt-1">{passRate}%</div>
                    </div>
                </div>

                {/* Tabulation Table */}
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-primary" />
                            Class Tabulation & Merit List
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b bg-muted/40 text-muted-foreground">
                                    <th className="px-3 py-3 text-center font-bold">Rank</th>
                                    <th className="px-3 py-3 text-left font-bold">Student Code</th>
                                    <th className="px-3 py-3 text-left font-bold">Student Name</th>
                                    {tabulation.schedules.map((s) => (
                                        <th key={s.id} className="px-2 py-3 text-center font-bold whitespace-nowrap">
                                            {s.subject_name}
                                            <span className="block text-[10px] font-normal text-muted-foreground">
                                                (Max: {s.total_marks})
                                            </span>
                                        </th>
                                    ))}
                                    <th className="px-3 py-3 text-center font-bold">Total Marks</th>
                                    <th className="px-3 py-3 text-center font-bold">Percentage</th>
                                    <th className="px-3 py-3 text-center font-bold">GPA</th>
                                    <th className="px-3 py-3 text-center font-bold">Grade</th>
                                    <th className="px-3 py-3 text-right font-bold">Report Card</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tabulation.students.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8 + tabulation.schedules.length}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No students found in this class.
                                        </td>
                                    </tr>
                                ) : (
                                    tabulation.students.map((stu) => (
                                        <tr
                                            key={stu.student_id}
                                            className={`hover:bg-muted/40 transition-colors ${
                                                stu.has_failed ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                                            }`}
                                        >
                                            <td className="px-3 py-3 text-center font-bold">
                                                {stu.rank === 1 ? (
                                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-extrabold">
                                                        🥇 1
                                                    </span>
                                                ) : stu.rank === 2 ? (
                                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs font-extrabold">
                                                        🥈 2
                                                    </span>
                                                ) : stu.rank === 3 ? (
                                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-800/20 text-amber-950 dark:bg-amber-900/30 dark:text-amber-200 text-xs font-extrabold">
                                                        🥉 3
                                                    </span>
                                                ) : stu.has_failed ? (
                                                    <span className="text-destructive font-bold">Failed</span>
                                                ) : (
                                                    <span className="text-muted-foreground">#{stu.rank}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 font-mono text-muted-foreground">
                                                {stu.student_code}
                                            </td>
                                            <td className="px-3 py-3 font-semibold text-foreground">
                                                {stu.student_name}
                                            </td>
                                            {stu.subject_marks.map((sm) => (
                                                <td
                                                    key={sm.schedule_id}
                                                    className="px-2 py-3 text-center whitespace-nowrap"
                                                >
                                                    {sm.is_absent ? (
                                                        <span className="text-destructive font-bold text-[11px]">
                                                            Absent
                                                        </span>
                                                    ) : (
                                                        <div>
                                                            <span className="font-semibold">{sm.marks_obtained}</span>
                                                            <span
                                                                className={`ml-1 text-[10px] font-bold px-1 rounded ${
                                                                    sm.grade === 'F'
                                                                        ? 'bg-destructive/10 text-destructive'
                                                                        : 'bg-muted text-muted-foreground'
                                                                }`}
                                                            >
                                                                {sm.grade}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="px-3 py-3 text-center font-bold">
                                                {stu.total_marks_obtained} / {stu.total_max_marks}
                                            </td>
                                            <td className="px-3 py-3 text-center font-medium">
                                                {stu.percentage}%
                                            </td>
                                            <td className="px-3 py-3 text-center font-mono font-bold text-sm">
                                                {stu.gpa.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold ${
                                                        stu.grade === 'A+'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                                            : stu.grade === 'F'
                                                              ? 'bg-destructive/10 text-destructive font-black'
                                                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {stu.grade}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    className="h-7 gap-1 text-[11px] font-medium"
                                                >
                                                    <Link
                                                        href={`/admin/exams/${exam.id}/report-card/${stu.student_id}`}
                                                        target="_blank"
                                                    >
                                                        <Printer className="h-3 w-3" />
                                                        <span>Print Marksheet</span>
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

ExamsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Exams & Results', href: '/admin/exams' },
        { title: 'Tabulation Sheet', href: '#' },
    ],
};

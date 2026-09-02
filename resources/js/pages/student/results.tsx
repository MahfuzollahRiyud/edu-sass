import { Head, Link } from '@inertiajs/react';
import { Award, Calendar, CheckCircle2, Eye, FileSpreadsheet, Printer, Trophy, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass, Student } from '@/types';

type SubjectMark = {
    schedule_id: number;
    subject_name: string;
    total_marks: number;
    pass_marks: number;
    marks_obtained: number;
    grade: string;
    grade_point: number;
    is_absent: boolean;
};

type ExamSummary = {
    exam_id: number;
    title: string;
    exam_type: string;
    start_date: string;
    class_name: string;
    result: {
        total_marks_obtained: number;
        total_max_marks: number;
        percentage: number;
        gpa: number;
        grade: string;
        has_failed: boolean;
        rank: number | string;
        subject_marks: SubjectMark[];
    } | null;
};

type Props = {
    student: Student & { academic_class?: AcademicClass };
    examSummaries: ExamSummary[];
};

export default function StudentResults({ student, examSummaries }: Props) {
    return (
        <>
            <Head title="My Exam Results & Marksheets" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-5xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Academic Results & Marksheets</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        View your published exam performance, GPA, rank, and printable progress reports.
                    </p>
                </div>

                {/* Exams List */}
                {examSummaries.length === 0 ? (
                    <div className="bg-card border rounded-xl p-12 text-center text-muted-foreground">
                        <Award className="mx-auto mb-3 h-12 w-12 opacity-30 text-primary" />
                        <h2 className="text-base font-semibold text-foreground">No Published Results Yet</h2>
                        <p className="text-xs mt-1">
                            Your examination results will appear here once published by your coaching administration.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {examSummaries.map((exam) => (
                            <div
                                key={exam.exam_id}
                                className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Exam Card Top Banner */}
                                <div className="p-5 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                                                {exam.class_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {exam.start_date}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold text-foreground mt-1">{exam.title}</h2>
                                    </div>

                                    {exam.result && (
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" asChild className="gap-1.5 font-medium">
                                                <Link href={`/student/results/${exam.exam_id}`} target="_blank">
                                                    <Printer className="h-4 w-4" />
                                                    Print Full Marksheet
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Results Content */}
                                {exam.result ? (
                                    <div className="p-5 space-y-5">
                                        {/* Score Snapshot Badges */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                            <div className="border rounded-xl p-3 bg-background">
                                                <span className="text-[11px] text-muted-foreground">Total Score</span>
                                                <div className="text-base sm:text-lg font-extrabold mt-0.5">
                                                    {exam.result.total_marks_obtained}
                                                    <span className="text-xs font-normal text-muted-foreground">
                                                        {' '}/ {exam.result.total_max_marks}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border rounded-xl p-3 bg-background">
                                                <span className="text-[11px] text-muted-foreground">Percentage</span>
                                                <div className="text-base sm:text-lg font-extrabold mt-0.5">
                                                    {exam.result.percentage}%
                                                </div>
                                            </div>

                                            <div className="border rounded-xl p-3 bg-background">
                                                <span className="text-[11px] text-muted-foreground">GPA (5.00)</span>
                                                <div className="text-base sm:text-lg font-mono font-black text-primary mt-0.5">
                                                    {exam.result.gpa.toFixed(2)} ({exam.result.grade})
                                                </div>
                                            </div>

                                            <div className="border rounded-xl p-3 bg-background">
                                                <span className="text-[11px] text-muted-foreground">Class Merit Position</span>
                                                <div className="text-base sm:text-lg font-extrabold mt-0.5 flex items-center justify-center gap-1">
                                                    {exam.result.has_failed ? (
                                                        <span className="text-destructive font-bold text-sm">Failed</span>
                                                    ) : (
                                                        <>
                                                            <Trophy className="h-4 w-4 text-amber-500" />
                                                            <span>Rank #{exam.result.rank}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject Wise Table */}
                                        <div className="border rounded-xl overflow-hidden">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-muted/40 text-muted-foreground font-bold uppercase border-b">
                                                        <th className="px-3 py-2 text-left">Subject</th>
                                                        <th className="px-3 py-2 text-center">Full Marks</th>
                                                        <th className="px-3 py-2 text-center">Pass Marks</th>
                                                        <th className="px-3 py-2 text-center">Marks Obtained</th>
                                                        <th className="px-3 py-2 text-center">Grade</th>
                                                        <th className="px-3 py-2 text-center">Grade Point</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {exam.result.subject_marks.map((sm) => (
                                                        <tr key={sm.schedule_id} className="hover:bg-muted/30">
                                                            <td className="px-3 py-2.5 font-semibold text-foreground">
                                                                {sm.subject_name}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center text-muted-foreground">
                                                                {sm.total_marks}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center text-muted-foreground">
                                                                {sm.pass_marks}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center font-bold">
                                                                {sm.is_absent ? (
                                                                    <span className="text-destructive font-bold">Absent</span>
                                                                ) : (
                                                                    sm.marks_obtained
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center font-extrabold">
                                                                <span
                                                                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                                                                        sm.grade === 'A+'
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                                                            : sm.grade === 'F'
                                                                              ? 'bg-destructive/10 text-destructive'
                                                                              : 'bg-muted text-foreground'
                                                                    }`}
                                                                >
                                                                    {sm.grade}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center font-mono font-bold">
                                                                {sm.grade_point.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-xs text-muted-foreground italic">
                                        Marks tabulation in progress.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

StudentResults.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Exam Results', href: '/student/results' },
    ],
};

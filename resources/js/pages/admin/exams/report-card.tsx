import { Head, usePage } from '@inertiajs/react';
import { Award, CheckCircle2, GraduationCap, Printer, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass, SharedData, Student } from '@/types';

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

type StudentResult = {
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
        academic_class?: AcademicClass;
    };
    student: Student & { user?: { name: string; email: string } };
    result: StudentResult | null;
};

export default function ReportCardView({ exam, student, result }: Props) {
    const { tenant } = usePage<SharedData>().props;

    function handlePrint() {
        window.print();
    }

    if (!result) {
        return (
            <div className="p-12 text-center text-muted-foreground">
                <p>No result data available for this student.</p>
            </div>
        );
    }

    return (
        <>
            <Head title={`Report Card — ${student.user?.name} (${exam.title})`} />

            {/* Print action toolbar (hidden during print) */}
            <div className="bg-muted/40 border-b px-6 py-3 flex items-center justify-between print:hidden">
                <div className="text-xs text-muted-foreground">
                    Official Student Progress Report & Academic Marksheet
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handlePrint} size="sm" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print / Download PDF
                    </Button>
                </div>
            </div>

            {/* Printable Marksheet Container */}
            <div className="max-w-4xl mx-auto p-6 sm:p-10 my-6 bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border border-border/80 rounded-2xl shadow-lg print:shadow-none print:border-none print:m-0 print:p-4 print:max-w-full">
                {/* Header with Coaching Logo & Details */}
                <div className="text-center border-b-2 border-primary/40 pb-6 mb-6">
                    <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <GraduationCap className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
                            {tenant?.name ?? 'Coaching & Academic Institute'}
                        </h1>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        {tenant?.address ? `${tenant.address} • ` : ''}
                        {tenant?.phone ? `Phone: ${tenant.phone} • ` : ''}
                        {tenant?.email ? `Email: ${tenant.email}` : ''}
                    </p>

                    <div className="inline-block mt-3 px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider border border-primary/20">
                        Academic Progress Report & Marksheet
                    </div>
                    <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
                        {exam.title}
                    </div>
                </div>

                {/* Student Profile Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6 text-xs">
                    <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block">Student Name:</span>
                        <strong className="text-sm text-foreground">{student.user?.name}</strong>
                    </div>
                    <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block">Student ID:</span>
                        <strong className="font-mono text-primary font-bold">{student.student_id}</strong>
                    </div>
                    <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block">Academic Class:</span>
                        <strong className="text-foreground">
                            {exam.academic_class?.name}{' '}
                            {exam.academic_class?.section ? `(${exam.academic_class.section})` : ''}
                        </strong>
                    </div>
                    <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block">Merit Position:</span>
                        <strong className="text-sm font-extrabold text-primary">
                            {result.has_failed ? '—' : `#${result.rank}`}
                        </strong>
                    </div>
                </div>

                {/* Subject Marks Table */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold uppercase">
                                <th className="px-4 py-2.5 text-left">Subject</th>
                                <th className="px-4 py-2.5 text-center">Full Marks</th>
                                <th className="px-4 py-2.5 text-center">Pass Marks</th>
                                <th className="px-4 py-2.5 text-center">Marks Obtained</th>
                                <th className="px-4 py-2.5 text-center">Letter Grade</th>
                                <th className="px-4 py-2.5 text-center">Grade Point</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {result.subject_marks.map((sm) => (
                                <tr key={sm.schedule_id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                    <td className="px-4 py-2.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                        {sm.subject_name}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                                        {sm.total_marks}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                                        {sm.pass_marks}
                                    </td>
                                    <td className="px-4 py-2.5 text-center font-bold text-sm text-foreground">
                                        {sm.is_absent ? (
                                            <span className="text-red-600 font-bold">Absent</span>
                                        ) : (
                                            sm.marks_obtained
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded font-black text-xs ${
                                                sm.grade === 'A+'
                                                    ? 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300'
                                                    : sm.grade === 'F'
                                                      ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300'
                                                      : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200'
                                            }`}
                                        >
                                            {sm.grade}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center font-mono font-bold text-foreground">
                                        {sm.grade_point.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-zinc-100/80 dark:bg-zinc-900/80 font-bold border-t-2 border-zinc-300 dark:border-zinc-700">
                                <td className="px-4 py-3">Total / Overall Average</td>
                                <td className="px-4 py-3 text-center">{result.total_max_marks}</td>
                                <td className="px-4 py-3 text-center">—</td>
                                <td className="px-4 py-3 text-center text-sm font-extrabold text-primary">
                                    {result.total_marks_obtained}
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-extrabold">
                                    {result.grade}
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-mono font-black text-primary">
                                    {result.gpa.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Result Summary & Performance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 bg-zinc-50 dark:bg-zinc-900 text-center">
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Total Marks</div>
                        <div className="text-lg font-bold text-foreground mt-0.5">
                            {result.total_marks_obtained} <span className="text-xs font-normal text-zinc-500">/ {result.total_max_marks}</span>
                        </div>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 bg-zinc-50 dark:bg-zinc-900 text-center">
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Percentage</div>
                        <div className="text-lg font-bold text-foreground mt-0.5">{result.percentage}%</div>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 bg-zinc-50 dark:bg-zinc-900 text-center">
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Grade Point Average</div>
                        <div className="text-lg font-mono font-black text-primary mt-0.5">{result.gpa.toFixed(2)}</div>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 bg-zinc-50 dark:bg-zinc-900 text-center">
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Final Outcome</div>
                        <div
                            className={`text-lg font-extrabold mt-0.5 ${
                                result.has_failed ? 'text-red-600' : 'text-green-600'
                            }`}
                        >
                            {result.has_failed ? 'FAILED' : 'PASSED'}
                        </div>
                    </div>
                </div>

                {/* Grading Scale Guide & Remarks */}
                <div className="grid sm:grid-cols-2 gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-10 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div>
                        <strong className="block text-foreground font-semibold mb-1">Standard Grading Scale:</strong>
                        <div className="grid grid-cols-2 gap-x-2 text-[10px]">
                            <span>80% - 100%: <strong>A+ (5.00)</strong></span>
                            <span>50% - 59%: <strong>B (3.00)</strong></span>
                            <span>70% - 79%: <strong>A (4.00)</strong></span>
                            <span>40% - 49%: <strong>C (2.00)</strong></span>
                            <span>60% - 69%: <strong>A- (3.50)</strong></span>
                            <span>33% - 39%: <strong>D (1.00)</strong></span>
                            <span className="col-span-2 text-red-600">Below 33%: <strong>F (0.00) — Fail</strong></span>
                        </div>
                    </div>
                    <div>
                        <strong className="block text-foreground font-semibold mb-1">Teacher Remarks:</strong>
                        <p className="italic text-zinc-700 dark:text-zinc-300">
                            {result.gpa >= 4.5
                                ? 'Outstanding academic performance. Keep up the dedication!'
                                : result.gpa >= 3.5
                                  ? 'Very good performance. Regular practice will achieve top excellence.'
                                  : result.has_failed
                                    ? 'Requires serious attention and improvement in failed subjects.'
                                    : 'Satisfactory. Needs more practice and consistency.'}
                        </p>
                    </div>
                </div>

                {/* Official Signatures */}
                <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="border-t border-zinc-400 dark:border-zinc-600 pt-2">
                        <p className="font-semibold">Class Teacher</p>
                        <p className="text-[10px] text-zinc-500">Signature</p>
                    </div>

                    <div className="border-t border-zinc-400 dark:border-zinc-600 pt-2">
                        <p className="font-semibold">Guardian</p>
                        <p className="text-[10px] text-zinc-500">Signature</p>
                    </div>

                    <div className="border-t border-zinc-400 dark:border-zinc-600 pt-2">
                        <p className="font-semibold text-primary">Principal / Head</p>
                        <p className="text-[10px] text-zinc-500">Seal & Signature</p>
                    </div>
                </div>
            </div>
        </>
    );
}

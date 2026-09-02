import { Head, Link } from '@inertiajs/react';
import { Award, Calendar, FileSpreadsheet, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass, PaginatedData } from '@/types';

type Exam = {
    id: number;
    title: string;
    exam_type: string;
    start_date: string;
    end_date: string | null;
    is_published: boolean;
    academic_class?: AcademicClass;
};

type Props = {
    exams: PaginatedData<Exam>;
};

export default function TeacherExamsIndex({ exams }: Props) {
    const typeLabels: Record<string, string> = {
        class_test: 'Class Test',
        monthly_test: 'Monthly Test',
        model_test: 'Model Test',
        term_final: 'Term Final',
    };

    return (
        <>
            <Head title="Assigned Exams & Marks" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Assigned Exams & Marks</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Select an exam to input or review marks for your assigned subjects.
                    </p>
                </div>

                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left font-medium">Exam Details</th>
                                    <th className="px-4 py-3 text-left font-medium">Class</th>
                                    <th className="px-4 py-3 text-left font-medium">Type</th>
                                    <th className="px-4 py-3 text-center font-medium">Results Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {exams.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center">
                                            <Award className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p className="font-medium">No assigned exams yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    exams.data.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <div className="font-semibold text-foreground">{exam.title}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{new Date(exam.start_date).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 font-medium">
                                                <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold">
                                                    {exam.academic_class?.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                {typeLabels[exam.exam_type] ?? exam.exam_type}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        exam.is_published
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {exam.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <Button size="sm" asChild className="gap-1.5 h-8 text-xs font-medium">
                                                    <Link href={`/teacher/exams/${exam.id}/marks`}>
                                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                                        Enter Marks
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

TeacherExamsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/teacher/dashboard' },
        { title: 'Exams & Marks', href: '/teacher/exams' },
    ],
};

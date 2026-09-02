import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    Calendar,
    CheckCircle2,
    Eye,
    FileSpreadsheet,
    Globe,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass, PaginatedData } from '@/types';

type Exam = {
    id: number;
    title: string;
    exam_type: string;
    start_date: string;
    end_date: string | null;
    is_published: boolean;
    description: string | null;
    academic_class?: AcademicClass;
    exam_schedules_count: number;
    exam_marks_count: number;
};

type Props = {
    exams: PaginatedData<Exam>;
    classes: AcademicClass[];
    filters: { academic_class_id?: string };
};

export default function ExamsIndex({ exams, classes, filters }: Props) {
    function handleClassFilter(classId: string) {
        router.get(
            '/admin/exams',
            { academic_class_id: classId || undefined },
            { preserveState: true },
        );
    }

    const typeLabels: Record<string, string> = {
        class_test: 'Class Test',
        monthly_test: 'Monthly Test',
        model_test: 'Model Test',
        term_final: 'Term Final',
    };

    return (
        <>
            <Head title="Exams & Results" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Exams & Results
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage examinations, enter marks, calculate GPAs, and generate report cards.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/exams/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Exam
                        </Link>
                    </Button>
                </div>

                {/* Filter bar */}
                <div className="flex items-center gap-3">
                    <select
                        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={filters.academic_class_id ?? ''}
                        onChange={(e) => handleClassFilter(e.target.value)}
                    >
                        <option value="">All Academic Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `(${cls.section})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left font-medium">Exam Details</th>
                                    <th className="px-4 py-3 text-left font-medium">Class</th>
                                    <th className="px-4 py-3 text-left font-medium">Type</th>
                                    <th className="px-4 py-3 text-center font-medium">Subjects</th>
                                    <th className="px-4 py-3 text-center font-medium">Results Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {exams.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            <Award className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p className="font-medium">No exams found</p>
                                            <p className="text-xs mt-1">Create your first examination schedule to get started.</p>
                                        </td>
                                    </tr>
                                )}
                                {exams.data.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="font-semibold text-foreground">{exam.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{new Date(exam.start_date).toLocaleDateString()}</span>
                                                {exam.end_date && exam.end_date !== exam.start_date && (
                                                    <span>– {new Date(exam.end_date).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-medium">
                                            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold">
                                                {exam.academic_class?.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {typeLabels[exam.exam_type] ?? exam.exam_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded">
                                                {exam.exam_schedules_count} Subjects
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <button
                                                onClick={() => router.patch(`/admin/exams/${exam.id}/toggle-publish`)}
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-colors ${
                                                    exam.is_published
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200'
                                                }`}
                                                title={exam.is_published ? 'Click to Unpublish' : 'Click to Publish to Students'}
                                            >
                                                {exam.is_published ? (
                                                    <>
                                                        <Globe className="h-3 w-3" /> Published
                                                    </>
                                                ) : (
                                                    'Draft / Unpublished'
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button variant="outline" size="sm" asChild className="h-8 gap-1 text-xs">
                                                    <Link href={`/admin/exams/${exam.id}/marks`}>
                                                        <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
                                                        <span>Marks</span>
                                                    </Link>
                                                </Button>

                                                <Button variant="secondary" size="sm" asChild className="h-8 gap-1 text-xs font-medium">
                                                    <Link href={`/admin/exams/${exam.id}`}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Tabulation</span>
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this exam? All marks will be permanently removed.')) {
                                                            router.delete(`/admin/exams/${exam.id}`);
                                                        }
                                                    }}
                                                    title="Delete Exam"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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

ExamsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Exams & Results', href: '/admin/exams' },
    ],
};

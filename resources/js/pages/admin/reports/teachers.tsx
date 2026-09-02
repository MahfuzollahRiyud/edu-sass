import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, DollarSign, GraduationCap, Mail, Phone, Printer, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrintHeader, PrintSignatureFooter } from '@/components/print-header';

type SubjectBreakdown = {
    id: number;
    class_name: string;
    subject_name: string;
    student_count: number;
    estimated_revenue: number;
};

type TeacherReportItem = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    designation: string;
    unique_students_count: number;
    total_assigned_classes: number;
    total_estimated_revenue: number;
    subjects: SubjectBreakdown[];
};

type Props = {
    teachers: TeacherReportItem[];
    summary: {
        total_teachers: number;
        total_students_enrolled: number;
        total_revenue_potential: number;
    };
};

export default function TeacherRevenueReport({ teachers, summary }: Props) {
    const { auth } = usePage<any>().props;

    return (
        <>
            <Head title="Teacher & Subject Revenue Report" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Faculty & Subject Revenue Report</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Overview of student enrollments, subject distribution, and fee potential per teacher.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Print / PDF Report
                        </Button>
                    </div>
                </div>

                <PrintHeader
                    institutionName={auth?.tenant?.name || 'Coaching Center'}
                    reportTitle="Faculty & Subject Revenue / Student Load Statement"
                    metaInfo={[
                        { label: 'Active Faculty Count', value: summary.total_teachers },
                        { label: 'Total Student Load', value: summary.total_students_enrolled },
                        { label: 'Total Monthly Value', value: `৳${Number(summary.total_revenue_potential).toLocaleString()}` },
                    ]}
                />

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3 print:hidden">
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Active Teachers</p>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{summary.total_teachers}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Student Enrollments</p>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-primary">{summary.total_students_enrolled}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Monthly Fee Value</p>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-green-600">৳{Number(summary.total_revenue_potential).toLocaleString()}</p>
                    </div>
                </div>

                {/* Teachers Report Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-slate-800 dark:text-slate-200">
                                    <th className="px-4 py-3 text-left font-semibold">Teacher Name & Info</th>
                                    <th className="px-4 py-3 text-left font-semibold">Assigned Subjects & Batches</th>
                                    <th className="px-4 py-3 text-center font-semibold">Total Students</th>
                                    <th className="px-4 py-3 text-right font-semibold">Total Fee Generated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-muted-foreground px-4 py-12 text-center">
                                            <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p className="font-medium">No teacher records found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    teachers.map((t) => (
                                        <tr key={t.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                            <td className="px-4 py-4 align-top">
                                                <div className="font-bold text-base text-foreground">{t.name}</div>
                                                <div className="text-xs text-muted-foreground font-medium mt-0.5">{t.designation}</div>
                                                {t.phone && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Phone className="h-3 w-3" /> {t.phone}
                                                    </div>
                                                )}
                                                {t.email && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Mail className="h-3 w-3" /> {t.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                {t.subjects.length === 0 ? (
                                                    <span className="text-xs text-muted-foreground italic">No subjects assigned</span>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        {t.subjects.map((s) => (
                                                            <div
                                                                key={s.id}
                                                                className="flex items-center justify-between text-xs bg-muted/50 dark:bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/50"
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                                                                    <span className="font-medium text-foreground">{s.class_name}</span>
                                                                    <span className="text-muted-foreground">• {s.subject_name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-muted-foreground">{s.student_count} students</span>
                                                                    <span className="font-semibold text-foreground">৳{Number(s.estimated_revenue).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 align-top text-center font-bold text-base text-primary">
                                                {t.unique_students_count}
                                            </td>
                                            <td className="px-4 py-4 align-top text-right font-bold text-base font-mono text-green-600">
                                                ৳{Number(t.total_estimated_revenue).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PrintSignatureFooter />
            </div>
        </>
    );
}

TeacherRevenueReport.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Faculty Revenue Report', href: '/admin/reports/teachers' },
    ],
};

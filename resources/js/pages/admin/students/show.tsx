import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, CheckCircle2, CreditCard, Edit, GraduationCap, LogIn, Mail, MapPin, Phone, Receipt, User, UserCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Student } from '@/types';

type Props = {
    student: Student;
    stats: {
        total_paid: number;
        total_due: number;
        attendance_percentage: number;
        total_attendances: number;
    };
};

export default function StudentShow({ student, stats }: Props) {
    return (
        <>
            <Head title={`Student — ${student.user?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">{student.user?.name}</h1>
                            <span className="font-mono text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                                {student.student_id}
                            </span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    student.is_active
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                            >
                                {student.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {student.academic_class?.name} {student.academic_class?.section ? `(${student.academic_class.section})` : ''} • Admitted on{' '}
                            {new Date(student.admission_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.post(`/impersonate/${student.user_id}`)}
                            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                        >
                            <LogIn className="h-4 w-4" />
                            Login as Student
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/admin/students/${student.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Student
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/fees/create?student_id=${student.id}`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Invoice
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Monthly Fee</p>
                        <p className="mt-1 text-2xl font-bold">৳{Number(student.monthly_fee).toLocaleString()}</p>
                    </div>
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Paid</p>
                        <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                            ৳{Number(stats.total_paid).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Due</p>
                        <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                            ৳{Number(stats.total_due).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Attendance Rate</p>
                        <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.attendance_percentage}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{stats.total_attendances} sessions recorded</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Enrolled Subjects & Teachers */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Enrolled Subjects */}
                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-sm flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Enrolled Subjects ({student.student_subjects?.length ?? 0})
                                </h2>
                            </div>
                            <div className="p-4 grid gap-3 sm:grid-cols-2">
                                {student.student_subjects?.map((ss) => {
                                    const cs = ss.class_subject;
                                    return (
                                        <div key={ss.id} className="p-3 border rounded-lg bg-muted/20">
                                            <div className="font-medium text-sm">{cs?.subject?.name}</div>
                                            <div className="text-muted-foreground text-xs mt-1">
                                                Teachers:{' '}
                                                {cs?.teachers && cs.teachers.length > 0 ? (
                                                    cs.teachers.map((t) => t.user?.name).join(', ')
                                                ) : (
                                                    <span className="italic">Not assigned</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fee Invoices & Payment History */}
                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-sm flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Fee Invoices & History
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="px-4 py-2 text-left font-medium">Invoice Title</th>
                                            <th className="px-4 py-2 text-right font-medium">Amount</th>
                                            <th className="px-4 py-2 text-right font-medium">Paid</th>
                                            <th className="px-4 py-2 text-right font-medium">Due</th>
                                            <th className="px-4 py-2 text-center font-medium">Status</th>
                                            <th className="px-4 py-2 text-right font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!student.fee_invoices || student.fee_invoices.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="text-muted-foreground px-4 py-6 text-center text-xs">
                                                    No invoices issued yet.
                                                </td>
                                            </tr>
                                        )}
                                        {student.fee_invoices?.map((inv) => (
                                            <tr key={inv.id} className="border-b last:border-b-0 hover:bg-muted/50">
                                                <td className="px-4 py-2.5 font-medium">{inv.title}</td>
                                                <td className="px-4 py-2.5 text-right font-mono">৳{Number(inv.amount).toLocaleString()}</td>
                                                <td className="px-4 py-2.5 text-right font-mono text-green-600">৳{Number(inv.paid_amount).toLocaleString()}</td>
                                                <td className="px-4 py-2.5 text-right font-mono text-red-600 font-semibold">৳{Number(inv.due_amount).toLocaleString()}</td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            inv.status === 'paid'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                : inv.status === 'partial'
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}
                                                    >
                                                        {inv.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    {Number(inv.due_amount) > 0 && (
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/admin/payments/create?invoice_id=${inv.id}`}>
                                                                Pay
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact & Guardian Details */}
                    <div className="space-y-6">
                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 space-y-4">
                            <h2 className="font-semibold text-sm border-b pb-2 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Personal & Contact Info
                            </h2>
                            <div className="space-y-2.5 text-sm">
                                <div>
                                    <span className="text-muted-foreground text-xs block">Email Address</span>
                                    <span className="font-medium">{student.user?.email}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs block">Phone Number</span>
                                    <span className="font-medium">{student.phone || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs block">Guardian Name</span>
                                    <span className="font-medium">{student.guardian_name || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs block">Guardian Phone</span>
                                    <span className="font-medium">{student.guardian_phone || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs block">Date of Birth</span>
                                    <span className="font-medium">
                                        {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'Not provided'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs block">Gender</span>
                                    <span className="font-medium capitalize">{student.gender || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs block">Address</span>
                                    <span className="font-medium">{student.address || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StudentShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Students', href: '/admin/students' },
        { title: 'Profile', href: '#' },
    ],
};

import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    GraduationCap,
    Library,
    Plus,
    Receipt,
    UserCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Payment, Schedule, SharedData, Student } from '@/types';

type Props = {
    stats: {
        total_students: number;
        total_teachers: number;
        total_classes: number;
        total_due: number;
        today_collection: number;
        monthly_collection: number;
        today_classes_count: number;
        today_attendance_marked: number;
        today_present_marked: number;
    };
    todaySchedules: Schedule[];
    recentStudents: Student[];
    recentPayments: Payment[];
    todayDate: string;
};

export default function AdminDashboard({
    stats,
    todaySchedules,
    recentStudents,
    recentPayments,
    todayDate,
}: Props) {
    const { tenant } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {tenant?.name || 'Coaching Center Dashboard'}
                        </h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {todayDate} • Real-time overview of admissions, attendance, and revenue.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild>
                            <Link href="/admin/students/create">
                                <Plus className="mr-1 h-3.5 w-3.5" />
                                New Student
                            </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <Link href="/admin/payments/create">
                                <Receipt className="mr-1 h-3.5 w-3.5" />
                                Record Payment
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Active Students"
                        value={stats.total_students}
                        icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
                        description="Enrolled in coaching"
                    />
                    <StatCard
                        title="Teachers & Staff"
                        value={stats.total_teachers}
                        icon={<Users className="h-5 w-5 text-purple-500" />}
                        description="Active faculty members"
                    />
                    <StatCard
                        title="Today's Collection"
                        value={`৳${stats.today_collection.toLocaleString()}`}
                        icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
                        description={`This month: ৳${stats.monthly_collection.toLocaleString()}`}
                        isHighlight
                    />
                    <StatCard
                        title="Total Outstanding Dues"
                        value={`৳${stats.total_due.toLocaleString()}`}
                        icon={<CreditCard className="h-5 w-5 text-rose-500" />}
                        description="Unpaid fee invoices"
                        isDanger={stats.total_due > 0}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left 2 Cols: Today's Classes & Recent Admissions */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Today's Classes */}
                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-sm flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    Today's Scheduled Classes ({todaySchedules.length})
                                </h2>
                                <Button variant="ghost" size="sm" asChild className="text-xs">
                                    <Link href="/admin/schedules">View Full Routine</Link>
                                </Button>
                            </div>
                            <div className="divide-y text-sm">
                                {todaySchedules.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-xs">
                                        No classes scheduled for today.
                                    </div>
                                ) : (
                                    todaySchedules.map((sch) => (
                                        <div key={sch.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                                            <div className="space-y-1">
                                                <div className="font-semibold">
                                                    {sch.class_subject?.academic_class?.name}: {sch.class_subject?.subject?.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-3">
                                                    <span>Teacher: {sch.teacher?.user?.name}</span>
                                                    {sch.room && <span>Room: {sch.room}</span>}
                                                </div>
                                            </div>
                                            <div className="font-mono text-xs font-semibold bg-secondary px-2.5 py-1 rounded-md">
                                                {sch.time_slot?.start_time.substring(0, 5)} - {sch.time_slot?.end_time.substring(0, 5)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Admissions */}
                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-sm flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    Recent Student Admissions
                                </h2>
                                <Button variant="ghost" size="sm" asChild className="text-xs">
                                    <Link href="/admin/students">View All</Link>
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/20 text-xs">
                                            <th className="px-4 py-2 text-left font-medium">ID</th>
                                            <th className="px-4 py-2 text-left font-medium">Name</th>
                                            <th className="px-4 py-2 text-left font-medium">Class</th>
                                            <th className="px-4 py-2 text-right font-medium">Monthly Fee</th>
                                            <th className="px-4 py-2 text-right font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentStudents.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-6 text-center text-xs text-muted-foreground">
                                                    No admissions recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                        {recentStudents.map((stu) => (
                                            <tr key={stu.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                                <td className="px-4 py-2.5 font-mono text-xs text-primary font-semibold">
                                                    {stu.student_id}
                                                </td>
                                                <td className="px-4 py-2.5 font-medium">{stu.user?.name}</td>
                                                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                                                    {stu.academic_class?.name}
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-mono font-medium">
                                                    ৳{Number(stu.monthly_fee).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <Button size="sm" variant="ghost" asChild>
                                                        <Link href={`/admin/students/${stu.id}`}>View</Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Recent Payments */}
                    <div className="space-y-6">
                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-sm flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-emerald-600" />
                                    Recent Payment Receipts
                                </h2>
                                <Button variant="ghost" size="sm" asChild className="text-xs">
                                    <Link href="/admin/payments">All Payments</Link>
                                </Button>
                            </div>
                            <div className="divide-y text-sm">
                                {recentPayments.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-xs">
                                        No payments recorded yet.
                                    </div>
                                ) : (
                                    recentPayments.map((p) => (
                                        <div key={p.id} className="p-3.5 space-y-1 hover:bg-muted/30">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-xs">{p.student?.user?.name}</span>
                                                <span className="font-mono font-bold text-xs text-emerald-600">
                                                    +৳{Number(p.amount).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-mono">{p.receipt?.receipt_number}</span>
                                                <span>{p.payment_date}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
};

function StatCard({
    title,
    value,
    icon,
    description,
    isHighlight,
    isDanger,
}: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description?: string;
    isHighlight?: boolean;
    isDanger?: boolean;
}) {
    return (
        <div
            className={`bg-card text-card-foreground border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5 ${
                isHighlight ? 'bg-emerald-500/5 border-emerald-500/30' : isDanger ? 'bg-rose-500/5 border-rose-500/30' : ''
            }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{title}</p>
                    <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
                    {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
                </div>
                <div className="rounded-lg bg-muted/60 p-2">{icon}</div>
            </div>
        </div>
    );
}

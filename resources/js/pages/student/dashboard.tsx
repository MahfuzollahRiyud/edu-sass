import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, CheckCircle2, Clock, CreditCard, DollarSign, MapPin, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Schedule, SharedData, Student } from '@/types';

type Props = {
    student: Student;
    todaySchedules: Schedule[];
    stats: {
        enrolled_subjects_count: number;
        today_classes_count: number;
        attendance_percentage: number;
        total_due: number;
        total_paid: number;
    };
    todayDate: string;
};

export default function StudentDashboard({ student, todaySchedules, stats, todayDate }: Props) {
    const { tenant } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Student Portal" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Hello, {student.user?.name}
                            </h1>
                            <span className="font-mono text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                                {student.student_id}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {todayDate} • Enrolled in {student.academic_class?.name}{' '}
                            {student.academic_class?.section ? `(${student.academic_class.section})` : ''} at{' '}
                            {tenant?.name || 'Coaching Center'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                            <Link href="/student/routine">
                                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                Class Routine
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/student/fees">
                                <Receipt className="mr-1.5 h-3.5 w-3.5" />
                                Fee Invoices
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attendance Rate</p>
                        <p className="mt-1 text-3xl font-bold text-primary">{stats.attendance_percentage}%</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Overall presence rate</p>
                    </div>
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Enrolled Subjects</p>
                        <p className="mt-1 text-3xl font-bold">{stats.enrolled_subjects_count}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Active curriculum courses</p>
                    </div>
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Paid Fees</p>
                        <p className="mt-1 text-3xl font-bold text-green-600">৳{stats.total_paid.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Cleared invoices</p>
                    </div>
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Pending Due</p>
                        <p className="mt-1 text-3xl font-bold text-red-600 font-mono">৳{stats.total_due.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Payable balance</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Today's Classes */}
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border lg:col-span-2">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Today's Scheduled Classes ({todaySchedules.length})
                            </h2>
                            <Button variant="ghost" size="sm" asChild className="text-xs">
                                <Link href="/student/routine">Full Weekly Routine</Link>
                            </Button>
                        </div>
                        <div className="divide-y text-sm">
                            {todaySchedules.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-xs">
                                    No classes scheduled for today. Enjoy your study time!
                                </div>
                            ) : (
                                todaySchedules.map((sch) => (
                                    <div key={sch.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                                        <div className="space-y-1">
                                            <div className="font-semibold text-base">{sch.class_subject?.subject?.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-3">
                                                <span>Instructor: {sch.teacher?.user?.name || 'Faculty Staff'}</span>
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

                    {/* Quick Enrolled Subjects */}
                    <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 space-y-3">
                        <div className="border-b pb-2 flex items-center justify-between">
                            <h2 className="font-semibold text-sm flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                My Enrolled Subjects
                            </h2>
                            <Button variant="ghost" size="sm" asChild className="text-xs">
                                <Link href="/student/subjects">View All</Link>
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {student.student_subjects?.map((ss) => (
                                <div key={ss.id} className="p-2.5 rounded-lg border bg-muted/20 flex items-center justify-between">
                                    <span className="font-medium text-xs">{ss.class_subject?.subject?.name}</span>
                                    <span className="font-mono text-xs text-muted-foreground">
                                        {ss.class_subject?.subject?.code || '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StudentDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/student/dashboard' }],
};

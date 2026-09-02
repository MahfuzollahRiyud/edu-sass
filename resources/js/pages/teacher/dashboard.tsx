import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, CalendarDays, CheckCircle, Clock, MapPin, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Schedule, SharedData, Teacher } from '@/types';

type Props = {
    teacher: Teacher;
    todaySchedules: Schedule[];
    stats: {
        assigned_subjects_count: number;
        today_classes_count: number;
        attendance_taken_count: number;
    };
    todayDate: string;
};

export default function TeacherDashboard({ teacher, todaySchedules, stats, todayDate }: Props) {
    const { tenant } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Teacher Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back, {teacher.user?.name}
                        </h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {todayDate} • {tenant?.name || 'Coaching Center'} Faculty Portal
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/teacher/attendance">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Take Today's Attendance
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assigned Classes</p>
                        <p className="mt-1 text-3xl font-bold">{stats.assigned_subjects_count}</p>
                        <p className="text-xs text-muted-foreground mt-1">Class-Subject assignments</p>
                    </div>
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Today's Class Periods</p>
                        <p className="mt-1 text-3xl font-bold text-primary">{stats.today_classes_count}</p>
                        <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
                    </div>
                    <div className="bg-card border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attendance Taken</p>
                        <p className="mt-1 text-3xl font-bold text-green-600">{stats.attendance_taken_count}</p>
                        <p className="text-xs text-muted-foreground mt-1">Sessions recorded today</p>
                    </div>
                </div>

                {/* Today's Classes List */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Today's Class Schedule ({todaySchedules.length})
                        </h2>
                        <Button variant="ghost" size="sm" asChild className="text-xs">
                            <Link href="/teacher/schedule">View Full Weekly Routine</Link>
                        </Button>
                    </div>
                    <div className="divide-y text-sm">
                        {todaySchedules.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs">
                                You have no classes scheduled for today. Have a great day!
                            </div>
                        ) : (
                            todaySchedules.map((sch) => (
                                <div key={sch.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30">
                                    <div className="space-y-1">
                                        <div className="font-bold text-base">
                                            {sch.class_subject?.academic_class?.name}: {sch.class_subject?.subject?.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                                            <span className="flex items-center gap-1 font-mono">
                                                <Clock className="h-3.5 w-3.5" />
                                                {sch.time_slot?.start_time.substring(0, 5)} - {sch.time_slot?.end_time.substring(0, 5)}
                                            </span>
                                            {sch.room && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {sch.room}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/teacher/attendance?schedule_id=${sch.id}`}>
                                            Mark Attendance
                                        </Link>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

TeacherDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/teacher/dashboard' }],
};

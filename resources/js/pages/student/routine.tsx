import { Head } from '@inertiajs/react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import type { Schedule, Student } from '@/types';

type Props = {
    schedules: Schedule[];
    days: Record<number, string>;
    student: Student;
};

export default function StudentRoutine({ schedules, days, student }: Props) {
    const schedulesByDay: Record<number, Schedule[]> = {};
    for (let i = 0; i <= 6; i++) {
        schedulesByDay[i] = [];
    }
    schedules.forEach((sch) => {
        if (schedulesByDay[sch.day_of_week]) {
            schedulesByDay[sch.day_of_week].push(sch);
        }
    });

    return (
        <>
            <Head title="Class Routine" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">My Weekly Class Routine</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Class schedule and timetable for {student.academic_class?.name}.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(days).map(([numStr, dayName]) => {
                        const dayNum = parseInt(numStr);
                        const daySchedules = schedulesByDay[dayNum] || [];

                        return (
                            <div key={dayNum} className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4 space-y-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h2 className="font-semibold text-base">{dayName}</h2>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {daySchedules.length} {daySchedules.length === 1 ? 'period' : 'periods'}
                                    </span>
                                </div>

                                {daySchedules.length === 0 ? (
                                    <p className="text-muted-foreground text-xs italic py-4 text-center">
                                        No classes scheduled
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {daySchedules.map((sch) => (
                                            <div key={sch.id} className="p-3 rounded-lg border bg-muted/20 space-y-1">
                                                <div className="font-semibold text-sm">
                                                    {sch.class_subject?.subject?.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                                                    <Clock className="h-3 w-3" />
                                                    {sch.time_slot?.start_time.substring(0, 5)} - {sch.time_slot?.end_time.substring(0, 5)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Teacher: {sch.teacher?.user?.name || 'Assigned Staff'}
                                                </div>
                                                {sch.room && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        Room: {sch.room}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

StudentRoutine.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Routine', href: '/student/routine' },
    ],
};

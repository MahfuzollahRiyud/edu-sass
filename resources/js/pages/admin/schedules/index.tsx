import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Clock, Plus, Trash2, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass, PaginatedData, Schedule, Teacher, TimeSlot } from '@/types';
import { useState } from 'react';

type Props = {
    schedules: PaginatedData<Schedule>;
    classes: AcademicClass[];
    teachers: Teacher[];
    timeSlots: TimeSlot[];
    days: Record<number, string>;
    filters: {
        class_id?: string;
        teacher_id?: string;
        day_of_week?: string;
    };
};

export default function SchedulesIndex({ schedules, classes, teachers, timeSlots, days, filters }: Props) {
    const [classId, setClassId] = useState(filters.class_id || '');
    const [teacherId, setTeacherId] = useState(filters.teacher_id || '');
    const [dayOfWeek, setDayOfWeek] = useState(filters.day_of_week || '');

    function applyFilter(newClassId = classId, newTeacherId = teacherId, newDay = dayOfWeek) {
        router.get(
            '/admin/schedules',
            { class_id: newClassId, teacher_id: newTeacherId, day_of_week: newDay },
            { preserveState: true }
        );
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this class schedule?')) {
            router.delete(`/admin/schedules/${id}`);
        }
    }

    return (
        <>
            <Head title="Class Schedule & Routine" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Class Routine & Schedules</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage weekly class schedules, periods, and teacher assignments.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/schedules/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Schedule
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={dayOfWeek}
                        onChange={(e) => {
                            setDayOfWeek(e.target.value);
                            applyFilter(classId, teacherId, e.target.value);
                        }}
                    >
                        <option value="">All Days of Week</option>
                        {Object.entries(days).map(([num, name]) => (
                            <option key={num} value={num}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value);
                            applyFilter(e.target.value, teacherId, dayOfWeek);
                        }}
                    >
                        <option value="">All Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `(${cls.section})` : ''}
                            </option>
                        ))}
                    </select>

                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={teacherId}
                        onChange={(e) => {
                            setTeacherId(e.target.value);
                            applyFilter(classId, e.target.value, dayOfWeek);
                        }}
                    >
                        <option value="">All Teachers</option>
                        {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.user?.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Schedules Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Day</th>
                                    <th className="px-4 py-3 text-left font-medium">Time Slot</th>
                                    <th className="px-4 py-3 text-left font-medium">Class & Section</th>
                                    <th className="px-4 py-3 text-left font-medium">Subject</th>
                                    <th className="px-4 py-3 text-left font-medium">Teacher</th>
                                    <th className="px-4 py-3 text-left font-medium">Room</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-4 py-12 text-center">
                                            <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No class routines found for the selected filter.</p>
                                        </td>
                                    </tr>
                                )}
                                {schedules.data.map((sch) => (
                                    <tr key={sch.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-semibold text-xs">
                                            <span className="inline-flex rounded-md bg-primary/10 text-primary px-2.5 py-1">
                                                {days[sch.day_of_week]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 font-mono text-xs">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {sch.time_slot?.start_time.substring(0, 5)} - {sch.time_slot?.end_time.substring(0, 5)}
                                            </div>
                                            {sch.time_slot?.label && (
                                                <div className="text-muted-foreground text-xs">{sch.time_slot.label}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {sch.class_subject?.academic_class?.name}{' '}
                                            {sch.class_subject?.academic_class?.section && (
                                                <span className="text-muted-foreground text-xs font-normal">
                                                    ({sch.class_subject.academic_class.section})
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                                                {sch.class_subject?.subject?.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-xs">{sch.teacher?.user?.name}</div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {sch.room || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/schedules/${sch.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(sch.id)}
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

SchedulesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Schedules', href: '/admin/schedules' },
    ],
};

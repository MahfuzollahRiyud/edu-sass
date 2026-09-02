import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, UserCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AcademicClass, Attendance, PaginatedData } from '@/types';
import { useState } from 'react';

type Props = {
    attendances: PaginatedData<Attendance>;
    classes: AcademicClass[];
    filters: {
        date?: string;
        class_id?: string;
    };
    summary: {
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
    };
};

export default function AdminAttendanceIndex({ attendances, classes, filters, summary }: Props) {
    const [date, setDate] = useState(filters.date || new Date().toISOString().split('T')[0]);
    const [classId, setClassId] = useState(filters.class_id || '');

    function handleFilter(newDate = date, newClassId = classId) {
        router.get('/admin/attendance', { date: newDate, class_id: newClassId }, { preserveState: true });
    }

    return (
        <>
            <Head title="Attendance Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Daily Attendance Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Monitor attendance status and percentage rates across all classes.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="space-y-1 sm:w-48">
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                handleFilter(e.target.value, classId);
                            }}
                        />
                    </div>

                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm sm:w-56"
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value);
                            handleFilter(date, e.target.value);
                        }}
                    >
                        <option value="">All Academic Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `(${cls.section})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Marked Sessions</p>
                        <p className="mt-1 text-2xl font-bold">{summary.total}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Present</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">{summary.present}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Absent</p>
                        <p className="mt-1 text-2xl font-bold text-red-600">{summary.absent}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Late</p>
                        <p className="mt-1 text-2xl font-bold text-amber-600">{summary.late}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase">Attendance Rate</p>
                        <p className="mt-1 text-2xl font-bold text-primary">{summary.percentage}%</p>
                    </div>
                </div>

                {/* Attendance Records Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Student</th>
                                    <th className="px-4 py-3 text-left font-medium">Class</th>
                                    <th className="px-4 py-3 text-left font-medium">Subject & Period</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Marked By</th>
                                    <th className="px-4 py-3 text-left font-medium">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            <UserCheck className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No attendance records found for this date.</p>
                                        </td>
                                    </tr>
                                )}
                                {attendances.data.map((att) => (
                                    <tr key={att.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{att.student?.user?.name}</div>
                                            <div className="text-muted-foreground text-xs font-mono">{att.student?.student_id}</div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {att.student?.academic_class?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-xs">
                                                {att.schedule?.class_subject?.subject?.name}
                                            </div>
                                            <div className="text-muted-foreground text-xs font-mono">
                                                {att.schedule?.time_slot?.start_time.substring(0, 5)} - {att.schedule?.time_slot?.end_time.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    att.status === 'present'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : att.status === 'absent'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}
                                            >
                                                {att.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {att.marker?.name}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {att.remarks || '—'}
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

AdminAttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Attendance', href: '/admin/attendance' },
    ],
};

import { Head } from '@inertiajs/react';
import { CheckCircle2, UserCheck, XCircle } from 'lucide-react';
import type { Attendance, PaginatedData } from '@/types';

type Props = {
    attendances: PaginatedData<Attendance>;
    summary: {
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
    };
};

export default function StudentAttendance({ attendances, summary }: Props) {
    return (
        <>
            <Head title="My Attendance Records" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">My Attendance History</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Track your daily attendance percentage and historical session logs.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attendance Rate</p>
                        <p className="mt-1 text-3xl font-bold text-primary">{summary.percentage}%</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Present Days</p>
                        <p className="mt-1 text-3xl font-bold text-green-600">{summary.present}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Absent Days</p>
                        <p className="mt-1 text-3xl font-bold text-red-600">{summary.absent}</p>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Recorded</p>
                        <p className="mt-1 text-3xl font-bold">{summary.total}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-left font-medium">Subject</th>
                                    <th className="px-4 py-3 text-left font-medium">Time Slot</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center">
                                            <UserCheck className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No attendance records logged yet.</p>
                                        </td>
                                    </tr>
                                )}
                                {attendances.data.map((att) => (
                                    <tr key={att.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">
                                            {att.attendance_date}
                                        </td>
                                        <td className="px-4 py-3">
                                            {att.schedule?.class_subject?.subject?.name}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                            {att.schedule?.time_slot?.start_time.substring(0, 5)} - {att.schedule?.time_slot?.end_time.substring(0, 5)}
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

StudentAttendance.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Attendance', href: '/student/attendance' },
    ],
};

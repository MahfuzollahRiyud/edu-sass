import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, UserCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Attendance, Schedule, Student } from '@/types';
import { useState, type FormEvent } from 'react';

type Props = {
    schedules: Schedule[];
    selectedSchedule: Schedule | null;
    students: Student[];
    existingAttendances: Record<number, Attendance>;
    date: string;
    days: Record<number, string>;
};

export default function TeacherAttendanceIndex({
    schedules,
    selectedSchedule,
    students,
    existingAttendances,
    date,
    days,
}: Props) {
    const [currentDate, setCurrentDate] = useState(date);
    const [selectedScheduleId, setSelectedScheduleId] = useState(selectedSchedule?.id ? String(selectedSchedule.id) : '');

    // State for student attendance map: student_id -> { status, remarks }
    const [attendanceMap, setAttendanceMap] = useState<Record<number, { status: 'present' | 'absent' | 'late'; remarks: string }>>(() => {
        const initial: Record<number, { status: 'present' | 'absent' | 'late'; remarks: string }> = {};
        students.forEach((s) => {
            const existing = existingAttendances[s.id];
            initial[s.id] = {
                status: existing ? existing.status : 'present',
                remarks: existing?.remarks ?? '',
            };
        });
        return initial;
    });

    function handlePeriodChange(newScheduleId: string, newDate = currentDate) {
        setSelectedScheduleId(newScheduleId);
        router.get('/teacher/attendance', { schedule_id: newScheduleId, date: newDate }, { preserveState: true });
    }

    function setStatus(studentId: number, status: 'present' | 'absent' | 'late') {
        setAttendanceMap((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status,
            },
        }));
    }

    function setRemarks(studentId: number, remarks: string) {
        setAttendanceMap((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks,
            },
        }));
    }

    function markAll(status: 'present' | 'absent') {
        setAttendanceMap((prev) => {
            const updated = { ...prev };
            students.forEach((s) => {
                updated[s.id] = {
                    ...updated[s.id],
                    status,
                };
            });
            return updated;
        });
    }

    const { post, processing } = useForm();

    function handleSave(e: FormEvent) {
        e.preventDefault();
        if (!selectedSchedule) return;

        const attendances = students.map((s) => ({
            student_id: s.id,
            status: attendanceMap[s.id]?.status ?? 'present',
            remarks: attendanceMap[s.id]?.remarks ?? '',
        }));

        router.post('/teacher/attendance', {
            schedule_id: selectedSchedule.id,
            attendance_date: currentDate,
            attendances,
        });
    }

    return (
        <>
            <Head title="Take Attendance" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Take Class Attendance</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Select an assigned class period and record student attendance.
                    </p>
                </div>

                {/* Schedule Selector */}
                <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="sm:w-48">
                        <Input
                            type="date"
                            value={currentDate}
                            onChange={(e) => {
                                setCurrentDate(e.target.value);
                                handlePeriodChange(selectedScheduleId, e.target.value);
                            }}
                        />
                    </div>

                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm flex-1"
                        value={selectedScheduleId}
                        onChange={(e) => handlePeriodChange(e.target.value, currentDate)}
                    >
                        {schedules.length === 0 && <option value="">No classes assigned to you</option>}
                        {schedules.map((sch) => (
                            <option key={sch.id} value={sch.id}>
                                {days[sch.day_of_week]} ({sch.time_slot?.start_time.substring(0, 5)} - {sch.time_slot?.end_time.substring(0, 5)}) —{' '}
                                {sch.class_subject?.academic_class?.name}: {sch.class_subject?.subject?.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Attendance Marking Table */}
                {selectedSchedule && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                                Enrolled Students ({students.length})
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => markAll('present')}>
                                    Mark All Present
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => markAll('absent')}>
                                    Mark All Absent
                                </Button>
                            </div>
                        </div>

                        <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="px-4 py-3 text-left font-medium">ID</th>
                                            <th className="px-4 py-3 text-left font-medium">Student Name</th>
                                            <th className="px-4 py-3 text-center font-medium">Status</th>
                                            <th className="px-4 py-3 text-left font-medium">Remarks (Optional)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-muted-foreground px-4 py-12 text-center">
                                                    <UserCheck className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                                    <p>No students enrolled in this class subject yet.</p>
                                                </td>
                                            </tr>
                                        )}
                                        {students.map((stu) => {
                                            const currentStatus = attendanceMap[stu.id]?.status ?? 'present';
                                            return (
                                                <tr key={stu.id} className="border-b last:border-b-0 hover:bg-muted/50">
                                                    <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                                                        {stu.student_id}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">
                                                        {stu.user?.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="inline-flex items-center rounded-lg border p-0.5 bg-background">
                                                            <button
                                                                type="button"
                                                                onClick={() => setStatus(stu.id, 'present')}
                                                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                    currentStatus === 'present'
                                                                        ? 'bg-green-600 text-white font-bold'
                                                                        : 'text-muted-foreground hover:bg-muted'
                                                                }`}
                                                            >
                                                                Present
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setStatus(stu.id, 'absent')}
                                                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                    currentStatus === 'absent'
                                                                        ? 'bg-red-600 text-white font-bold'
                                                                        : 'text-muted-foreground hover:bg-muted'
                                                                }`}
                                                            >
                                                                Absent
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setStatus(stu.id, 'late')}
                                                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                    currentStatus === 'late'
                                                                        ? 'bg-amber-600 text-white font-bold'
                                                                        : 'text-muted-foreground hover:bg-muted'
                                                                }`}
                                                            >
                                                                Late
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            type="text"
                                                            placeholder="Note / reason"
                                                            className="h-8 text-xs max-w-xs"
                                                            value={attendanceMap[stu.id]?.remarks ?? ''}
                                                            onChange={(e) => setRemarks(stu.id, e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {students.length > 0 && (
                            <div className="flex justify-end pt-2">
                                <Button type="submit" size="lg" disabled={processing}>
                                    Save Attendance Record
                                </Button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </>
    );
}

TeacherAttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/teacher/dashboard' },
        { title: 'Attendance', href: '/teacher/attendance' },
    ],
};

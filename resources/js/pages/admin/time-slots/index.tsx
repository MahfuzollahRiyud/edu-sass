import { Head, Link, router } from '@inertiajs/react';
import { Clock, Plus, Power, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginatedData, TimeSlot } from '@/types';

type Props = {
    timeSlots: PaginatedData<TimeSlot>;
};

export default function TimeSlotsIndex({ timeSlots }: Props) {
    return (
        <>
            <Head title="Time Slots" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Time Slots</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage class timing periods (e.g. 04:00 PM – 05:00 PM).
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/time-slots/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Time Slot
                        </Link>
                    </Button>
                </div>

                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Slot Label</th>
                                    <th className="px-4 py-3 text-left font-medium">Start Time</th>
                                    <th className="px-4 py-3 text-left font-medium">End Time</th>
                                    <th className="px-4 py-3 text-center font-medium">Schedules Assigned</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            <Clock className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No time slots created yet. Add your coaching center's periods.</p>
                                        </td>
                                    </tr>
                                )}
                                {timeSlots.data.map((ts) => (
                                    <tr key={ts.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">
                                            {ts.label || 'Standard Period'}
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {ts.start_time}
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {ts.end_time}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                                                {ts.schedules_count ?? 0} Classes
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    ts.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {ts.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/time-slots/${ts.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(`/admin/time-slots/${ts.id}/toggle-status`)}
                                                    title={ts.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    <Power className="h-4 w-4" />
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

TimeSlotsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Time Slots', href: '/admin/time-slots' },
    ],
};

import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Teacher, TimeSlot } from '@/types';
import type { FormEvent } from 'react';

type Props = {
    classSubjects: { id: number; name: string }[];
    teachers: Teacher[];
    timeSlots: TimeSlot[];
    days: Record<number, string>;
};

export default function ScheduleCreate({ classSubjects, teachers, timeSlots, days }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        class_subject_id: classSubjects[0]?.id ? String(classSubjects[0].id) : '',
        teacher_id: teachers[0]?.id ? String(teachers[0].id) : '',
        time_slot_id: timeSlots[0]?.id ? String(timeSlots[0].id) : '',
        day_of_week: '0',
        room: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/schedules');
    }

    return (
        <>
            <Head title="Create Schedule" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Class Schedule</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Schedule a subject with a teacher and time slot. Conflicts will be automatically detected.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="day_of_week">Day of the Week *</Label>
                        <select
                            id="day_of_week"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={data.day_of_week}
                            onChange={(e) => setData('day_of_week', e.target.value)}
                            required
                        >
                            {Object.entries(days).map(([num, name]) => (
                                <option key={num} value={num}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.day_of_week} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time_slot_id">Time Slot *</Label>
                        <select
                            id="time_slot_id"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={data.time_slot_id}
                            onChange={(e) => setData('time_slot_id', e.target.value)}
                            required
                        >
                            {timeSlots.map((ts) => (
                                <option key={ts.id} value={ts.id}>
                                    {ts.label ? `${ts.label} (${ts.start_time} - ${ts.end_time})` : `${ts.start_time} - ${ts.end_time}`}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.time_slot_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="class_subject_id">Class & Subject *</Label>
                        <select
                            id="class_subject_id"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={data.class_subject_id}
                            onChange={(e) => setData('class_subject_id', e.target.value)}
                            required
                        >
                            {classSubjects.map((cs) => (
                                <option key={cs.id} value={cs.id}>
                                    {cs.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.class_subject_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teacher_id">Assigned Teacher *</Label>
                        <select
                            id="teacher_id"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={data.teacher_id}
                            onChange={(e) => setData('teacher_id', e.target.value)}
                            required
                        >
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.user?.name} {t.designation ? `(${t.designation})` : ''}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.teacher_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="room">Room / Classroom (Optional)</Label>
                        <Input
                            id="room"
                            value={data.room}
                            onChange={(e) => setData('room', e.target.value)}
                            placeholder="e.g. Room 204, Lab 2"
                        />
                        <InputError message={errors.room} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Schedule'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/schedules">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ScheduleCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Schedules', href: '/admin/schedules' },
        { title: 'Add Schedule', href: '/admin/schedules/create' },
    ],
};

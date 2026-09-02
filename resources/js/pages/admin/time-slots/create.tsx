import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

export default function TimeSlotCreate() {
    const { data, setData, post, processing, errors } = useForm({
        label: '',
        start_time: '16:00',
        end_time: '17:00',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/time-slots');
    }

    return (
        <>
            <Head title="Create Time Slot" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Time Slot</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Define class start and end times for schedule routine creation.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="label">Slot Label / Period (Optional)</Label>
                        <Input
                            id="label"
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            placeholder="e.g. Afternoon Slot 1, Evening Period"
                        />
                        <InputError message={errors.label} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time (24h) *</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                required
                            />
                            <InputError message={errors.start_time} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time (24h) *</Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                required
                            />
                            <InputError message={errors.end_time} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Create Time Slot'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/time-slots">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TimeSlotCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Time Slots', href: '/admin/time-slots' },
        { title: 'Add Time Slot', href: '/admin/time-slots/create' },
    ],
};

import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Plus, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginatedData, Subject } from '@/types';

type Props = {
    subjects: PaginatedData<Subject>;
};

export default function SubjectsIndex({ subjects }: Props) {
    return (
        <>
            <Head title="Subjects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage curriculum subjects (e.g. Physics, Math, English).
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/subjects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subject
                        </Link>
                    </Button>
                </div>

                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Subject Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Code</th>
                                    <th className="px-4 py-3 text-center font-medium">Classes Taught In</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center">
                                            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No subjects created yet.</p>
                                        </td>
                                    </tr>
                                )}
                                {subjects.data.map((subj) => (
                                    <tr key={subj.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">{subj.name}</td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {subj.code || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium">
                                                {subj.classes_count ?? 0} Classes
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    subj.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {subj.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/subjects/${subj.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(`/admin/subjects/${subj.id}/toggle-status`)}
                                                    title={subj.is_active ? 'Deactivate' : 'Activate'}
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

SubjectsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Subjects', href: '/admin/subjects' },
    ],
};

import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, GraduationCap, Plus, Power, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AcademicClass, PaginatedData } from '@/types';

type Props = {
    classes: PaginatedData<AcademicClass>;
};

export default function ClassesIndex({ classes }: Props) {
    return (
        <>
            <Head title="Academic Classes" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Academic Classes</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage classes, sections, and subject assignments.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/classes/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Class
                        </Link>
                    </Button>
                </div>

                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Class Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Section / Batch</th>
                                    <th className="px-4 py-3 text-center font-medium">Enrolled Students</th>
                                    <th className="px-4 py-3 text-center font-medium">Assigned Subjects</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            <GraduationCap className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No classes created yet. Add your first class.</p>
                                        </td>
                                    </tr>
                                )}
                                {classes.data.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium">{cls.name}</td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {cls.section || 'General'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {cls.students_count ?? 0} Students
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                {cls.subjects_count ?? 0} Subjects
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    cls.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {cls.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild title="Manage Subjects">
                                                    <Link href={`/admin/classes/${cls.id}/subjects`}>
                                                        <BookOpen className="mr-1 h-3.5 w-3.5" />
                                                        Subjects
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/classes/${cls.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(`/admin/classes/${cls.id}/toggle-status`)}
                                                    title={cls.is_active ? 'Deactivate' : 'Activate'}
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

ClassesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
    ],
};

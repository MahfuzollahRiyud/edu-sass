import { Head, Link, router } from '@inertiajs/react';
import { LogIn, Mail, Phone, Plus, Power, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginatedData, Teacher } from '@/types';

type Props = {
    teachers: PaginatedData<Teacher>;
};

export default function TeachersIndex({ teachers }: Props) {
    return (
        <>
            <Head title="Teachers" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Teachers Directory</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage teaching staff and their subject assignments.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/teachers/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Teacher
                        </Link>
                    </Button>
                </div>

                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Teacher</th>
                                    <th className="px-4 py-3 text-left font-medium">Contact</th>
                                    <th className="px-4 py-3 text-left font-medium">Designation</th>
                                    <th className="px-4 py-3 text-left font-medium">Assigned Classes & Subjects</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center">
                                            <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No teachers registered yet. Add your first teacher account.</p>
                                        </td>
                                    </tr>
                                )}
                                {teachers.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{t.user?.name}</div>
                                            <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                                <Mail className="h-3 w-3" />
                                                {t.user?.email}
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {t.phone ? (
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Phone className="h-3 w-3" />
                                                    {t.phone}
                                                </div>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {t.designation || 'Instructor'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {t.class_subjects && t.class_subjects.length > 0 ? (
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {t.class_subjects.map((cs) => (
                                                        <span
                                                            key={cs.id}
                                                            className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                                                        >
                                                            {cs.academic_class?.name}: {cs.subject?.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">No subjects assigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    t.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {t.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-1 text-xs text-primary border-primary/30 hover:bg-primary/10"
                                                    onClick={() => router.post(`/impersonate/${t.user_id}`)}
                                                    title="Login as Teacher"
                                                >
                                                    <LogIn className="h-3.5 w-3.5" />
                                                    <span>Login As</span>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/teachers/${t.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(`/admin/teachers/${t.id}/toggle-status`)}
                                                    title={t.is_active ? 'Deactivate' : 'Activate'}
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

TeachersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Teachers', href: '/admin/teachers' },
    ],
};

import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, GraduationCap, LogIn, Plus, Power, Printer, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PrintHeader, PrintSignatureFooter } from '@/components/print-header';
import type { AcademicClass, PaginatedData, Student } from '@/types';
import { useState } from 'react';

type Props = {
    students: PaginatedData<Student>;
    classes: AcademicClass[];
    filters: {
        search?: string;
        class_id?: string;
    };
};

export default function StudentsIndex({ students, classes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [classId, setClassId] = useState(filters.class_id || '');
    const { auth } = usePage<any>().props;

    const selectedClass = classes.find((c) => String(c.id) === String(classId));

    function handleFilter(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/students', { search, class_id: classId }, { preserveState: true });
    }

    return (
        <>
            <Head title="Students Directory" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Students Directory</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage student admissions, profiles, and subject enrollments.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Print / PDF Directory
                        </Button>
                        <Button asChild>
                            <Link href="/admin/students/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Admission
                            </Link>
                        </Button>
                    </div>
                </div>

                <PrintHeader
                    institutionName={auth?.tenant?.name || 'Coaching Center'}
                    reportTitle="Official Students Directory & Enrollment List"
                    subTitle={selectedClass ? `Academic Class: ${selectedClass.name} ${selectedClass.section ? `(${selectedClass.section})` : ''}` : 'All Classes & Batches'}
                    metaInfo={[
                        { label: 'Total Students', value: students.data.length },
                        { label: 'Class Filter', value: selectedClass ? selectedClass.name : 'ALL' },
                    ]}
                />

                {/* Filters */}
                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border print:hidden">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by student name, ID, phone, or email..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-56"
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value);
                            router.get('/admin/students', { search, class_id: e.target.value }, { preserveState: true });
                        }}
                    >
                        <option value="">All Academic Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `(${cls.section})` : ''}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" variant="secondary">
                        Filter
                    </Button>
                </form>

                {/* Students Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left font-medium">Student ID</th>
                                    <th className="px-4 py-3 text-left font-medium">Student Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Class</th>
                                    <th className="px-4 py-3 text-left font-medium">Contact & Guardian</th>
                                    <th className="px-4 py-3 text-right font-medium">Monthly Fee</th>
                                    <th className="px-4 py-3 text-center font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium print:hidden">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-4 py-12 text-center">
                                            <GraduationCap className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p>No students found. Admit your first student.</p>
                                        </td>
                                    </tr>
                                )}
                                {students.data.map((stu) => (
                                    <tr key={stu.id} className="hover:bg-muted/50 border-b last:border-b-0">
                                        <td className="px-4 py-3 font-mono font-semibold text-xs text-primary">
                                            {stu.student_id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{stu.user?.name}</div>
                                            <div className="text-muted-foreground text-xs">{stu.user?.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                                                {stu.academic_class?.name} {stu.academic_class?.section ? `(${stu.academic_class.section})` : ''}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {stu.phone && <div>📞 {stu.phone}</div>}
                                            {stu.guardian_name && <div>👤 {stu.guardian_name}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            ৳{Number(stu.monthly_fee).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    stu.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {stu.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right print:hidden">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-1 text-xs text-primary border-primary/30 hover:bg-primary/10"
                                                    onClick={() => router.post(`/impersonate/${stu.user_id}`)}
                                                    title="Login as Student Portal"
                                                >
                                                    <LogIn className="h-3.5 w-3.5" />
                                                    <span>Login As</span>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild title="View Profile">
                                                    <Link href={`/admin/students/${stu.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild title="Edit Student">
                                                    <Link href={`/admin/students/${stu.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.patch(`/admin/students/${stu.id}/toggle-status`)}
                                                    title={stu.is_active ? 'Deactivate' : 'Activate'}
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

                <PrintSignatureFooter />
            </div>
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Students', href: '/admin/students' },
    ],
};

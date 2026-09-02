import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, Mail, Phone, Printer, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrintHeader, PrintSignatureFooter } from '@/components/print-header';
import TeacherLayout from '@/layouts/teacher-layout';
import type { ClassSubject, Student } from '@/types';
import { useState } from 'react';

type Props = {
    assignedClassSubjects: ClassSubject[];
    selectedClassSubject: ClassSubject | null;
    students: Student[];
    filters: {
        class_subject_id?: number | string;
    };
};

export default function TeacherStudentsIndex({
    assignedClassSubjects,
    selectedClassSubject,
    students,
    filters,
}: Props) {
    const { auth } = usePage<any>().props;
    const [selectedId, setSelectedId] = useState(
        String(filters.class_subject_id || assignedClassSubjects[0]?.id || '')
    );
    const [sheetMode, setSheetMode] = useState<'roster' | 'attendance'>('roster');

    const handleSelectClassSubject = (id: string) => {
        setSelectedId(id);
        router.get('/teacher/students', { class_subject_id: id }, { preserveState: true });
    };

    return (
        <TeacherLayout>
            <Head title="My Students List" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">My Students List</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            View and print official class rosters and blank attendance sheets for your assigned subjects.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                        <Button
                            variant={sheetMode === 'roster' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSheetMode('roster')}
                        >
                            Class Roster
                        </Button>
                        <Button
                            variant={sheetMode === 'attendance' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSheetMode('attendance')}
                        >
                            Attendance Sheet
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Print / Save PDF
                        </Button>
                    </div>
                </div>

                <PrintHeader
                    institutionName={auth?.tenant?.name || 'Coaching Center'}
                    reportTitle={sheetMode === 'roster' ? 'Class Student Roster' : 'Blank Class Attendance Sheet'}
                    subTitle={
                        selectedClassSubject
                            ? `Class: ${selectedClassSubject.academic_class?.name} (${selectedClassSubject.academic_class?.section || 'All'}) | Subject: ${selectedClassSubject.subject?.name}`
                            : 'All Enrolled Students'
                    }
                    metaInfo={[
                        { label: 'Instructor', value: auth?.user?.name || 'Teacher' },
                        { label: 'Total Students', value: students.length },
                    ]}
                />

                {/* Class / Subject Selection Buttons */}
                <div className="flex flex-wrap gap-2 print:hidden bg-card p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <span className="text-sm font-medium self-center mr-2 text-muted-foreground">Select Class & Subject:</span>
                    {assignedClassSubjects.map((cs) => {
                        const active = String(cs.id) === String(selectedId);
                        return (
                            <button
                                key={cs.id}
                                onClick={() => handleSelectClassSubject(String(cs.id))}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                    active
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                }`}
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>
                                    {cs.academic_class?.name} - {cs.subject?.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Students Table */}
                <div className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-slate-800 dark:text-slate-200">
                                    <th className="px-4 py-3 text-left font-semibold w-16">#</th>
                                    <th className="px-4 py-3 text-left font-semibold">Student ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                                    {sheetMode === 'roster' ? (
                                        <>
                                            <th className="px-4 py-3 text-left font-semibold">Class / Section</th>
                                            <th className="px-4 py-3 text-left font-semibold">Contact</th>
                                            <th className="px-4 py-3 text-left font-semibold">Guardian Info</th>
                                        </>
                                    ) : (
                                        <>
                                            {/* 6 Blank Columns for physical date marking during class */}
                                            <th className="px-2 py-3 text-center border-l font-semibold w-16 text-xs">Date: ___</th>
                                            <th className="px-2 py-3 text-center border-l font-semibold w-16 text-xs">Date: ___</th>
                                            <th className="px-2 py-3 text-center border-l font-semibold w-16 text-xs">Date: ___</th>
                                            <th className="px-2 py-3 text-center border-l font-semibold w-16 text-xs">Date: ___</th>
                                            <th className="px-2 py-3 text-center border-l font-semibold w-16 text-xs">Date: ___</th>
                                            <th className="px-2 py-3 text-center border-l font-semibold w-16 text-xs">Date: ___</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={sheetMode === 'roster' ? 6 : 9} className="text-muted-foreground px-4 py-12 text-center">
                                            <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p className="font-medium text-foreground">No students enrolled in this class/subject yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, idx) => (
                                        <tr key={student.id} className="border-b last:border-b-0 hover:bg-muted/40">
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{idx + 1}</td>
                                            <td className="px-4 py-3 font-mono font-semibold text-xs text-primary">
                                                {student.student_id}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                <div>{student.user?.name}</div>
                                                <div className="text-xs text-muted-foreground print:hidden">{student.user?.email}</div>
                                            </td>
                                            {sheetMode === 'roster' ? (
                                                <>
                                                    <td className="px-4 py-3 text-xs">
                                                        {student.academic_class?.name} {student.academic_class?.section ? `(${student.academic_class.section})` : ''}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                                        {student.phone ? `📞 ${student.phone}` : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                                        {student.guardian_name ? `${student.guardian_name} (${student.guardian_phone || ''})` : '—'}
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-2 py-3 border-l text-center text-xs h-9"></td>
                                                    <td className="px-2 py-3 border-l text-center text-xs h-9"></td>
                                                    <td className="px-2 py-3 border-l text-center text-xs h-9"></td>
                                                    <td className="px-2 py-3 border-l text-center text-xs h-9"></td>
                                                    <td className="px-2 py-3 border-l text-center text-xs h-9"></td>
                                                    <td className="px-2 py-3 border-l text-center text-xs h-9"></td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PrintSignatureFooter />
            </div>
        </TeacherLayout>
    );
}

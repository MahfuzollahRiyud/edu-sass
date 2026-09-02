import { Head } from '@inertiajs/react';
import { BookOpen, GraduationCap, Mail, Phone, User } from 'lucide-react';
import type { Student } from '@/types';

type Props = {
    student: Student;
};

export default function StudentSubjects({ student }: Props) {
    return (
        <>
            <Head title="My Enrolled Subjects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">My Subjects & Teachers</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        All curriculum subjects enrolled in {student.academic_class?.name}{' '}
                        {student.academic_class?.section ? `(${student.academic_class.section})` : ''}.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {student.student_subjects?.map((ss) => {
                        const cs = ss.class_subject;
                        return (
                            <div key={ss.id} className="bg-card border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h2 className="font-bold text-lg">{cs?.subject?.name}</h2>
                                        {cs?.subject?.code && (
                                            <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                {cs.subject.code}
                                            </span>
                                        )}
                                    </div>
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>

                                <div className="border-t pt-3 space-y-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                        Assigned Instructors
                                    </span>
                                    {cs?.teachers && cs.teachers.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {cs.teachers.map((t) => (
                                                <div key={t.id} className="text-xs bg-muted/40 p-2 rounded-lg">
                                                    <div className="font-medium">{t.user?.name}</div>
                                                    {t.designation && (
                                                        <div className="text-muted-foreground">{t.designation}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">No teacher assigned yet</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

StudentSubjects.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'My Subjects', href: '/student/subjects' },
    ],
};

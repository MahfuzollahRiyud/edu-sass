import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Building2,
    CheckCircle,
    GraduationCap,
    LogIn,
    LogOut,
    PlusCircle,
    Shield,
    Sparkles,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome — Coaching & Education SaaS" />
            <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
                {/* Header */}
                <header className="border-b border-border/60 bg-background/95 backdrop-blur sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <GraduationCap className="size-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">EduSaaS Platform</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {auth?.user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                        Signed in as <strong className="text-foreground">{auth.user.name}</strong>
                                    </span>
                                    <Button size="sm" asChild>
                                        <Link href="/dashboard">
                                            Go to Dashboard
                                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href="/logout" method="post" as="button">
                                            <LogOut className="mr-1.5 h-3.5 w-3.5" />
                                            Log Out
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href="/login">
                                            <LogIn className="mr-1.5 h-3.5 w-3.5" />
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild className="gap-1.5 shadow-sm">
                                        <Link href="/register-institution">
                                            <Building2 className="h-3.5 w-3.5" />
                                            Register Institute
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-8 flex-1 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1 text-xs font-medium text-muted-foreground mx-auto shadow-sm">
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        Multi-Tenant Education & Coaching Management Platform
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
                        Streamline your Coaching Center operations in one place.
                    </h1>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                        Academic classes, student admissions, teacher routines, automated attendance, fee collection, and printable money receipts — fully isolated per coaching institute.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        {auth?.user ? (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="lg" asChild className="px-8 shadow-md">
                                    <Link href="/dashboard">
                                        Open My Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/logout" method="post" as="button">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log Out
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center justify-center gap-3.5">
                                <Button size="lg" asChild className="px-7 text-sm font-semibold shadow-lg">
                                    <Link href="/register-institution">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Register Coaching Center
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="px-7 text-sm font-semibold">
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In to Portal
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Role quick cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-12 text-left max-w-4xl mx-auto w-full">
                        <div className="border rounded-xl p-5 bg-card space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-sm">
                                <Shield className="h-4 w-4 text-primary" />
                                Super Admin
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Manage coaching centers, approve new registrations, and platform settings.
                            </p>
                        </div>

                        <div className="border rounded-xl p-5 bg-card space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-sm">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Coaching Admin
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Manage classes, admit students, assign teachers, and collect fees.
                            </p>
                        </div>

                        <div className="border rounded-xl p-5 bg-card space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-sm">
                                <Users className="h-4 w-4 text-primary" />
                                Teachers
                            </div>
                            <p className="text-xs text-muted-foreground">
                                View assigned weekly routines and take daily class attendance.
                            </p>
                        </div>

                        <div className="border rounded-xl p-5 bg-card space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-sm">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Students
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Access course timetable, attendance rate, fee balance, and receipts.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} EduSaaS. Multi-Tenant Education & Coaching Management System.
                </footer>
            </div>
        </>
    );
}

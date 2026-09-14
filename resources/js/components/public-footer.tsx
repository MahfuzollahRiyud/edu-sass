import { Link } from '@inertiajs/react';
import { Shield, Sparkles } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="border-t border-border/60 bg-muted/20 text-muted-foreground text-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/images/logo.webp"
                                alt="EduFlow"
                                className="size-8 object-contain rounded-lg shadow-xs border border-border/60 bg-white dark:bg-slate-900 p-0.5"
                            />
                            <span className="font-bold text-base text-foreground tracking-tight">EduFlow SaaS</span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                            A high-performance, multi-tenant academic and financial management platform purpose-built for coaching centers, academies, and private education institutions.
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                            <Shield className="h-3 w-3 text-primary" />
                            Tenant Data Isolation Guaranteed
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Navigation</h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/" className="hover:text-foreground transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-foreground transition-colors">
                                    About & How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/register-institution" className="hover:text-foreground transition-colors">
                                    Register Coaching Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-foreground transition-colors">
                                    Sign In to Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Portals */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Portals</h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <span className="text-foreground font-medium">Institution Admin</span>
                                <p className="text-[11px] text-muted-foreground">Admissions, Fees, Routines, Teachers</p>
                            </li>
                            <li>
                                <span className="text-foreground font-medium">Teacher Portal</span>
                                <p className="text-[11px] text-muted-foreground">Class Rosters, Attendance, Exams</p>
                            </li>
                            <li>
                                <span className="text-foreground font-medium">Student Portal</span>
                                <p className="text-[11px] text-muted-foreground">Weekly Timetable, Attendance, Fee Receipts</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} EduFlow SaaS. All rights reserved.</p>
                    <p className="text-[11px]">
                        Multi-Tenant Education & Coaching Management System.
                    </p>
                </div>
            </div>
        </footer>
    );
}

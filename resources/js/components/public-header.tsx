import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    LogIn,
    LogOut,
    Menu,
    X,
    Sparkles,
    Info,
    Home,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { SharedData } from '@/types';

interface PublicHeaderProps {
    currentPage?: 'home' | 'about';
}

export default function PublicHeader({ currentPage = 'home' }: PublicHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="border-b border-border/60 bg-background/95 backdrop-blur sticky top-0 z-50 transition-all">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo & Main Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/images/logo.webp"
                            alt="EduFlow"
                            className="size-9 object-contain rounded-lg shadow-sm border border-border/60 bg-white dark:bg-slate-900 p-0.5 group-hover:scale-105 transition-transform"
                        />
                        <span className="font-bold text-lg tracking-tight flex items-center gap-1.5">
                            EduFlow
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hidden sm:inline-block">
                                SaaS
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                currentPage === 'home'
                                    ? 'bg-muted text-foreground font-semibold shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                                currentPage === 'about'
                                    ? 'bg-muted text-foreground font-semibold shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            <Info className="h-3.5 w-3.5" />
                            About & How It Works
                        </Link>
                    </nav>
                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden sm:flex items-center gap-2.5">
                    {auth?.user ? (
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs text-muted-foreground hidden lg:inline-block">
                                Signed in as <strong className="text-foreground">{auth.user.name}</strong>
                            </span>
                            <Button size="sm" asChild>
                                <Link href="/dashboard">
                                    Dashboard
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
                            <Button size="sm" variant="ghost" asChild>
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

                {/* Mobile Menu Button */}
                <div className="flex sm:hidden items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-b border-border/60 bg-background/98 px-4 py-4 space-y-3 backdrop-blur shadow-lg animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col gap-1">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
                                currentPage === 'home'
                                    ? 'bg-muted text-foreground font-semibold'
                                    : 'text-muted-foreground hover:bg-muted/50'
                            }`}
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
                                currentPage === 'about'
                                    ? 'bg-muted text-foreground font-semibold'
                                    : 'text-muted-foreground hover:bg-muted/50'
                            }`}
                        >
                            <Info className="h-4 w-4" />
                            About & How It Works
                        </Link>
                    </nav>

                    <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
                        {auth?.user ? (
                            <>
                                <div className="text-xs text-muted-foreground px-2 py-1">
                                    Signed in as <strong className="text-foreground">{auth.user.name}</strong>
                                </div>
                                <Button size="sm" asChild className="w-full justify-center">
                                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        Go to Dashboard
                                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild className="w-full justify-center">
                                    <Link href="/logout" method="post" as="button" onClick={() => setMobileMenuOpen(false)}>
                                        <LogOut className="mr-1.5 h-3.5 w-3.5" />
                                        Log Out
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="sm" variant="outline" asChild className="w-full justify-center">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <LogIn className="mr-1.5 h-3.5 w-3.5" />
                                        Sign In
                                    </Link>
                                </Button>
                                <Button size="sm" asChild className="w-full justify-center">
                                    <Link href="/register-institution" onClick={() => setMobileMenuOpen(false)}>
                                        <Building2 className="mr-1.5 h-3.5 w-3.5" />
                                        Register Institute
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

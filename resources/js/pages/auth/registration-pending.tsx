import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock, CheckCircle2, Home, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    institution?: {
        name: string;
        admin_email: string;
    } | null;
};

export default function RegistrationPending({ institution }: Props) {
    return (
        <>
            <Head title="Registration Received — EduSaaS" />
            <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
                <div className="max-w-md w-full text-center space-y-6">
                    {/* Icon card */}
                    <div className="bg-card text-card-foreground border border-border shadow-xl rounded-2xl p-8 space-y-6">
                        <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-8 h-8 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Registration Submitted!
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Thank you for registering{' '}
                                <strong className="text-foreground">
                                    {institution?.name || 'your coaching center'}
                                </strong>{' '}
                                on the EduSaaS platform.
                            </p>
                        </div>

                        {/* Status box */}
                        <div className="rounded-xl bg-muted/60 border border-border/80 p-4 text-left space-y-2 text-xs">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-foreground">Application Received</span>
                                    <p className="text-muted-foreground">Your details have been safely registered.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-foreground">Pending Super Admin Review</span>
                                    <p className="text-muted-foreground">
                                        Our platform administrator will review and activate your institute account shortly.
                                    </p>
                                </div>
                            </div>
                            {institution?.admin_email && (
                                <div className="flex items-start gap-2.5 pt-1">
                                    <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-foreground">Admin Account:</span>{' '}
                                        <span className="text-muted-foreground">{institution.admin_email}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button asChild className="w-full">
                                <Link href="/login">
                                    Proceed to Login
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Return to Home
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Need immediate assistance? Contact system support.
                    </p>
                </div>
            </div>
        </>
    );
}

RegistrationPending.layout = (page: React.ReactNode) => page;


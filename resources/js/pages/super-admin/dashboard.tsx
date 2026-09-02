import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, CheckCircle, Clock, ShieldAlert, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    stats: {
        total_tenants: number;
        active_tenants: number;
        pending_tenants: number;
        total_users: number;
    };
};

export default function SuperAdminDashboard({ stats }: Props) {
    return (
        <>
            <Head title="Platform Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Platform Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Overview of all coaching centers, applications, and accounts on the platform.
                    </p>
                </div>

                {/* Pending Requests Alert */}
                {stats.pending_tenants > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                <Clock className="h-5 w-5 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">
                                    {stats.pending_tenants} Pending Coaching Registration{stats.pending_tenants > 1 ? 's' : ''}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    New institutions are waiting for your approval before they can start.
                                </p>
                            </div>
                        </div>
                        <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shrink-0">
                            <Link href="/super-admin/tenants?status=pending">
                                Review Requests
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Coaching Centers"
                        value={stats.total_tenants}
                        icon={<Building2 className="h-5 w-5" />}
                        href="/super-admin/tenants"
                    />
                    <StatCard
                        title="Active Centers"
                        value={stats.active_tenants}
                        icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                        href="/super-admin/tenants?status=active"
                    />
                    <StatCard
                        title="Pending Approval"
                        value={stats.pending_tenants}
                        icon={<Clock className="h-5 w-5 text-amber-500" />}
                        href="/super-admin/tenants?status=pending"
                        highlight={stats.pending_tenants > 0}
                    />
                    <StatCard
                        title="Total Platform Users"
                        value={stats.total_users}
                        icon={<Users className="h-5 w-5 text-primary" />}
                    />
                </div>
            </div>
        </>
    );
}

SuperAdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/super-admin/dashboard' }],
};

function StatCard({
    title,
    value,
    icon,
    href,
    highlight = false,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    href?: string;
    highlight?: boolean;
}) {
    const cardContent = (
        <div
            className={`bg-card text-card-foreground border rounded-xl p-6 transition-all ${
                highlight
                    ? 'border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                    : 'border-sidebar-border/70 dark:border-sidebar-border'
            } ${href ? 'hover:border-primary/50 hover:shadow-md cursor-pointer' : ''}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground text-sm font-medium">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">
                        {value}
                    </p>
                </div>
                <div className="text-muted-foreground">{icon}</div>
            </div>
            {href && (
                <div className="mt-3 flex items-center text-xs font-medium text-primary gap-1">
                    <span>View list</span>
                    <ArrowRight className="h-3 w-3" />
                </div>
            )}
        </div>
    );

    if (href) {
        return <Link href={href}>{cardContent}</Link>;
    }

    return cardContent;
}

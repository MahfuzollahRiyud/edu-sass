import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SharedData } from '@/types';

export default function ImpersonationBanner() {
    const { auth, isImpersonating, impersonatorRole, tenant } = usePage<SharedData>().props;

    if (!isImpersonating) {
        return null;
    }

    function handleLeave() {
        router.post('/impersonate-leave');
    }

    const returnLabel =
        impersonatorRole === 'super_admin'
            ? 'Return to Super Admin Panel'
            : 'Return to Admin Panel';

    return (
        <div className="bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50 px-4 py-2 text-xs sm:text-sm font-medium flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm border-b border-amber-600/30 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 animate-pulse" />
                <span>
                    <strong>Impersonation Active:</strong> You are viewing {tenant ? `"${tenant.name}"` : 'the portal'} as{' '}
                    <strong className="underline font-bold">{auth.user.name}</strong> ({auth.user.role.toUpperCase()}).
                </span>
            </div>

            <Button
                size="sm"
                variant="outline"
                onClick={handleLeave}
                className="bg-amber-950 text-white hover:bg-amber-900 dark:bg-amber-100 dark:text-amber-950 dark:hover:bg-amber-200 border-none h-7 px-3 text-xs font-semibold shrink-0"
            >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                {returnLabel}
            </Button>
        </div>
    );
}

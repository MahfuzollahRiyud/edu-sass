import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, tenant } = usePage<any>().props;
    const displayName = tenant?.name || name || 'EduFlow';

    return (
        <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border border-border/60 flex aspect-square size-9 items-center justify-center rounded-lg p-0.5 shadow-sm shrink-0">
                <AppLogoIcon className="size-7 object-contain" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-foreground">
                    {displayName}
                </span>
                <span className="text-[11px] text-muted-foreground truncate font-medium">
                    EduFlow Education
                </span>
            </div>
        </div>
    );
}


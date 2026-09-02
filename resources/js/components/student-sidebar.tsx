import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    CalendarDays,
    CreditCard,
    LayoutGrid,
    UserCheck,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';

export function StudentSidebar() {
    const { tenant } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/student/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Subjects',
            href: '/student/subjects',
            icon: BookOpen,
        },
        {
            title: 'Routine',
            href: '/student/routine',
            icon: CalendarDays,
        },
        {
            title: 'Attendance',
            href: '/student/attendance',
            icon: UserCheck,
        },
        {
            title: 'Exam Results',
            href: '/student/results',
            icon: Award,
        },
        {
            title: 'Fees & Payments',
            href: '/student/fees',
            icon: CreditCard,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/student/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {tenant && (
                    <div className="px-3 py-1.5">
                        <p className="text-sidebar-foreground/70 truncate text-xs font-medium">
                            {tenant.name}
                        </p>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

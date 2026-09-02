import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    CalendarDays,
    ClipboardList,
    GraduationCap,
    LayoutGrid,
    UserCheck,
    Users,
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

export function TeacherSidebar() {
    const { tenant } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/teacher/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Students',
            href: '/teacher/students',
            icon: GraduationCap,
        },
        {
            title: 'My Schedule',
            href: '/teacher/schedule',
            icon: CalendarDays,
        },
        {
            title: 'Attendance',
            href: '/teacher/attendance',
            icon: UserCheck,
        },
        {
            title: 'Exams & Marks',
            href: '/teacher/exams',
            icon: Award,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/teacher/dashboard" prefetch>
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

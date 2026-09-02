import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    CalendarDays,
    ClipboardList,
    Clock,
    CreditCard,
    GraduationCap,
    LayoutGrid,
    Library,
    Receipt,
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

export function AdminSidebar() {
    const { tenant } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Students',
            href: '/admin/students',
            icon: GraduationCap,
        },
        {
            title: 'Teachers',
            href: '/admin/teachers',
            icon: Users,
        },
        {
            title: 'Classes',
            href: '/admin/classes',
            icon: Library,
        },
        {
            title: 'Subjects',
            href: '/admin/subjects',
            icon: BookOpen,
        },
        {
            title: 'Time Slots',
            href: '/admin/time-slots',
            icon: Clock,
        },
        {
            title: 'Schedule',
            href: '/admin/schedules',
            icon: CalendarDays,
        },
        {
            title: 'Attendance',
            href: '/admin/attendance',
            icon: UserCheck,
        },
        {
            title: 'Exams & Results',
            href: '/admin/exams',
            icon: Award,
        },
        {
            title: 'Fees',
            href: '/admin/fees',
            icon: CreditCard,
        },
        {
            title: 'Payments',
            href: '/admin/payments',
            icon: Receipt,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
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

import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import ImpersonationBanner from '@/components/impersonation-banner';
import { TeacherSidebar } from '@/components/teacher-sidebar';
import type { AppLayoutProps } from '@/types';

export default function TeacherLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <TeacherSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <ImpersonationBanner />
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StudentLayout from '@/layouts/student-layout';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import TeacherLayout from '@/layouts/teacher-layout';

const appName = import.meta.env.VITE_APP_NAME || 'EduSaaS';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        );
        const module = page as any;
        const layoutConfig =
            typeof module.default.layout === 'object' && module.default.layout !== null
                ? module.default.layout
                : {};

        if (typeof module.default.layout !== 'function') {
            if (
                name === 'welcome' ||
                name === 'auth/register-institution' ||
                name === 'auth/registration-pending'
            ) {
                module.default.layout = undefined;
            } else if (name.startsWith('auth/')) {
                module.default.layout = (children: React.ReactNode) => (
                    <AuthLayout title={layoutConfig.title} description={layoutConfig.description}>
                        {children}
                    </AuthLayout>
                );
            } else if (name.startsWith('super-admin/')) {
                module.default.layout = (children: React.ReactNode) => (
                    <SuperAdminLayout breadcrumbs={layoutConfig.breadcrumbs}>
                        {children}
                    </SuperAdminLayout>
                );
            } else if (name.startsWith('admin/')) {
                module.default.layout = (children: React.ReactNode) => (
                    <AdminLayout breadcrumbs={layoutConfig.breadcrumbs}>
                        {children}
                    </AdminLayout>
                );
            } else if (name.startsWith('teacher/')) {
                module.default.layout = (children: React.ReactNode) => (
                    <TeacherLayout breadcrumbs={layoutConfig.breadcrumbs}>
                        {children}
                    </TeacherLayout>
                );
            } else if (name.startsWith('student/')) {
                module.default.layout = (children: React.ReactNode) => (
                    <StudentLayout breadcrumbs={layoutConfig.breadcrumbs}>
                        {children}
                    </StudentLayout>
                );
            } else if (name.startsWith('settings/')) {
                module.default.layout = (children: React.ReactNode) => (
                    <AppLayout breadcrumbs={layoutConfig.breadcrumbs}>
                        <SettingsLayout>{children}</SettingsLayout>
                    </AppLayout>
                );
            } else {
                module.default.layout = (children: React.ReactNode) => (
                    <AppLayout breadcrumbs={layoutConfig.breadcrumbs}>
                        {children}
                    </AppLayout>
                );
            }
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();

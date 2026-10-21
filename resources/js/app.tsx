import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import LoginLayout from '@/layouts/auth/login-layout';
import SettingsLayout from '@/layouts/settings/layout';
import PublicLayout from '@/layouts/public-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Hospital';

function getSiteName() {
    if (typeof document === 'undefined') return appName;
    return document.querySelector<HTMLMetaElement>('meta[name="application-name"]')?.content || appName;
}

void createInertiaApp({
    title: (title) => {
        if (!title) return getSiteName();
        const siteName = getSiteName();
        return title.includes(siteName) ? title : `${title} - ${siteName}`;
    },
    layout: (name) => {
        switch (true) {
            case name.startsWith('public/') || name === 'welcome':
                return PublicLayout;
            case name === 'auth/login':
                return LoginLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#18794e',
    },
});

// This will set light / dark mode on load...
initializeTheme();

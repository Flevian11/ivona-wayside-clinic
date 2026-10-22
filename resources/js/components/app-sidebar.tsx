import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BookOpenText,
    Boxes,
    CalendarDays,
    Code2,
    ClipboardList,
    FlaskConical,
    HeartPulse,
    Hospital,
    Package,
    Pill,
    ReceiptText,
    Settings2,
    ShieldCheck,
    Stethoscope,
    UserRoundPlus,
    Users,
    CircleUserRound,
    LayoutDashboard,
    LockKeyhole,
    Palette,
    KeyRound,
    Cable,
    SlidersHorizontal,
    FileText,
    ClipboardCheck,
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
import { dashboard } from '@/routes';
import { changelog as changelogRoute } from '@/routes/releases';
import { edit as profileEdit } from '@/routes/profile';
import { edit as securityEdit } from '@/routes/security';
import { edit as appearanceEdit } from '@/routes/appearance';
import type { NavItem } from '@/types';

type SidebarAuthorization = {
    auth: {
        permissions?: string[];
    };
};

export function AppSidebar() {
    const { auth } = usePage().props as SidebarAuthorization;
    const effectivePermissions = new Set(auth.permissions ?? []);
    const visibleItems = (items: NavItem[]) =>
        items.filter((item) => !item.permission || effectivePermissions.has(item.permission));

    const workspaceItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
        { title: "What's New", href: changelogRoute(), icon: BookOpenText },
    ];

    const patientItems: NavItem[] = [
        { title: 'Patient registration', href: '#patient-registration', icon: UserRoundPlus, comingSoon: true },
        { title: 'Patient records', href: '#patient-records', icon: Users, comingSoon: true },
        { title: 'Appointments & queue', href: '#appointments', icon: CalendarDays, comingSoon: true },
        { title: 'Clinical encounters', href: '#clinical-encounters', icon: Stethoscope, comingSoon: true },
        { title: 'Nursing', href: '#nursing', icon: HeartPulse, comingSoon: true },
        { title: 'Laboratory', href: '#laboratory', icon: FlaskConical, comingSoon: true },
        { title: 'Pharmacy', href: '#pharmacy', icon: Pill, comingSoon: true },
    ];

    const operationsItems: NavItem[] = [
        { title: 'Billing & payments', href: '#billing', icon: ReceiptText, comingSoon: true },
        { title: 'SHA & claims', href: '#sha-claims', icon: ClipboardList, comingSoon: true },
        { title: 'Inventory & stores', href: '#inventory', icon: Boxes, comingSoon: true },
        { title: 'Procurement', href: '#procurement', icon: Package, comingSoon: true },
        { title: 'Reports & analytics', href: '#reports', icon: Activity, comingSoon: true },
    ];

    const administrationItems: NavItem[] = [
        { title: 'User accounts', href: '/admin/administration/users', icon: Users, permission: 'users.manage' },
        { title: 'Staff directory', href: '/admin/administration/staff', icon: UserRoundPlus, permission: 'staff.manage' },
        { title: 'Roles', href: '/admin/administration/roles', icon: ShieldCheck, permission: 'roles.manage' },
        { title: 'Role assignments', href: '/admin/administration/role-assignments', icon: CircleUserRound, permission: 'roles.manage' },
        { title: 'Permissions', href: '/admin/administration/permissions', icon: LockKeyhole, permission: 'roles.manage' },
        { title: 'Access history', href: '/admin/administration/access-history', icon: Activity, permission: 'audit.view' },
        { title: 'Facility settings', href: '/admin/administration/facility-settings', icon: Hospital, permission: 'settings.view' },
        { title: 'System configuration', href: '/admin/administration/system-configuration', icon: Settings2, permission: 'settings.view' },
    ];

    const accountItems: NavItem[] = [
        {
            title: 'My profile',
            href: profileEdit(),
            icon: CircleUserRound,
        },
        {
            title: 'Security',
            href: securityEdit(),
            icon: LockKeyhole,
        },
        {
            title: 'Appearance',
            href: appearanceEdit(),
            icon: Palette,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-sidebar-border/80 bg-sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-1 overflow-x-hidden bg-sidebar px-0.5">
                <NavMain items={visibleItems(workspaceItems)} label="Workspace" />
                <NavMain items={patientItems} label="Patient care" collapsible defaultOpen />
                <NavMain items={operationsItems} label="Operations" collapsible defaultOpen />
                <NavMain items={visibleItems(administrationItems)} label="Administration" collapsible defaultOpen />
                <NavMain items={visibleItems([
                    { title: 'Integration overview', href: '/developer-tools', icon: Code2, permission: 'integrations.view' },
                    { title: 'Partner API access', href: '/developer-tools/inbound-keys', icon: KeyRound, permission: 'integrations.view' },
                    { title: 'Connected services', href: '/developer-tools/integrations', icon: Cable, permission: 'integrations.view' },
                    { title: 'Environment settings', href: '/developer-tools/environments', icon: SlidersHorizontal, permission: 'integrations.view' },
                    { title: 'SHA & DHA HIE guidance', href: '/developer-tools/hie', icon: FileText, permission: 'integrations.view' },
                    { title: 'API testing console', href: '/developer-tools/testing', icon: ClipboardCheck, permission: 'integrations.view' },
                    { title: 'API activity history', href: '/developer-tools/activity', icon: Activity, permission: 'integrations.view' },
                ])} label="Developer Tools & Integrations" collapsible defaultOpen={false} />
                <NavMain items={visibleItems(accountItems)} label="My account" collapsible defaultOpen={false} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

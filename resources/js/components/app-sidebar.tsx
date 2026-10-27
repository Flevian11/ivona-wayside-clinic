import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BookOpenText,
    Boxes,
    CalendarDays,
    CalendarClock,
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
    ChevronRight,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

export function AppSidebar() {
    // FIX: Cast to any first to bypass the strict overlap check, 
    // then cast to your custom type to keep autocomplete.
    const page = usePage();
    const { auth, site } = page.props as any as {
        auth: { permissions?: string[] };
        site: { name?: string };
    };

    const effectivePermissions = new Set(auth?.permissions ?? []);
    const visibleItems = (items: NavItem[]) =>
        items.filter((item) => !item.permission || effectivePermissions.has(item.permission));

    const workspaceItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
        { title: "What's New", href: changelogRoute(), icon: BookOpenText },
    ];

    const patientItems: NavItem[] = [
        { title: 'Patient registration', href: '/patients/create', icon: UserRoundPlus, permission: 'patients.create' },
        { title: 'Patient records', href: '/patients', icon: Users, permission: 'patients.view' },
        { title: 'Visits', href: '/visits', icon: CalendarClock, permission: 'appointments.view' },
        { title: 'Preauthorizations', href: '/preauthorizations', icon: ShieldCheck, permission: 'sha.services.verify' },
        { title: 'Appointments & queue', href: '/appointments', icon: CalendarDays, permission: 'appointments.view' },
        { title: 'Clinical encounters', href: '/visits', icon: Stethoscope, permission: 'appointments.view' },
        { title: 'Nursing', href: '/nursing', icon: HeartPulse, permission: 'nursing_notes.manage' },
        { title: 'Laboratory', href: '/laboratory', icon: FlaskConical, permission: 'lab.orders.view' },
        { title: 'Pharmacy', href: '/pharmacy', icon: Pill, permission: 'pharmacy.prescriptions.view' },
    ];

    const operationsItems: NavItem[] = [
        { title: 'Billing & payments', href: '/billing', icon: ReceiptText, permission: 'billing.invoices.view' },
        { title: 'SHA & claims', href: '/operations/sha-claims', icon: ClipboardList, permission: 'sha.claims.view' },
        { title: 'Inventory & stores', href: '/inventory', icon: Boxes, permission: 'inventory.view' },
        { title: 'Procurement', href: '/procurement', icon: Package, permission: 'procurement.view' },
        { title: 'Reports & analytics', href: '/reports', icon: Activity, permission: 'reports.operational.view' },
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
        { title: 'My profile', href: profileEdit(), icon: CircleUserRound },
        { title: 'Security', href: securityEdit(), icon: LockKeyhole },
        { title: 'Appearance', href: appearanceEdit(), icon: Palette },
    ];

    const devToolsItems: NavItem[] = [
        { title: 'Integration overview', href: '/developer-tools', icon: Code2, permission: 'developer-tools.view' },
        { title: 'Partner API access', href: '/developer-tools/inbound-keys', icon: KeyRound, permission: 'developer-tools.view' },
        { title: 'Connected services', href: '/developer-tools/integrations', icon: Cable, permission: 'developer-tools.view' },
        { title: 'Environment settings', href: '/developer-tools/environments', icon: SlidersHorizontal, permission: 'developer-tools.view' },
        { title: 'SHA & DHA HIE guidance', href: '/developer-tools/hie', icon: FileText, permission: 'developer-tools.view' },
        { title: 'API testing console', href: '/developer-tools/testing', icon: ClipboardCheck, permission: 'developer-tools.view' },
        { title: 'API activity history', href: '/developer-tools/activity', icon: Activity, permission: 'developer-tools.view' },
    ];

    const SidebarGroupWrapper = ({
        label,
        items,
        collapsible = false,
        defaultOpen = true
    }: {
        label: string;
        items: NavItem[];
        collapsible?: boolean;
        defaultOpen?: boolean
    }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const visible = visibleItems(items);
        if (visible.length === 0) return null;

        const renderItems = () => (
            <SidebarMenu>
                {visible.map((item) => {
                    const Icon = item.icon;
                    const isDisabled = item.comingSoon;

                    return (
                        <SidebarMenuItem key={item.title}>
                            {isDisabled ? (
                                <div className="flex w-full cursor-not-allowed items-center gap-3 rounded-md px-2 py-1.5 text-muted-foreground opacity-50">
                                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                                    <span className="truncate text-sm">{item.title}</span>
                                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-sm">
                                        Soon
                                    </span>
                                </div>
                            ) : (
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link href={item.href} className="flex items-center gap-3 w-full">
                                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                                        <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        );

        if (!collapsible) {
            return (
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{label}</SidebarGroupLabel>
                    {renderItems()}
                </SidebarGroup>
            );
        }

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild className="group/collapsible">
                <SidebarGroup>
                    <SidebarGroupLabel asChild className="group-data-[collapsible=icon]:hidden">
                        <CollapsibleTrigger className="flex w-full items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md px-2 py-1.5 text-sm transition-colors">
                            {label}
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                        {renderItems()}
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        );
    };

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-emerald-100/50 dark:border-slate-800 bg-emerald-50/30 dark:bg-[#08131a]"
        >
            <SidebarHeader className="pt-2 pb-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild tooltip={site?.name || 'Clinic Workspace'}>
                            <Link href={dashboard()} prefetch className="flex items-center gap-2 w-full">
                                {/* Logo without background fill */}
                                <div className="flex aspect-square size-8 items-center justify-center">
                                    <AppLogo />
                                </div>
                                {/* Dynamic site name with truncation for long text */}
                                <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                                    {site?.name || 'Clinic Workspace'}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent
                className="
        min-h-0
        flex-1
        gap-0
        overflow-x-hidden
        overflow-y-auto
        overscroll-y-contain
        px-0
        [scrollbar-width:thin]
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-emerald-600/30
        hover:[&::-webkit-scrollbar-thumb]:bg-emerald-600/60
    "
            >                <SidebarGroupWrapper label="Workspace" items={workspaceItems} />
                <SidebarGroupWrapper label="Patient care" items={patientItems} collapsible defaultOpen />
                <SidebarGroupWrapper label="Operations" items={operationsItems} collapsible defaultOpen />
                <SidebarGroupWrapper label="Administration" items={administrationItems} collapsible defaultOpen />
                <SidebarGroupWrapper label="Developer Tools & Integrations" items={devToolsItems} collapsible defaultOpen={false} />
                <SidebarGroupWrapper label="My account" items={accountItems} collapsible defaultOpen={false} />
            </SidebarContent>

            <SidebarFooter className="mt-auto shrink-0">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
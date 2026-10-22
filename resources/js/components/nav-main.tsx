import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items,
    label = 'Workspace',
    collapsible = false,
    defaultOpen = true,
}: {
    items: NavItem[];
    label?: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    if (items.length === 0) return null;

    const links = (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    {item.children && item.children.length > 0 ? (
                        <Collapsible defaultOpen={item.children.some(child => isCurrentUrl(child.href)) || isCurrentUrl(item.href)} className="group/nav-child w-full">
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton title={item.title} tooltip={{ children: item.title }} className="w-full">
                                    {item.icon && <item.icon aria-hidden="true" />}
                                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                                    <ChevronDown className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/nav-child:rotate-180" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                <SidebarMenu className="ml-3 mt-1 border-l border-sidebar-border/80 pl-2">
                                    {item.children.map(child => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton asChild={!child.comingSoon} isActive={!child.comingSoon && isCurrentUrl(child.href)} title={child.title} tooltip={{ children: child.title }} disabled={child.comingSoon} className={child.comingSoon ? 'cursor-not-allowed opacity-60' : 'transition-colors'}>
                                                {child.comingSoon ? <div aria-disabled="true" title={`${child.title} — Coming soon`} className="flex w-full min-w-0 items-center gap-2">{child.icon && <child.icon aria-hidden="true" />}<span className="min-w-0 flex-1 truncate">{child.title}</span><span className="rounded border border-sidebar-border bg-sidebar-accent/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sidebar-foreground/60">Soon</span></div> : <Link href={child.href} prefetch title={child.title}>{child.icon && <child.icon aria-hidden="true" />}<span>{child.title}</span></Link>}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </CollapsibleContent>
                        </Collapsible>
                    ) : (
                        <SidebarMenuButton asChild={!item.comingSoon} isActive={!item.comingSoon && isCurrentUrl(item.href)} tooltip={{ children: item.comingSoon ? `${item.title} — Coming soon` : item.title }} title={item.title} disabled={item.comingSoon} className={item.comingSoon ? 'cursor-not-allowed opacity-60' : 'transition-colors'}>
                            {item.comingSoon ? <div aria-disabled="true" title={`${item.title} — Coming soon`} className="flex w-full min-w-0 items-center gap-2">{item.icon && <item.icon aria-hidden="true" />}<span className="min-w-0 flex-1 truncate">{item.title}</span><span className="rounded border border-sidebar-border bg-sidebar-accent/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sidebar-foreground/60">Soon</span></div> : <Link href={item.href} prefetch title={item.title}>{item.icon && <item.icon aria-hidden="true" />}<span>{item.title}</span></Link>}
                        </SidebarMenuButton>
                    )}
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );

    return (
        <SidebarGroup className="px-2 py-0">
            {collapsible ? (
                <Collapsible defaultOpen={defaultOpen} className="group/nav-group">
                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            title={`${label} navigation`}
                            className="flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-xs font-semibold tracking-wide text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                        >
                            <span>{label}</span>
                            <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]/nav-group:rotate-180" />
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        {links}
                    </CollapsibleContent>
                </Collapsible>
            ) : (
                <>
                    <SidebarGroupLabel>{label}</SidebarGroupLabel>
                    {links}
                </>
            )}
        </SidebarGroup>
    );
}

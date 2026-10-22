import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

type SiteIdentity = { name?: string | null; logo_url?: string | null };
export default function AppLogo() {
    const props = usePage().props as { name?: string; siteIdentity?: SiteIdentity; site?: SiteIdentity };
    const identity = props.siteIdentity || props.site;
    const name = identity?.name?.trim() || props.name?.trim() || 'Ivona Wayside Clinic';
    const logo = identity?.logo_url?.trim();
    return <>
        <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            {logo ? <img src={logo} alt={`${name} logo`} className="size-full object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />}
        </div>
        <div className="ml-1 grid min-w-0 flex-1 text-left text-sm"><span className="truncate font-semibold leading-tight">{name}</span></div>
    </>;
}

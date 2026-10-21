import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Clock3, ExternalLink, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Share2, Youtube } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SharedData } from '@/types';

const socialMeta: Record<string, { label: string; Icon: LucideIcon }> = {
    whatsapp: { label: 'WhatsApp', Icon: Phone },
    facebook: { label: 'Facebook', Icon: Facebook },
    instagram: { label: 'Instagram', Icon: Instagram },
    linkedin: { label: 'LinkedIn', Icon: Linkedin },
    youtube: { label: 'YouTube', Icon: Youtube },
    x: { label: 'X', Icon: Share2 },
};

const publicLinkLabels: Record<string, string> = {
    directions: 'Directions',
    appointments: 'Appointments',
    google_maps: 'Google Maps',
    website: 'Website',
    whatsapp: 'WhatsApp',
};

function hasUrl(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url);
}

export default function SiteFooter() {
    const { site } = usePage<SharedData>().props;
    const year = new Date().getFullYear();
    const socialLinks = Object.entries(site.social_links ?? {}).filter(([key, url]) => key in socialMeta && hasUrl(url)) as [string, string][];
    const publicLinks = Object.entries(site.public_links ?? {}).filter(([key, url]) => key in publicLinkLabels && hasUrl(url)) as [string, string][];

    return (
        <footer className="bg-[#102d24] text-white">
            <div className="site-container grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr] lg:py-16">
                <div>
                    <Link href="/" className="inline-flex items-center gap-3" aria-label={`${site.name} home`}>
                        {site.logo_url ? <img src={site.logo_url} alt="" className="size-11 rounded-2xl bg-white/10 object-contain p-1" /> : <span className="grid size-11 place-items-center rounded-2xl bg-emerald-400 text-emerald-950"><span className="text-3xl font-light leading-none">+</span></span>}
                        <span className="text-lg font-bold tracking-tight">{site.name}</span>
                    </Link>
                    <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">{site.tagline || 'Thoughtful healthcare, centred on people and the community.'}</p>
                    {site.address && <p className="mt-4 flex max-w-sm items-start gap-3 text-sm leading-6 text-white/70"><MapPin className="mt-1 size-4 shrink-0 text-emerald-300" />{site.address}</p>}
                    {site.opening_hours && <p className="mt-3 flex max-w-sm items-start gap-3 text-sm leading-6 text-white/70"><Clock3 className="mt-1 size-4 shrink-0 text-emerald-300" /><span className="whitespace-pre-line">{site.opening_hours}</span></p>}
                    <Link href="/about" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-white">About the clinic <ArrowUpRight className="size-4" /></Link>
                    {socialLinks.length > 0 && <div className="mt-6"><h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60"><Share2 className="size-3.5" /> Follow us</h2><div className="mt-3 flex flex-wrap gap-2">{socialLinks.map(([key, href]) => { const { label, Icon } = socialMeta[key]; return <a key={key} href={href} aria-label={label} title={label} target="_blank" rel="noreferrer" className="grid size-10 place-items-center border border-white/15 text-emerald-200 transition hover:border-emerald-300 hover:bg-white/10 hover:text-white"><Icon className="size-4" /></a>; })}</div></div>}
                </div>
                <div>
                    <h2 className="text-sm font-semibold tracking-wide text-white">Explore</h2>
                    <nav className="mt-5 grid gap-3 text-sm text-white/70" aria-label="Footer navigation">
                        <Link href="/" className="transition hover:text-white">Home</Link>
                        <Link href="/about" className="transition hover:text-white">About</Link>
                        <Link href="/services" className="transition hover:text-white">Services</Link>
                        <Link href="/blog" className="transition hover:text-white">Health stories</Link>
                        <Link href="/careers" className="transition hover:text-white">Careers</Link>
                        <Link href="/contact" className="transition hover:text-white">Contact</Link>
                    </nav>
                    {publicLinks.length > 0 && <><h3 className="mt-7 text-xs font-semibold uppercase tracking-wider text-white/55">Useful links</h3><nav className="mt-3 grid gap-3 text-sm text-white/70" aria-label="Public contact links">{publicLinks.map(([key, href]) => <a key={key} href={href} target={isExternal(href) ? '_blank' : undefined} rel={isExternal(href) ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 transition hover:text-white"><span>{publicLinkLabels[key]}</span>{isExternal(href) ? <ExternalLink className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}</a>)}</nav></>}
                </div>
                <div>
                    <h2 className="text-sm font-semibold tracking-wide text-white">Contact the clinic</h2>
                    <div className="mt-5 grid gap-4 text-sm text-white/70">
                        {site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="flex items-start gap-3 transition hover:text-white"><Phone className="mt-0.5 size-4 shrink-0 text-emerald-300" /><span>{site.phone}</span></a>}
                        {site.email && <a href={`mailto:${site.email}`} className="flex items-start gap-3 break-all transition hover:text-white"><Mail className="mt-0.5 size-4 shrink-0 text-emerald-300" /><span>{site.email}</span></a>}
                        {!site.phone && !site.email && !site.address && <p className="leading-6">Contact details will appear here when configured by the clinic.</p>}
                        <Link href="/contact" className="mt-1 inline-flex w-fit items-center gap-2 border border-emerald-300/70 px-4 py-2.5 font-semibold text-emerald-200 transition hover:bg-white/10 hover:text-white">Contact page <ArrowUpRight className="size-4" /></Link>
                        <Link href="/login" className="inline-flex w-fit items-center gap-2 text-emerald-200 transition hover:text-white">HMIS staff login <ArrowUpRight className="size-4" /></Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="site-container flex flex-col gap-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {year} {site.name}. All rights reserved.</p>
                    <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal navigation">
                        <Link href="/privacy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/gdpr" className="hover:text-white">Data protection</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

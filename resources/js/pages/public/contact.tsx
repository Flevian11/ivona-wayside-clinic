import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Clock3,
    ExternalLink,
    Facebook,
    Globe2,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    Twitter,
    Youtube,
} from 'lucide-react';
import type { SharedData } from '@/types';

type ContactPageProps = {
    pageTitle: string;
    pageDescription: string;
};

const socialIcons = {
    whatsapp: MessageCircle,
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    x: Twitter,
} as const;

const socialLabels: Record<string, string> = {
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    x: 'X',
};

const publicLinkLabels: Record<string, string> = {
    directions: 'Get directions',
    appointments: 'Appointments',
    google_maps: 'Open in Google Maps',
    website: 'Visit website',
    whatsapp: 'Chat on WhatsApp',
};

function isConfigured(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isExternal(href: string) {
    return /^https?:\/\//i.test(href);
}

function isLocalDevelopmentUrl(href: string) {
    try {
        const hostname = new URL(href).hostname.toLowerCase();
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    } catch {
        return false;
    }
}

export default function ContactPage({ pageTitle, pageDescription }: ContactPageProps) {
    const { site } = usePage<SharedData>().props;
    const details = [
        site.phone ? { label: 'Telephone', value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, '')}`, Icon: Phone } : null,
        site.email ? { label: 'Email', value: site.email, href: `mailto:${site.email}`, Icon: Mail } : null,
        site.address ? { label: 'Clinic address', value: site.address, Icon: MapPin } : null,
        site.opening_hours ? { label: 'Opening hours', value: site.opening_hours, Icon: Clock3 } : null,
    ].filter((item): item is NonNullable<typeof item> => item !== null);

    const socialLinks = Object.entries(site.social_links ?? {})
        .filter(([key, value]) => key in socialLabels && isConfigured(value)) as [string, string][];
    const publicLinks = Object.entries(site.public_links ?? {})
        .filter(([key, value]) => key in publicLinkLabels && key !== 'website' && isConfigured(value)) as [string, string][];
    const configuredWebsite = isConfigured(site.public_links?.website)
        ? site.public_links.website
        : isConfigured(site.url)
          ? site.url
          : null;
    const websiteUrl = configuredWebsite && !isLocalDevelopmentUrl(configuredWebsite) ? configuredWebsite : null;

    return (
        <>
            <Head title={`${pageTitle} | ${site.name}`}>
                <meta head-key="description" name="description" content={pageDescription || site.description} />
            </Head>

            <main className="bg-background text-foreground">
                <section className="relative isolate overflow-hidden border-b border-border/70 bg-secondary/35">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-36 -z-10 size-[28rem] rounded-full border border-primary/10" />
                    <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-20 -z-10 size-80 rounded-full border border-primary/10" />
                    <div className="site-container py-12 sm:py-16 lg:py-20">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                            <ArrowLeft className="size-4" /> Back to home
                        </Link>
                        <div className="mt-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
                            <div className="max-w-4xl">
                                <p className="site-eyebrow"><span className="mr-2 inline-block size-1.5 rounded-full bg-primary" /> Contact the clinic</p>
                                <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                                    Let’s get you to the <span className="text-primary">right place.</span>
                                </h1>
                                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                                    {pageDescription || `Find the clinic’s published contact details, location information and official links for ${site.name}.`}
                                </p>
                            </div>
                            <div className="hidden rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm backdrop-blur-sm lg:block">
                                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="size-5" /></span>
                                <p className="mt-4 text-sm font-semibold text-foreground">Contact information</p>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">Only details configured by the clinic are shown here.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-container py-10 sm:py-14 lg:py-16">
                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-8">
                        <section aria-labelledby="contact-details-heading" className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
                            <div className="border-b border-border/70 p-6 sm:p-8">
                                <div className="flex items-start gap-4">
                                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Phone className="size-5" /></span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Reach our team</p>
                                        <h2 id="contact-details-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Contact details</h2>
                                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Use the official information below to contact or locate the clinic.</p>
                                    </div>
                                </div>
                            </div>

                            {details.length > 0 ? (
                                <div className="divide-y divide-border/70 px-6 sm:px-8">
                                    {details.map(({ label, value, href, Icon }) => {
                                        const content = (
                                            <>
                                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary/10"><Icon className="size-[18px]" /></span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
                                                    <span className="mt-1.5 block whitespace-pre-line break-words text-sm font-medium leading-6 text-foreground">{value}</span>
                                                </span>
                                                {href && <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />}
                                            </>
                                        );
                                        return href ? (
                                            <a key={label} href={href} className="group -mx-2 flex items-start gap-4 rounded-xl px-2 py-5 transition-colors hover:bg-secondary/50 sm:py-6">{content}</a>
                                        ) : (
                                            <div key={label} className="flex items-start gap-4 py-5 sm:py-6">{content}</div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 sm:p-8">
                                    <div className="rounded-2xl border border-dashed border-border bg-secondary/35 p-6 sm:p-7">
                                        <span className="grid size-11 place-items-center rounded-xl bg-card text-muted-foreground shadow-sm"><Clock3 className="size-5" /></span>
                                        <h3 className="mt-4 text-base font-semibold text-foreground">Contact details are being configured</h3>
                                        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">The clinic has not published its phone number, email, address or opening hours yet. Please use the official links on this page if one is available.</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        <div className="grid content-start gap-6">
                            {(publicLinks.length > 0 || websiteUrl) && (
                                <section aria-labelledby="official-links-heading" className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:rounded-3xl sm:p-7">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Globe2 className="size-5" /></span>
                                        <div>
                                            <h2 id="official-links-heading" className="text-lg font-semibold text-foreground">Official links</h2>
                                            <p className="mt-0.5 text-sm text-muted-foreground">Useful clinic resources</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 grid gap-2.5">
                                        {websiteUrl && <a href={websiteUrl} target={isExternal(websiteUrl) ? '_blank' : undefined} rel={isExternal(websiteUrl) ? 'noreferrer' : undefined} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50"><span className="flex items-center gap-3"><Globe2 className="size-4 text-primary" /> Visit website</span><ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></a>}
                                        {publicLinks.map(([key, href]) => <a key={key} href={href} target={isExternal(href) ? '_blank' : undefined} rel={isExternal(href) ? 'noreferrer' : undefined} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50"><span>{publicLinkLabels[key]}</span>{isExternal(href) ? <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /> : <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />}</a>)}
                                    </div>
                                </section>
                            )}

                            {socialLinks.length > 0 && (
                                <section aria-labelledby="social-links-heading" className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:rounded-3xl sm:p-7">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Share2 className="size-5" /></span>
                                        <h2 id="social-links-heading" className="text-lg font-semibold text-foreground">Follow the clinic</h2>
                                    </div>
                                    <div className="mt-5 flex flex-wrap gap-2.5">
                                        {socialLinks.map(([key, href]) => { const Icon = socialIcons[key as keyof typeof socialIcons]; return <a key={key} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50 hover:text-primary">{Icon && <Icon className="size-4" aria-hidden="true" />} {socialLabels[key]} <ArrowUpRight className="size-3.5" /></a>; })}
                                    </div>
                                </section>
                            )}

                            <section className="relative isolate overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:rounded-3xl sm:p-7">
                                <div aria-hidden="true" className="absolute -right-12 -top-14 -z-10 size-44 rounded-full border border-primary-foreground/15" />
                                <div aria-hidden="true" className="absolute -right-5 -top-7 -z-10 size-28 rounded-full border border-primary-foreground/15" />
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">Explore Ivona</p>
                                <h2 className="mt-3 max-w-sm text-xl font-semibold leading-snug tracking-tight">Looking for something specific?</h2>
                                <p className="mt-2 max-w-sm text-sm leading-6 text-primary-foreground/80">Browse the clinic’s services or return to the homepage to find your way around.</p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    <Link href="/services" className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary-foreground/70 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10">Explore services <ArrowRight className="size-4" /></Link>
                                    <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary-foreground/30 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10">Homepage <ArrowUpRight className="size-4" /></Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

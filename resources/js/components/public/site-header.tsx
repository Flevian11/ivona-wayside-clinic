import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { SharedData } from '@/types';

const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Stories', href: '/blog' },
    { label: 'Careers', href: '/careers' },
];

export default function SiteHeader() {
    const { site } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
            <div className="site-container flex h-[76px] items-center justify-between gap-5">
                <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${site.name} home`}>
                    {site.logo_url ? (
                        <img src={site.logo_url} alt="" className="size-11 shrink-0 rounded-2xl object-contain" />
                    ) : (
                        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <svg viewBox="0 0 40 40" className="size-7" fill="none" aria-hidden="true">
                                <path d="M20 5v30M5 20h30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" opacity=".55" />
                            </svg>
                        </span>
                    )}
                    <span className="min-w-0">
                        <span className="block truncate text-[15px] font-bold tracking-tight text-foreground sm:text-base">{site.name}</span>
                        <span className="hidden text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:block">Health · Care · Community</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                        HMIS Login <LogIn className="size-4" />
                    </Link>
                    <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-transparent hover:text-primary">
                        Contact us <ArrowUpRight className="size-4" />
                    </Link>
                </div>

                <button type="button" className="grid size-11 place-items-center rounded-xl border border-border text-foreground lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
                    {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>
            {open && (
                <nav className="site-container grid gap-1 border-t border-border/70 py-4 lg:hidden" aria-label="Mobile navigation">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/5 hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/login" onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                        HMIS Login <LogIn className="size-4" />
                    </Link>
                    <Link href="/contact" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-transparent hover:text-primary">
                        Contact us <ArrowUpRight className="size-4" />
                    </Link>
                </nav>
            )}
        </header>
    );
}

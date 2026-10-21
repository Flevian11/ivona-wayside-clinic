import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import type { SharedData } from '@/types';

type InformationPageProps = {
    pageTitle: string;
    pageDescription: string;
};

export default function InformationPage({ pageTitle, pageDescription }: InformationPageProps) {
    const { site } = usePage<SharedData>().props;

    return (
        <>
            <section className="relative isolate overflow-hidden border-b border-border/60 bg-secondary/40">
                <div className="absolute -right-20 -top-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="site-container py-16 sm:py-24">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"><ArrowLeft className="size-4" /> Back home</Link>
                    <span className="site-eyebrow mt-8"><Compass className="size-3.5" /> {site.name}</span>
                    <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{pageTitle}</h1>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{pageDescription}</p>
                </div>
            </section>
            <section className="site-container py-16 sm:py-20">
                <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Compass className="size-6" /></span>
                    <h2 className="mt-6 text-xl font-semibold">This section is being prepared</h2>
                    <p className="mt-3 leading-7 text-muted-foreground">The shared public layout and branding are in place. The full content and any related workflows for this page will be implemented in the public website phase.</p>
                    <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Contact the hospital <ArrowUpRight className="size-4" /></Link>
                </div>
            </section>
        </>
    );
}

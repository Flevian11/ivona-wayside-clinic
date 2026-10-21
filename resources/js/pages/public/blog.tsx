import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpenText, CalendarDays, Search } from 'lucide-react';
import type { SharedData } from '@/types';

export default function BlogPage() {
    const { site } = usePage<SharedData>().props;
    return (
        <>
            <Head title={`Health stories | ${site.name}`}><meta head-key="description" name="description" content={`Health education and clinic updates from ${site.name}.`} /></Head>
            <section className="relative isolate overflow-hidden border-b border-border bg-secondary/40"><div className="absolute -right-20 -top-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" /><div className="site-container py-16 sm:py-24 lg:py-28"><p className="site-eyebrow"><BookOpenText className="size-4" /> Health stories and updates</p><h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl">Useful information for <span className="text-primary">healthier days.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">This is the home for health education, clinic announcements, and community updates that the clinic has reviewed and published.</p></div></section>
            <section className="site-container py-14 sm:py-20"><div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="site-eyebrow">Latest from the clinic</p><h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">Published stories</h2></div><div className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" /> Only published items appear here</div></div><div className="py-14 sm:py-20"><div className="mx-auto max-w-xl text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl border border-border bg-card text-primary"><Search className="size-6" /></span><h3 className="mt-6 text-xl font-semibold text-foreground">No stories published yet</h3><p className="mt-3 leading-7 text-muted-foreground">There are no published articles to display right now. We will show stories here when they have been reviewed and published by the clinic. No sample articles or unverified medical advice are displayed.</p><Link href="/contact" className="mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95">Contact the clinic <ArrowRight className="size-4" /></Link></div></div></section>
            <section className="border-y border-border bg-secondary/30"><div className="site-container py-10 sm:py-12"><p className="text-sm leading-7 text-muted-foreground">Health information on this website is general information and is not a substitute for assessment or advice from a qualified healthcare professional. If you are concerned about a health issue, contact a qualified provider.</p></div></section>
        </>
    );
}

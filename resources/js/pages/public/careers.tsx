import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, Mail, Users } from 'lucide-react';
import type { SharedData } from '@/types';

export default function CareersPage() {
    const { site } = usePage<SharedData>().props;
    return (
        <>
            <Head title={`Careers | ${site.name}`}><meta head-key="description" name="description" content={`Career and recruitment information from ${site.name}.`} /></Head>
            <section className="relative isolate overflow-hidden border-b border-border bg-secondary/40"><div className="absolute -right-20 -top-20 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" /><div className="site-container py-16 sm:py-24 lg:py-28"><p className="site-eyebrow"><Users className="size-4" /> Careers at the clinic</p><h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl">Bring care, skill, and <span className="text-primary">purpose</span> to your work.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">This page is where {site.name} will publish verified vacancies and recruitment notices. We do not list roles that have not been formally announced.</p></div></section>
            <section className="site-container py-16 sm:py-20"><div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-7 sm:p-10"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><BriefcaseBusiness className="size-6" /></span><h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">No vacancies are currently published</h2><p className="mt-3 leading-7 text-muted-foreground">There are no active job listings on this page at the moment. Please check back for official updates. For general recruitment enquiries, use the clinic’s published contact channels; an enquiry is not an application and does not guarantee a vacancy.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95"><Mail className="size-4" /> Contact the clinic <ArrowRight className="size-4" /></Link><Link href="/" className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary">Return home</Link></div></div></section>
        </>
    );
}

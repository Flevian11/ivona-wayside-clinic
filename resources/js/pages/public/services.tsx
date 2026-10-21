import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, ClipboardList, CircleHelp, Clock3, Phone } from 'lucide-react';
import type { SharedData } from '@/types';

export default function ServicesPage() {
    const { site } = usePage<SharedData>().props;
    const checklist = [
        { icon: CircleHelp, title: 'Confirm the service', body: 'Contact the clinic to check whether the service you need is available on the day you plan to visit.' },
        { icon: ClipboardList, title: 'Ask what to bring', body: 'Confirm which identification, referral notes, prescriptions, or other documents may be needed for your visit.' },
        { icon: Clock3, title: 'Check timing and charges', body: 'Ask about clinic hours, expected waiting time, fees, and any applicable Social Health Authority (SHA) requirements.' },
    ];
    return (
        <>
            <Head title={`Services | ${site.name}`}><meta head-key="description" name="description" content={`Find out how to enquire about services and visit information at ${site.name}.`} /></Head>
            <section className="relative isolate overflow-hidden border-b border-border bg-secondary/40">
                <div className="absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="site-container py-16 sm:py-24 lg:py-28">
                    <p className="site-eyebrow"><BadgeCheck className="size-4" /> Services and visits</p>
                    <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl">Find the right information <span className="text-primary">before you visit.</span></h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">We want it to be straightforward to ask about care. Service availability, fees, hours, and SHA arrangements can change, so please confirm the details directly with {site.name}.</p>
                    <div className="mt-8 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95">Ask about a service <ArrowRight className="size-4" /></Link>{site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary"><Phone className="size-4" /> Call the clinic</a>}</div>
                </div>
            </section>
            <section className="site-container py-16 sm:py-20">
                <div className="max-w-2xl"><p className="site-eyebrow">Planning your visit</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Three useful things to confirm</h2><p className="mt-4 leading-7 text-muted-foreground">These steps help you get accurate information from the clinic rather than relying on outdated or incomplete online details.</p></div>
                <div className="mt-9 grid gap-4 md:grid-cols-3">{checklist.map(({ icon: Icon, title, body }, index) => <article key={title} className="rounded-2xl border border-border bg-card p-6 sm:p-7"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="text-sm font-semibold tabular-nums text-muted-foreground">0{index + 1}</span></div><h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p></article>)}</div>
            </section>
            <section className="border-y border-border bg-secondary/30"><div className="site-container grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center sm:py-16"><div><p className="site-eyebrow">Need help?</p><h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">Contact the team for current information.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">For urgent or life-threatening emergencies, use the appropriate local emergency service rather than waiting for a reply through this website.</p></div><Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95">Contact details <ArrowRight className="size-4" /></Link></div></section>
        </>
    );
}

import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, HeartHandshake, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import type { SharedData } from '@/types';

export default function AboutPage() {
    const { site } = usePage<SharedData>().props;
    return (
        <>
            <Head title={`About | ${site.name}`}>
                <meta head-key="description" name="description" content={`Learn about ${site.name}, its care approach, location, and how to contact the clinic.`} />
            </Head>
            <section className="relative isolate overflow-hidden border-b border-border bg-secondary/40">
                <div className="absolute -right-24 -top-24 -z-10 size-[28rem] rounded-full bg-primary/10 blur-3xl" />
                <div className="site-container py-16 sm:py-24 lg:py-28">
                    <p className="site-eyebrow"><HeartHandshake className="size-4" /> About the clinic</p>
                    <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl">Healthcare should feel <span className="text-primary">personal.</span></h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{site.description || `Learn about ${site.name} and how to reach the clinic.`}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/services" className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95">Explore services <ArrowRight className="size-4" /></Link>
                        <Link href="/contact" className="inline-flex items-center gap-2 border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary">Contact the clinic <ArrowRight className="size-4" /></Link>
                    </div>
                </div>
            </section>
            <section className="site-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                    <p className="site-eyebrow">Our approach</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Clear information. Respectful care.</h2>
                </div>
                <div className="space-y-5 text-base leading-8 text-muted-foreground">
                    <p>Healthcare can involve important questions and difficult decisions. We believe people should be treated with dignity, listened to carefully, and given information they can understand.</p>
                    <p>This website is designed to help visitors learn about the clinic and find the right way to contact the team. Specific services, availability, charges, and eligibility should be confirmed directly with the clinic before a visit.</p>
                    {site.address && <p className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-foreground"><MapPin className="mt-1 size-5 shrink-0 text-primary" /><span><span className="block font-semibold">Where to find us</span><span className="mt-1 block text-muted-foreground">{site.address}</span></span></p>}
                </div>
            </section>
            <section className="border-y border-border bg-secondary/30">
                <div className="site-container grid gap-4 py-12 md:grid-cols-3 sm:py-16">
                    {[
                        { icon: HeartHandshake, title: 'People first', body: 'Approach every interaction with courtesy, empathy, and respect.' },
                        { icon: ShieldCheck, title: 'Clear information', body: 'Help visitors understand how to ask questions and confirm important details.' },
                        { icon: Stethoscope, title: 'Care with responsibility', body: 'Encourage people to discuss their needs directly with qualified clinic staff.' },
                    ].map(({ icon: Icon, title, body }) => <article key={title} className="rounded-2xl border border-border bg-card p-6 sm:p-7"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p></article>)}
                </div>
            </section>
            <section className="site-container py-14 sm:py-20">
                <div className="flex flex-col justify-between gap-6 rounded-3xl bg-primary p-7 text-primary-foreground sm:flex-row sm:items-center sm:p-10">
                    <div><p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-75">Need more information?</p><h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Speak with the clinic team.</h2><p className="mt-3 max-w-xl text-sm leading-7 opacity-85">Use the contact page to find the currently published contact details and links.</p></div>
                    <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 border border-current px-5 py-3 text-sm font-semibold transition hover:bg-white/10">Contact us <ArrowRight className="size-4" /></Link>
                </div>
            </section>
        </>
    );
}

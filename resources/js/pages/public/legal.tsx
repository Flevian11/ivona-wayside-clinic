import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, FileCheck2, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';
import type { SharedData } from '@/types';

type LegalKey = 'privacy' | 'terms' | 'data-protection';
type Section = { heading: string; paragraphs: string[]; bullets?: string[] };
type LegalDocument = { title: string; description: string; icon: typeof ShieldCheck; notice: string; sections: Section[] };

const documents: Record<LegalKey, LegalDocument> = {
    privacy: {
        title: 'Privacy notice', description: 'How to approach personal information when using this website or contacting the clinic.', icon: LockKeyhole,
        notice: 'This public notice is a starting point and must be reviewed against the clinic’s actual data handling, systems, and retention practices before it is treated as a final legal policy.',
        sections: [
            { heading: 'Information you choose to share', paragraphs: ['If you contact the clinic by phone, email, WhatsApp, or another published channel, you may choose to share information needed to respond to your enquiry. Please do not send detailed medical records or highly sensitive health information through a general enquiry channel unless the clinic has specifically provided a suitable, secure process.'] },
            { heading: 'How information may be used', paragraphs: ['Information you provide may be used to respond to your enquiry, communicate with you, or address the matter you raised. The clinic should collect only information that is necessary for a stated purpose and handle it in accordance with applicable law.'] },
            { heading: 'Sharing and security', paragraphs: ['Personal information should only be accessed by authorised people and shared when necessary and lawful. Electronic communication providers may process information when you use their services; their own privacy terms also apply.'] },
            { heading: 'Retention and your choices', paragraphs: ['Retention periods depend on the purpose and any applicable legal or healthcare recordkeeping requirements. You may contact the clinic to ask about personal information associated with you, subject to identity checks, applicable law, and any lawful limits.'] },
            { heading: 'Contact about privacy', paragraphs: ['For privacy questions, use the clinic’s published contact details. Do not include unnecessary medical details in an initial enquiry.'] },
        ],
    },
    terms: {
        title: 'Website terms of use', description: 'Practical terms for using the clinic’s public website and information.', icon: Scale,
        notice: 'These website terms are general draft content and should be reviewed by the clinic before publication as final legal terms.',
        sections: [
            { heading: 'Purpose of this website', paragraphs: ['This website provides general information about the clinic, its published contact channels, and public updates. Content may be changed, corrected, or withdrawn as information is updated.'] },
            { heading: 'Not a clinical consultation', paragraphs: ['Website content is not a diagnosis, prescription, emergency service, or substitute for individual assessment by a qualified healthcare professional. Contact the clinic directly to confirm services, availability, fees, opening hours, and eligibility.'] },
            { heading: 'Accuracy and availability', paragraphs: ['Reasonable care should be taken to keep public information current, but online information may be incomplete or temporarily unavailable. Please verify time-sensitive details with the clinic before relying on them.'] },
            { heading: 'External links', paragraphs: ['Links to third-party services are provided for convenience. The clinic does not control the content, security, or privacy practices of external websites and services.'] },
            { heading: 'Responsible use', paragraphs: ['Do not attempt to disrupt the website, bypass access controls, upload malicious content, or use the website in a way that violates applicable law or another person’s rights.'] },
        ],
    },
    'data-protection': {
        title: 'Data protection', description: 'Information about privacy rights and how to raise a data protection question.', icon: ShieldCheck,
        notice: 'This page provides general information, not a determination of legal compliance. The clinic must confirm its actual processes and applicable obligations before final publication.',
        sections: [
            { heading: 'Applicable framework', paragraphs: ['The Kenya Data Protection Act, 2019 and applicable regulations may govern how personal data is collected, used, stored, disclosed, and retained. Whether additional laws, including the EU General Data Protection Regulation (GDPR), apply depends on the circumstances; this page does not claim that GDPR applies to every visitor or processing activity.'] },
            { heading: 'Questions and requests', paragraphs: ['You may contact the clinic to ask how your personal information is used or to raise a data protection concern. The clinic may need to verify your identity and assess the request under applicable law before responding.'] },
            { heading: 'Health information', paragraphs: ['Health information is sensitive. Please use a clinic-approved secure channel for clinical information and share only what is necessary. General website contact channels should not be assumed to be an emergency or secure clinical record submission service.'] },
            { heading: 'Escalation', paragraphs: ['If you cannot resolve a concern directly with the clinic, you may seek information from the Office of the Data Protection Commissioner in Kenya. This website does not replace official guidance or legal advice.'] },
        ],
    },
};

export default function LegalPage({ pageKey }: { pageKey: LegalKey }) {
    const { site } = usePage<SharedData>().props;
    const doc = documents[pageKey];
    const Icon = doc.icon;
    return (
        <>
            <Head title={`${doc.title} | ${site.name}`}><meta head-key="description" name="description" content={doc.description} /><meta head-key="robots" name="robots" content="index,follow" /></Head>
            <section className="border-b border-border bg-secondary/40"><div className="site-container py-14 sm:py-20"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"><ArrowLeft className="size-4" /> Back home</Link><p className="site-eyebrow mt-8"><Icon className="size-4" /> Policies and information</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{doc.title}</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{doc.description}</p></div></section>
            <section className="site-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16"><article className="min-w-0"><div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-7 text-foreground"><span className="font-semibold">Review notice: </span>{doc.notice}</div><div className="mt-10 space-y-10">{doc.sections.map((section, index) => <section key={section.heading} className="border-b border-border pb-8 last:border-0"><p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Section {String(index + 1).padStart(2, '0')}</p><h2 className="mt-3 text-xl font-semibold text-foreground">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 leading-8 text-muted-foreground">{paragraph}</p>)}{section.bullets && <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</div></article><aside className="space-y-4"><div className="rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold text-foreground">Related information</h2><div className="mt-4 grid gap-3 text-sm">{[{ href: '/privacy', label: 'Privacy notice' }, { href: '/terms', label: 'Website terms' }, { href: '/gdpr', label: 'Data protection' }].filter((item) => (pageKey === 'data-protection' ? item.href !== '/gdpr' : pageKey === 'privacy' ? item.href !== '/privacy' : item.href !== '/terms')).map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 text-muted-foreground transition hover:text-primary">{item.label}<ArrowRight className="size-4" /></Link>)}</div></div><div className="rounded-2xl bg-primary p-5 text-primary-foreground"><FileCheck2 className="size-6" /><h2 className="mt-4 font-semibold">Have a question?</h2><p className="mt-2 text-sm leading-6 opacity-85">Contact the clinic to raise a privacy or website question.</p><Link href="/contact" className="mt-4 inline-flex items-center gap-2 border border-current px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">Contact us <ArrowRight className="size-4" /></Link></div></aside></section>
        </>
    );
}

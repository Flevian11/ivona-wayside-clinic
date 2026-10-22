import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BookOpenText,
    Boxes,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock3,
    FileText,
    FlaskConical,
    HeartPulse,
    Hospital,
    ReceiptText,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AuthenticatedPageHeader } from '@/components/authenticated/page-header';
import { AuthenticatedSectionCard } from '@/components/authenticated/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { changelog as changelogRoute } from '@/routes/releases';
import { edit as profileEdit } from '@/routes/profile';
import { edit as securityEdit } from '@/routes/security';
import type { BreadcrumbItem } from '@/types';

type ReleaseAnnouncement = {
    id: number;
    version: string;
    title: string;
    release_type: string;
    summary: string;
    release_notes: string | null;
    features: string[];
    improvements: string[];
    bug_fixes: string[];
    security_notes: string[];
    known_issues: string[];
    published_at: string | null;
    acknowledge_url: string;
};

type DashboardProps = {
    dashboard: { announcement: ReleaseAnnouncement | null };
};

type SharedProps = {
    auth: {
        user: { name: string; email: string } | null;
        roles: { name: string; slug: string }[];
        permissions: string[];
    };
    site: { name?: string; tagline?: string };
};

const workAreas = [
    { title: 'Patient services', description: 'Registration, patient records, appointments and queue management.', icon: Users, status: 'Planned', detail: 'Patient administration workflows are not enabled yet.' },
    { title: 'Clinical care', description: 'Clinical encounters, nursing notes and care documentation.', icon: Stethoscope, status: 'Planned', detail: 'Clinical workflows will be added with their own access controls.' },
    { title: 'Diagnostics & medicines', description: 'Laboratory requests, results, pharmacy and dispensing.', icon: FlaskConical, status: 'Planned', detail: 'Laboratory and pharmacy modules are not enabled yet.' },
    { title: 'Billing & SHA claims', description: 'Patient billing, payments, eligibility and claim processing.', icon: ReceiptText, status: 'Planned', detail: 'Billing and SHA integration workflows are not enabled yet.' },
    { title: 'Inventory & procurement', description: 'Stock, stores, supplies and procurement workflows.', icon: Boxes, status: 'Planned', detail: 'Inventory and procurement modules are not enabled yet.' },
    { title: 'Facility administration', description: 'Staff access, role assignments, configuration and oversight.', icon: Hospital, status: 'Foundation', detail: 'Access foundations exist; individual management screens are being built.' },
];

function ReleaseDetails({ release }: { release: ReleaseAnnouncement }) {
    const sections = [
        { title: 'What’s new', items: release.features, icon: Sparkles },
        { title: 'Improvements', items: release.improvements, icon: CheckCircle2 },
        { title: 'Fixes', items: release.bug_fixes, icon: ShieldCheck },
        { title: 'Security notes', items: release.security_notes, icon: ShieldCheck },
        { title: 'Known issues', items: release.known_issues, icon: Clock3 },
    ].filter((section) => section.items.length > 0);

    return (
        <div className="space-y-3">
            {release.release_notes && <p className="rounded-lg bg-muted/60 p-3 text-sm leading-6 whitespace-pre-line">{release.release_notes}</p>}
            {sections.map((section) => (
                <section key={section.title} className="space-y-1.5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold"><section.icon className="size-4 text-primary" />{section.title}</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {section.items.map((item, index) => <li key={`${section.title}-${index}`}>{item}</li>)}
                    </ul>
                </section>
            ))}
        </div>
    );
}

export default function Dashboard({ dashboard: dashboardData }: DashboardProps) {
    const { auth, site } = usePage().props as unknown as SharedProps;
    const [acknowledging, setAcknowledging] = useState(false);
    const [announcementExpanded, setAnnouncementExpanded] = useState(false);
    const announcement = dashboardData.announcement;
    const roles = auth.roles ?? [];
    const permissions = auth.permissions ?? [];

    const acknowledgeAnnouncement = () => {
        if (!announcement || acknowledging) return;
        setAcknowledging(true);
        router.post(announcement.acknowledge_url, {}, {
            preserveScroll: true,
            onFinish: () => setAcknowledging(false),
        });
    };

    const publishedDate = announcement?.published_at
        ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(announcement.published_at))
        : null;

    return (
        <>
            <Head title="Dashboard" />
            <main className="mx-auto flex w-full min-w-0 max-w-[1800px] flex-1 flex-col gap-5 p-3 sm:gap-6 sm:p-5 xl:p-6">
                <AuthenticatedPageHeader
                    eyebrow="Staff workspace"
                    title={`Welcome back${auth.user?.name ? `, ${auth.user.name.split(' ')[0]}` : ''}`}
                    description={site.tagline || 'Your secure workspace for clinic operations.'}
                    actions={<Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5"><ShieldCheck className="size-3.5 text-primary" />Access-controlled workspace</Badge>}
                />

                <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
                    <AuthenticatedSectionCard title={site.name || 'Ivona Wayside Clinic'} description="Clinical and administrative workspace" icon={HeartPulse}>
                        <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
                            Your workspace is organized around your assigned roles and effective permissions. The overview below shows the planned service areas and their current readiness without presenting placeholder patient or financial figures as real data.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {roles.length ? roles.map((role) => <Badge key={role.slug} variant="secondary" className="font-medium">{role.name}</Badge>) : <Badge variant="outline">No active role assigned</Badge>}
                            <Badge variant="outline">{permissions.length} effective permissions</Badge>
                        </div>
                    </AuthenticatedSectionCard>

                    <AuthenticatedSectionCard title="Your account" description="Profile and security shortcuts" icon={ShieldCheck}>
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                            <Link href={profileEdit()} title="Open profile details" className="group flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border/80 px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
                                <span className="flex min-w-0 items-center gap-2"><FileText className="size-4 shrink-0 text-muted-foreground" /><span className="truncate">Profile details</span></span><ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link href={securityEdit()} title="Open security settings" className="group flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border/80 px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
                                <span className="flex min-w-0 items-center gap-2"><ShieldCheck className="size-4 shrink-0 text-muted-foreground" /><span className="truncate">Security settings</span></span><ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </AuthenticatedSectionCard>
                </section>

                <section className="space-y-3">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Service areas</h2>
                            <p className="text-sm text-muted-foreground">A clear view of the main HMIS work areas and their current readiness.</p>
                        </div>
                        <Link href={changelogRoute()} title="Read all published release notes" className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline">What’s New <ArrowRight className="size-4" /></Link>
                    </div>
                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                        {workAreas.map((area) => (
                            <Card key={area.title} className="group min-w-0 gap-0 border-border/80 shadow-sm transition-colors hover:border-primary/30">
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><area.icon className="size-5" /></span>
                                        <Badge variant={area.status === 'Foundation' ? 'secondary' : 'outline'} className="shrink-0">{area.status}</Badge>
                                    </div>
                                    <h3 className="mt-4 text-sm font-semibold">{area.title}</h3>
                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{area.description}</p>
                                    <p className="mt-3 border-t border-border/70 pt-3 text-xs leading-5 text-muted-foreground">{area.detail}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="grid min-w-0 gap-4 lg:grid-cols-2">
                    <AuthenticatedSectionCard title="Access & governance" description="Access is based on assigned roles and permissions." icon={ShieldCheck}>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><CheckCircle2 className="size-4" /></span><div><p className="text-sm font-medium">Role-aware navigation</p><p className="text-sm leading-5 text-muted-foreground">Menu visibility follows your effective permissions. Planned modules remain disabled.</p></div></div>
                            <div className="flex items-start gap-3"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheck className="size-4" /></span><div><p className="text-sm font-medium">Server-side authorization</p><p className="text-sm leading-5 text-muted-foreground">Backend routes and actions must independently enforce access and applicable scope.</p></div></div>
                        </div>
                    </AuthenticatedSectionCard>
                    <AuthenticatedSectionCard title="System updates" description="Keep track of published improvements and release notices." icon={BookOpenText} action={<Link href={changelogRoute()} title="View release history" className="text-sm font-medium text-primary hover:underline">Release history</Link>}>
                        <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary"><Activity className="size-4" /></span>
                            <div className="min-w-0"><p className="text-sm font-medium">Release notes</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Published release notes appear here when a release needs your acknowledgement. Previously acknowledged releases stay dismissed for your account.</p></div>
                        </div>
                    </AuthenticatedSectionCard>
                </section>
            </main>

            {announcement && (
                <section aria-label="New release announcement" className="fixed inset-x-3 bottom-3 z-50 mx-auto w-auto max-w-2xl overflow-hidden rounded-xl border border-primary/25 bg-background shadow-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(42rem,calc(100vw-3rem))]">
                    <div className="flex items-start gap-3 p-3 sm:p-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></div>
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2"><Badge className="rounded-full">What’s new</Badge><Badge variant="outline">v{announcement.version}</Badge></div>
                            <h2 className="text-sm font-semibold">{announcement.title}</h2>
                            <p className="text-sm leading-5 text-muted-foreground">{announcement.summary}</p>
                            {announcementExpanded && <div className="max-h-[38vh] overflow-y-auto pt-2"><ReleaseDetails release={announcement} />{publishedDate && <p className="mt-3 text-xs text-muted-foreground">Published {publishedDate}</p>}</div>}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                <Button type="button" size="sm" variant="outline" onClick={() => router.visit(changelogRoute().url)}>Full release notes</Button>
                                <Button type="button" size="sm" onClick={acknowledgeAnnouncement} disabled={acknowledging}>{acknowledging ? 'Saving…' : 'Don’t show again'}</Button>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                            <Button type="button" size="icon" variant="ghost" title={announcementExpanded ? 'Collapse release details' : 'Expand release details'} aria-label={announcementExpanded ? 'Collapse release details' : 'Expand release details'} onClick={() => setAnnouncementExpanded((value) => !value)}>{announcementExpanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}</Button>
                            <Button type="button" size="icon" variant="ghost" title="Don't show this release again" aria-label="Dismiss and do not show this release again" onClick={acknowledgeAnnouncement} disabled={acknowledging}><X className="size-4" /></Button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] satisfies BreadcrumbItem[],
};

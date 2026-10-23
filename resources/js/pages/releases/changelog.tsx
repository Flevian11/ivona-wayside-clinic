import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    BookOpenText,
    Bug,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleHelp,
    Clock3,
    Code2,
    FileText,
    GitBranch,
    HeartPulse,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { changelog as changelogRoute } from '@/routes/releases';
import { dashboard } from '@/routes';

type Release = {
    id: number | string;
    version: string;
    title: string;
    release_type: string;
    summary: string;
    release_notes?: string | null;
    features?: string[] | null;
    improvements?: string[] | null;
    bug_fixes?: string[] | null;
    security_notes?: string[] | null;
    known_issues?: string[] | null;
    minimum_php_version?: string | null;
    minimum_database_version?: string | null;
    published_at?: string | null;
    created_at?: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginator<T> = {
    data: T[];
    links?: PaginationLink[];
    current_page?: number;
    last_page?: number;
    total?: number;
    from?: number | null;
    to?: number | null;
};

type Props = {
    releases: Paginator<Release> | Release[];
};

const releaseTypeLabel: Record<string, string> = {
    major: 'Major release',
    minor: 'Feature release',
    patch: 'Maintenance release',
    security: 'Security release',
    hotfix: 'Hotfix',
};

const typeStyle: Record<string, string> = {
    major: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
    minor: 'border-primary/30 bg-primary/10 text-primary',
    patch: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    security: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    hotfix: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

function dateLabel(value?: string | null) {
    if (!value) return 'Date not provided';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function asList(value?: string[] | null) {
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()) : [];
}

function ReleaseSection({
    title,
    description,
    items,
    icon: Icon,
    tone = 'default',
}: {
    title: string;
    description: string;
    items: string[];
    icon: typeof Sparkles;
    tone?: 'default' | 'warning';
}) {
    if (!items.length) return null;
    return (
        <section className="space-y-3">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${tone === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="grid gap-2 pl-0 sm:pl-12">
                {items.map((item, index) => (
                    <div key={`${title}-${index}`} className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 px-3.5 py-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary/80" />
                        <p className="text-sm leading-6 text-foreground/90">{item}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function ReleaseCard({ release, index }: { release: Release; index: number }) {
    const [expanded, setExpanded] = useState(index === 0);
    const features = asList(release.features);
    const improvements = asList(release.improvements);
    const fixes = asList(release.bug_fixes);
    const security = asList(release.security_notes);
    const issues = asList(release.known_issues);
    const totalItems = features.length + improvements.length + fixes.length + security.length + issues.length;
    const publishedDate = dateLabel(release.published_at ?? release.created_at);
    const releaseType = (release.release_type || 'patch').toLowerCase();

    return (
        <article id={`release-${release.version.replace(/[^a-zA-Z0-9-]/g, '-')}`} className="scroll-mt-6">
            <Card className="overflow-hidden border-border/80 shadow-sm transition-shadow hover:shadow-md">
                <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                <CardHeader className="gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3.5">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                            <GitBranch className="size-5" />
                        </div>
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="font-mono text-xs">v{release.version}</Badge>
                                <Badge variant="outline" className={typeStyle[releaseType] ?? typeStyle.patch}>
                                    {releaseTypeLabel[releaseType] ?? 'Release'}
                                </Badge>
                                {index === 0 && (
                                    <Badge className="gap-1"><Sparkles className="size-3" /> Latest</Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl leading-snug tracking-tight sm:text-2xl">{release.title}</CardTitle>
                            <CardDescription className="max-w-3xl text-sm leading-6">{release.summary}</CardDescription>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /> {publishedDate}</span>
                                <span className="inline-flex items-center gap-1.5"><FileText className="size-3.5" /> {totalItems} change{totalItems === 1 ? '' : 's'}</span>
                            </div>
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="shrink-0 gap-2 self-start" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
                        {expanded ? 'Collapse details' : 'Read full notes'}
                        <ChevronRight className={`size-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </Button>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-7 border-t bg-muted/15 px-4 py-6 sm:px-6">
                        {release.release_notes && (
                            <section className="rounded-2xl border border-primary/15 bg-background p-4 sm:p-5">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                    <BookOpenText className="size-4 text-primary" />
                                    Release overview
                                </div>
                                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{release.release_notes}</p>
                            </section>
                        )}

                        <ReleaseSection title="New capabilities" description="New functionality introduced in this release." items={features} icon={Sparkles} />
                        <ReleaseSection title="Improvements" description="Updates that refine existing workflows, clarity, and usability." items={improvements} icon={Wrench} />
                        <ReleaseSection title="Bug fixes" description="Corrections and reliability improvements included in this release." items={fixes} icon={Bug} />
                        <ReleaseSection title="Security and privacy" description="Security-relevant changes and operational guidance." items={security} icon={LockKeyhole} />
                        <ReleaseSection title="Known issues and limitations" description="Items to be aware of while using this version." items={issues} icon={CircleHelp} tone="warning" />

                        {(release.minimum_php_version || release.minimum_database_version) && (
                            <section className="rounded-2xl border bg-background p-4 sm:p-5">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                    <Code2 className="size-4 text-primary" /> Compatibility information
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {release.minimum_php_version && (
                                        <div className="rounded-xl bg-muted/50 p-3">
                                            <p className="text-xs text-muted-foreground">Minimum PHP version</p>
                                            <p className="mt-1 font-mono text-sm font-semibold">{release.minimum_php_version}</p>
                                        </div>
                                    )}
                                    {release.minimum_database_version && (
                                        <div className="rounded-xl bg-muted/50 p-3">
                                            <p className="text-xs text-muted-foreground">Database compatibility</p>
                                            <p className="mt-1 text-sm font-semibold">{release.minimum_database_version}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {!release.release_notes && totalItems === 0 && (
                            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                                Detailed notes have not been supplied for this release yet.
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </article>
    );
}

export default function Changelog({ releases: releasesProp }: Props) {
    const [query, setQuery] = useState('');
    const isPaginator = !Array.isArray(releasesProp);
    const releases = (Array.isArray(releasesProp) ? releasesProp : releasesProp?.data ?? []) as Release[];
    const pagination = !Array.isArray(releasesProp) ? releasesProp.links ?? [] : [];

    const filteredReleases = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return releases;
        return releases.filter((release) => [
            release.version,
            release.title,
            release.summary,
            release.release_type,
            release.release_notes,
            ...asList(release.features),
            ...asList(release.improvements),
            ...asList(release.bug_fixes),
            ...asList(release.security_notes),
            ...asList(release.known_issues),
        ].some((value) => String(value ?? '').toLowerCase().includes(needle)));
    }, [query, releases]);

    const total = !Array.isArray(releasesProp) ? releasesProp.total ?? releases.length : releases.length;
    const currentPage = !Array.isArray(releasesProp) ? releasesProp.current_page ?? 1 : 1;
    const lastPage = !Array.isArray(releasesProp) ? releasesProp.last_page ?? 1 : 1;

    return (
        <>
            <Head title="Release notes" />
            <main className="w-full min-w-0 flex-1">
                <div className="flex w-full max-w-none min-w-0 flex-col gap-5 p-3 sm:gap-6 sm:p-5 xl:p-6">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={dashboard()} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
                            <ArrowLeft className="size-3.5" /> Dashboard
                        </Link>
                        <span aria-hidden="true">/</span>
                        <span className="font-medium text-foreground">Release notes</span>
                    </nav>

                    <section className="relative isolate overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm sm:p-8">
                        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 -z-10 size-64 rounded-full bg-primary/10 blur-3xl" />
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="min-w-0 flex-1 space-y-4">
                                <Badge variant="outline" className="gap-1.5 rounded-full border-primary/25 bg-background/70 px-3 py-1">
                                    <HeartPulse className="size-3.5 text-primary" /> Ivona Wayside Clinic · Product updates
                                </Badge>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Release notes</h1>
                                    <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
                                        A clear record of what has changed across the clinic workspace — new capabilities,
                                        workflow improvements, fixes, security guidance, and known limitations.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium"><Sparkles className="size-3.5 text-primary" /> New capabilities</span>
                                    <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium"><ShieldCheck className="size-3.5 text-primary" /> Security notes</span>
                                    <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium"><Bug className="size-3.5 text-primary" /> Fixes and reliability</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 lg:min-w-64">
                                <div className="rounded-2xl border bg-background/80 p-4">
                                    <p className="text-xs font-medium text-muted-foreground">Releases listed</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{total}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Published updates</p>
                                </div>
                                <div className="rounded-2xl border bg-background/80 p-4">
                                    <p className="text-xs font-medium text-muted-foreground">Current view</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{currentPage}<span className="text-base text-muted-foreground">/{lastPage}</span></p>
                                    <p className="mt-1 text-xs text-muted-foreground">History pages</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                        <div className="relative">
                            <BookOpenText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search versions, features, fixes, or keywords…" className="h-11 rounded-xl bg-background pl-9" aria-label="Search release notes" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="rounded-full px-3 py-1">{filteredReleases.length} shown</Badge>
                            {query && <Button variant="ghost" size="sm" onClick={() => setQuery('')}>Clear search</Button>}
                        </div>
                    </section>

                    {filteredReleases.length > 0 ? (
                        <section className="space-y-4" aria-label="Published releases">
                            {filteredReleases.map((release, index) => (
                                <ReleaseCard key={release.id ?? release.version} release={release} index={index} />
                            ))}
                        </section>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                    {query ? <CircleHelp className="size-6" /> : <Clock3 className="size-6" />}
                                </div>
                                <h2 className="text-lg font-semibold">{query ? 'No matching release notes' : 'No published releases yet'}</h2>
                                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                    {query ? 'Try a different version number or keyword. Search includes the detailed notes and change lists.' : 'Published product updates will appear here when release notes are available.'}
                                </p>
                                {query && <Button className="mt-4" variant="outline" onClick={() => setQuery('')}>Clear search</Button>}
                            </CardContent>
                        </Card>
                    )}

                    {isPaginator && pagination.length > 0 && lastPage > 1 && (
                        <nav aria-label="Release history pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3">
                            <p className="px-2 text-sm text-muted-foreground">Page {currentPage} of {lastPage}</p>
                            <div className="flex flex-wrap gap-1">
                                {pagination.map((item, index) => (
                                    <Button
                                        key={`${item.label}-${index}`}
                                        size="sm"
                                        variant={item.active ? 'default' : 'outline'}
                                        disabled={!item.url}
                                        onClick={() => item.url && (window.location.href = item.url)}
                                        className="min-w-9"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: item.label }} />
                                    </Button>
                                ))}
                            </div>
                        </nav>
                    )}

                    <footer className="flex flex-col gap-2 border-t pt-5 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p className="inline-flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Release history for the Ivona Wayside Clinic workspace</p>
                        <Link href={dashboard()} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                            Back to dashboard <ArrowRight className="size-3.5" />
                        </Link>
                    </footer>
                </div>
            </main>
        </>
    );
}

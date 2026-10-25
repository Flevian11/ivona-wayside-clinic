import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    BookOpenText,
    Bug,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
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
    major: 'Major',
    minor: 'Feature',
    patch: 'Maintenance',
    security: 'Security',
    hotfix: 'Hotfix',
};

const typeStyle: Record<string, string> = {
    major: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/50 dark:bg-violet-950/30 dark:text-violet-300',
    minor: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300',
    patch: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300',
    security: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300',
    hotfix: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300',
};

function dateLabel(value?: string | null) {
    if (!value) return 'Date not provided';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function asList(value?: string[] | null) {
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()) : [];
}

function ReleaseSection({
    title,
    items,
    icon: Icon,
    tone = 'default',
}: {
    title: string;
    items: string[];
    icon: typeof Sparkles;
    tone?: 'default' | 'warning' | 'success' | 'danger';
}) {
    if (!items.length) return null;

    const toneConfig = {
        default: { iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', border: 'border-slate-100 dark:border-slate-800/60', check: 'text-emerald-500' },
        warning: { iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30', check: 'text-amber-500' },
        success: { iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/30', check: 'text-teal-500' },
        danger: { iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/30', check: 'text-rose-500' },
    }[tone];

    return (
        <section className="space-y-1.5">
            <div className="flex items-center gap-2">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${toneConfig.iconBg}`}>
                    <Icon className="h-3 w-3" />
                </div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">{title}</h3>
            </div>
            <div className="space-y-1 pl-8">
                {items.map((item, index) => (
                    <div key={`${title}-${index}`} className={`flex items-start gap-2 rounded-md border px-2 py-1.5 ${toneConfig.border}`}>
                        <CheckCircle2 className={`mt-0.5 h-3 w-3 shrink-0 ${toneConfig.check}`} />
                        <p className="text-[12px] leading-snug text-slate-600 dark:text-slate-300">{item}</p>
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
    const hasMeta = release.minimum_php_version || release.minimum_database_version;

    return (
        <article id={`release-${release.version.replace(/[^a-zA-Z0-9-]/g, '-')}`} className="scroll-mt-4 group">
            <Card className="overflow-hidden border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0f1a26] transition-all duration-200 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-[0_2px_16px_-4px_rgba(16,185,129,.15)]">
                <CardHeader className="p-3.5 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                                <GitBranch className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-wide border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0">
                                        v{release.version}
                                    </Badge>
                                    <Badge variant="outline" className={`text-[9px] uppercase tracking-wide border px-1.5 py-0 ${typeStyle[releaseType] ?? typeStyle.patch}`}>
                                        {releaseTypeLabel[releaseType] ?? 'Release'}
                                    </Badge>
                                    {index === 0 && (
                                        <Badge className="gap-0.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-[9px] uppercase tracking-wide px-1.5 py-0">
                                            <Sparkles className="h-2.5 w-2.5" /> Latest
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-sm sm:text-base leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                                    {release.title}
                                </CardTitle>
                                <CardDescription className="text-[12px] leading-snug text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {release.summary}
                                </CardDescription>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {publishedDate}</span>
                                    <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> {totalItems} change{totalItems === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 gap-1 self-start h-7 rounded-md px-2 text-[11px] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => setExpanded((value) => !value)}
                            aria-expanded={expanded}
                        >
                            {expanded ? 'Hide' : 'Notes'}
                            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>
                    </div>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20 px-3.5 py-3.5 sm:px-4">
                        {release.release_notes && (
                            <section className="rounded-lg border border-emerald-100/70 dark:border-emerald-900/30 bg-white dark:bg-slate-900 p-2.5">
                                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                    <BookOpenText className="h-3 w-3" />
                                    Overview
                                </div>
                                <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">{release.release_notes}</p>
                            </section>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <ReleaseSection title="New" items={features} icon={Sparkles} tone="success" />
                            <ReleaseSection title="Improved" items={improvements} icon={Wrench} tone="default" />
                            <ReleaseSection title="Fixed" items={fixes} icon={Bug} tone="danger" />
                            <ReleaseSection title="Security" items={security} icon={LockKeyhole} tone="warning" />
                        </div>

                        <ReleaseSection title="Known issues" items={issues} icon={CircleHelp} tone="warning" />

                        {hasMeta && (
                            <section className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
                                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                                    <Code2 className="h-3 w-3" />
                                    Compatibility
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {release.minimum_php_version && (
                                        <div className="rounded-md bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[9px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Min PHP</p>
                                            <p className="mt-0.5 font-mono text-[12px] font-semibold text-slate-900 dark:text-slate-100">{release.minimum_php_version}</p>
                                        </div>
                                    )}
                                    {release.minimum_database_version && (
                                        <div className="rounded-md bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[9px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Database</p>
                                            <p className="mt-0.5 text-[12px] font-semibold text-slate-900 dark:text-slate-100">{release.minimum_database_version}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {!release.release_notes && totalItems === 0 && (
                            <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 p-4 text-center text-[12px] text-slate-500 dark:text-slate-400">
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
            <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-3 py-4 md:px-5 md:py-5 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-3">

                    {/* BREADCRUMB */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <Link href={dashboard()} className="inline-flex items-center gap-1 transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
                            <ArrowLeft className="h-3 w-3" /> Dashboard
                        </Link>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-slate-900 dark:text-slate-100">Release notes</span>
                    </nav>

                    {/* COMPACT HERO */}
                    <section className="relative isolate overflow-hidden rounded-xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] dark:bg-none dark:bg-[#0f1a26] px-4 py-4 md:px-5 shadow-sm">
                        <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border-[24px] border-white/30 dark:border-white/[0.035]" />
                        <div className="absolute right-8 top-8 h-20 w-20 rounded-full bg-emerald-300/30 dark:bg-emerald-500/[0.08] blur-2xl" />

                        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 space-y-1.5">
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-900/10 bg-white/65 dark:border-emerald-400/20 dark:bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.15em] text-emerald-900 dark:text-emerald-300">
                                    <HeartPulse className="h-2.5 w-2.5" /> Ivona Wayside Clinic
                                </span>
                                <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-2xl">Release notes</h1>
                                <p className="max-w-xl text-[12px] leading-snug text-slate-600 dark:text-slate-300">
                                    What's changed across the clinic workspace — capabilities, improvements, fixes, and security.
                                </p>
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/50 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50 px-1.5 py-0.5 text-[9px] font-medium text-slate-700 dark:text-slate-300"><Sparkles className="h-2.5 w-2.5 text-emerald-600" /> New</span>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/50 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50 px-1.5 py-0.5 text-[9px] font-medium text-slate-700 dark:text-slate-300"><ShieldCheck className="h-2.5 w-2.5 text-emerald-600" /> Security</span>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/50 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50 px-1.5 py-0.5 text-[9px] font-medium text-slate-700 dark:text-slate-300"><Bug className="h-2.5 w-2.5 text-emerald-600" /> Fixes</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="rounded-lg border border-white/60 bg-white/70 dark:border-slate-700 dark:bg-slate-800/70 px-3 py-2 shadow-sm backdrop-blur-sm">
                                    <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Releases</p>
                                    <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums leading-none mt-0.5">{total}</p>
                                </div>
                                <div className="rounded-lg border border-white/60 bg-white/70 dark:border-slate-700 dark:bg-slate-800/70 px-3 py-2 shadow-sm backdrop-blur-sm">
                                    <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Page</p>
                                    <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums leading-none mt-0.5">{currentPage}<span className="text-xs text-slate-400 dark:text-slate-500">/{lastPage}</span></p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SEARCH */}
                    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="relative flex-1 max-w-md">
                            <BookOpenText className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search versions, features, fixes…"
                                className="h-8 rounded-lg bg-white dark:bg-[#0f1a26] border-slate-200 dark:border-slate-800 pl-8 text-[12px] shadow-sm focus-visible:ring-emerald-500"
                                aria-label="Search release notes"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <Badge variant="secondary" className="rounded-md px-1.5 py-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-medium uppercase tracking-wide">
                                {filteredReleases.length} shown
                            </Badge>
                            {query && (
                                <Button variant="ghost" size="sm" onClick={() => setQuery('')} className="h-7 px-2 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                                    Clear
                                </Button>
                            )}
                        </div>
                    </section>

                    {/* RELEASE LIST */}
                    {filteredReleases.length > 0 ? (
                        <section className="space-y-2.5" aria-label="Published releases">
                            {filteredReleases.map((release, index) => (
                                <ReleaseCard key={release.id ?? release.version} release={release} index={index} />
                            ))}
                        </section>
                    ) : (
                        <Card className="border-dashed border-slate-200 dark:border-slate-800 bg-transparent shadow-none">
                            <CardContent className="flex flex-col items-center justify-center px-4 py-10 text-center">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                    {query ? <CircleHelp className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                                </div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{query ? 'No matching release notes' : 'No published releases yet'}</h2>
                                <p className="mt-1 max-w-md text-[12px] leading-snug text-slate-500 dark:text-slate-400">
                                    {query ? 'Try a different version number or keyword.' : 'Published updates will appear here when available.'}
                                </p>
                                {query && (
                                    <Button className="mt-3 h-7 rounded-md text-[11px]" variant="outline" onClick={() => setQuery('')}>
                                        Clear search
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* PAGINATION */}
                    {isPaginator && pagination.length > 0 && lastPage > 1 && (
                        <nav aria-label="Release history pagination" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0f1a26] px-2.5 py-2 shadow-sm">
                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Page {currentPage} of {lastPage}</p>
                            <div className="flex flex-wrap gap-1">
                                {pagination.map((item, index) => (
                                    <Button
                                        key={`${item.label}-${index}`}
                                        size="sm"
                                        variant={item.active ? 'default' : 'outline'}
                                        disabled={!item.url}
                                        onClick={() => item.url && (window.location.href = item.url)}
                                        className={`min-w-7 h-7 px-2 text-[11px] rounded-md ${item.active ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: item.label }} />
                                    </Button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* FOOTER */}
                    <footer className="flex flex-col gap-1.5 border-t border-slate-200/70 dark:border-slate-800 pt-3 pb-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                        <p className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3 text-emerald-600" /> Release history for the Ivona Wayside Clinic workspace</p>
                        <Link href={dashboard()} className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline">
                            Back to dashboard <ArrowRight className="h-2.5 w-2.5" />
                        </Link>
                    </footer>
                </div>
            </main>
        </>
    );
}
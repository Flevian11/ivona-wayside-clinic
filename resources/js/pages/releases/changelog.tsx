import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft, ArrowRight, BadgeCheck, BookOpenText, Bug, CalendarDays,
    CheckCircle2, ChevronDown, ChevronUp, CircleHelp, Clock3, Code2, FileText,
    GitBranch, HeartPulse, LockKeyhole, ShieldCheck, Sparkles, Wrench, Activity,
    TrendingUp, Layers, Filter, Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { changelog as changelogRoute } from '@/routes/releases';
import { dashboard } from '@/routes';

/* ------------------------------ Types (unchanged) ----------------------------- */

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

type PaginationLink = { url: string | null; label: string; active: boolean };
type Paginator<T> = { data: T[]; links?: PaginationLink[]; current_page?: number; last_page?: number; total?: number; from?: number | null; to?: number | null };
type Props = { releases: Paginator<Release> | Release[] };

const releaseTypeLabel: Record<string, string> = {
    major: 'Major', minor: 'Feature', patch: 'Maintenance', security: 'Security', hotfix: 'Hotfix',
};

const typeStyle: Record<string, { badge: string, border: string, icon: string }> = {
    major: { badge: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/50 dark:bg-violet-950/30 dark:text-violet-300', border: 'border-l-violet-500', icon: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
    minor: { badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300', border: 'border-l-emerald-500', icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
    patch: { badge: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300', border: 'border-l-sky-500', icon: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300' },
    security: { badge: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300', border: 'border-l-amber-500', icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
    hotfix: { badge: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300', border: 'border-l-rose-500', icon: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
};

function dateLabel(value?: string | null) {
    if (!value) return 'Date not provided';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}
function asList(value?: string[] | null) {
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()) : [];
}

/* -------------------------------- Sub-components ------------------------------- */

function ReleaseSection({ title, items, icon: Icon, tone = 'default' }: { title: string; items: string[]; icon: typeof Sparkles; tone?: 'default' | 'warning' | 'success' | 'danger'; }) {
    if (!items.length) return null;
    const toneConfig = {
        default: { iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', border: 'border-slate-100 dark:border-slate-800/60', check: 'text-emerald-500' },
        warning: { iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30', check: 'text-amber-500' },
        success: { iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/30', check: 'text-teal-500' },
        danger: { iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/30', check: 'text-rose-500' },
    }[tone];

    return (
        <section className="space-y-2">
            <div className="flex items-center gap-2">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${toneConfig.iconBg}`}>
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{title}</h3>
            </div>
            <div className="space-y-1.5 pl-8">
                {items.map((item, index) => (
                    <div key={`${title}-${index}`} className={`flex items-start gap-2 rounded-lg border bg-white px-2.5 py-2 shadow-sm ${toneConfig.border}`}>
                        <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${toneConfig.check}`} />
                        <p className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">{item}</p>
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
    const style = typeStyle[releaseType] ?? typeStyle.patch;

    return (
        <article id={`release-${release.version.replace(/[^a-zA-Z0-9-]/g, '-')}`} className="scroll-mt-4 group">
            <Card className={`overflow-hidden border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0f1a26] shadow-sm transition-all duration-300 hover:shadow-md border-l-4 ${style.border}`}>
                <CardHeader className="p-4 sm:p-5 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${style.icon}`}>
                                <GitBranch className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 shadow-sm">
                                        v{release.version}
                                    </Badge>
                                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold border px-2 py-0.5 ${style.badge}`}>
                                        {releaseTypeLabel[releaseType] ?? 'Release'}
                                    </Badge>
                                    {index === 0 && (
                                        <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm">
                                            <Sparkles className="h-3 w-3" /> Latest
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-base sm:text-lg leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                                    {release.title}
                                </CardTitle>
                                <CardDescription className="text-sm leading-snug text-slate-500 dark:text-slate-400">
                                    {release.summary}
                                </CardDescription>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-slate-400" /> {publishedDate}</span>
                                    <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-slate-400" /> {totalItems} change{totalItems === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 gap-1.5 self-start h-8 rounded-lg px-3 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            {expanded ? 'Hide' : 'Details'}
                            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </Button>
                    </div>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 px-4 py-4 sm:px-5" style={{ animation: 'cardIn 0.3s ease-out' }}>
                        {release.release_notes && (
                            <section className="rounded-xl border border-emerald-100/70 dark:border-emerald-900/30 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
                                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    <BookOpenText className="h-3.5 w-3.5" /> Overview
                                </div>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{release.release_notes}</p>
                            </section>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <ReleaseSection title="New" items={features} icon={Sparkles} tone="success" />
                            <ReleaseSection title="Improved" items={improvements} icon={Wrench} tone="default" />
                            <ReleaseSection title="Fixed" items={fixes} icon={Bug} tone="danger" />
                            <ReleaseSection title="Security" items={security} icon={LockKeyhole} tone="warning" />
                        </div>

                        <ReleaseSection title="Known issues" items={issues} icon={CircleHelp} tone="warning" />

                        {hasMeta && (
                            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm mt-2">
                                <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    <Code2 className="h-3.5 w-3.5" /> Compatibility
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {release.minimum_php_version && (
                                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <p className="text-[9px] uppercase tracking-wider text-slate-500">Min PHP</p>
                                            <p className="mt-0.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{release.minimum_php_version}</p>
                                        </div>
                                    )}
                                    {release.minimum_database_version && (
                                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <p className="text-[9px] uppercase tracking-wider text-slate-500">Database</p>
                                            <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-slate-100">{release.minimum_database_version}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {!release.release_notes && totalItems === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                                Detailed notes have not been supplied for this release yet.
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </article>
    );
}

/* ---------------------------------- Page --------------------------------- */

export default function Changelog({ releases: releasesProp }: Props) {
    const [query, setQuery] = useState('');
    const isPaginator = !Array.isArray(releasesProp);
    const releases = (Array.isArray(releasesProp) ? releasesProp : releasesProp?.data ?? []) as Release[];
    const pagination = !Array.isArray(releasesProp) ? releasesProp.links ?? [] : [];

    const filteredReleases = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return releases;
        return releases.filter((release) => [
            release.version, release.title, release.summary, release.release_type, release.release_notes,
            ...asList(release.features), ...asList(release.improvements), ...asList(release.bug_fixes),
            ...asList(release.security_notes), ...asList(release.known_issues),
        ].some((value) => String(value ?? '').toLowerCase().includes(needle)));
    }, [query, releases]);

    const total = !Array.isArray(releasesProp) ? releasesProp.total ?? releases.length : releases.length;
    const currentPage = !Array.isArray(releasesProp) ? releasesProp.current_page ?? 1 : 1;
    const lastPage = !Array.isArray(releasesProp) ? releasesProp.last_page ?? 1 : 1;

    return (
        <>
            <Head title="Release notes" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-4">
                    
                    {/* BREADCRUMB */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        <Link href={dashboard()} className="inline-flex items-center gap-1 transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
                            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
                        </Link>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-slate-900 dark:text-slate-100">Release notes</span>
                    </nav>

                    {/* RICH HERO SECTION */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <HeartPulse className="h-3 w-3" /> Ivona Wayside Clinic
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
                                    Release notes <span className="text-emerald-700 dark:text-emerald-400">✦</span>
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    What's changed across the clinic workspace — capabilities, improvements, fixes, and security. Keep your team informed on new deployments.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> New features
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Security patches
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                        <Bug className="h-3.5 w-3.5 text-emerald-600" /> Bug fixes
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Panel - Stats */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6 flex flex-col justify-between">
                            <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[26px] border-white/[.08]" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100">
                                    <Activity className="h-3 w-3" /> Pulse
                                </span>
                                <h2 className="mt-3 text-lg font-bold tracking-tight">Deployment Pulse</h2>
                                <p className="mt-1 text-[11px] leading-5 text-emerald-50/80">Tracking the latest clinical infrastructure updates.</p>
                                
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><Layers className="h-3 w-3" /> Total Releases</p>
                                        <p className="mt-1 text-2xl font-bold">{total}</p>
                                    </div>
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><FileText className="h-3 w-3" /> Current Page</p>
                                        <p className="mt-1 text-2xl font-bold">{currentPage}<span className="text-sm text-emerald-300/60 font-medium">/{lastPage}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SEARCH */}
                    <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search versions, features, fixes…"
                                    className="h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 pl-9 text-sm shadow-sm focus-visible:ring-emerald-500"
                                    aria-label="Search release notes"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="rounded-lg px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide">
                                    {filteredReleases.length} shown
                                </Badge>
                                {query && (
                                    <Button variant="outline" size="sm" onClick={() => setQuery('')} className="h-10 rounded-xl px-4 text-xs font-semibold text-slate-600 border-slate-200 dark:border-slate-700">
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* RELEASE LIST */}
                    {filteredReleases.length > 0 ? (
                        <section className="space-y-4" aria-label="Published releases">
                            {filteredReleases.map((release, index) => (
                                <ReleaseCard key={release.id ?? release.version} release={release} index={index} />
                            ))}
                        </section>
                    ) : (
                        <Card className="border-dashed border-slate-200 dark:border-slate-800 bg-transparent shadow-none py-10">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                    {query ? <CircleHelp className="h-6 w-6" /> : <Clock3 className="h-6 w-6" />}
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{query ? 'No matching release notes' : 'No published releases yet'}</h2>
                                <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                                    {query ? 'Try a different version number or keyword.' : 'Published updates will appear here when available.'}
                                </p>
                                {query && (
                                    <Button className="mt-4 h-9 rounded-xl px-5 text-xs font-semibold" variant="outline" onClick={() => setQuery('')}>
                                        Clear search
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* PAGINATION */}
                    {isPaginator && pagination.length > 0 && lastPage > 1 && (
                        <nav aria-label="Release history pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111c2d] px-4 py-3 shadow-sm">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Page {currentPage} of {lastPage}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {pagination.map((item, index) => (
                                    <Button
                                        key={`${item.label}-${index}`}
                                        size="sm"
                                        variant={item.active ? 'default' : 'outline'}
                                        disabled={!item.url}
                                        onClick={() => item.url && (window.location.href = item.url)}
                                        className={`min-w-8 h-8 px-2.5 text-xs font-semibold rounded-lg ${item.active ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm' : 'border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: item.label }} />
                                    </Button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* FOOTER */}
                    <footer className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 pb-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between mt-6">
                        <p className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Release history for the Ivona Wayside Clinic workspace</p>
                        <Link href={dashboard()} className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline font-semibold">
                            Back to dashboard <ArrowRight className="h-3 w-3" />
                        </Link>
                    </footer>
                </div>
            </main>
        </>
    );
}
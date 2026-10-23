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
    ChevronDown,
    ChevronRight,
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
    Activity,
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
    tone?: 'default' | 'warning' | 'success' | 'danger';
}) {
    if (!items.length) return null;

    const toneConfig = {
        default: { iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', border: 'border-slate-100 dark:border-slate-800/60', bg: 'bg-white dark:bg-slate-900/50', check: 'text-emerald-500' },
        warning: { iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30', bg: 'bg-amber-50/30 dark:bg-amber-950/10', check: 'text-amber-500' },
        success: { iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/30', bg: 'bg-teal-50/30 dark:bg-teal-950/10', check: 'text-teal-500' },
        danger: { iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/30', bg: 'bg-rose-50/30 dark:bg-rose-950/10', check: 'text-rose-500' },
    }[tone];

    return (
        <section className="space-y-3">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneConfig.iconBg}`}>
                    <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <div className="grid gap-2 pl-0 sm:pl-11">
                {items.map((item, index) => (
                    <div key={`${title}-${index}`} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 transition-colors hover:shadow-sm ${toneConfig.border} ${toneConfig.bg}`}>
                        <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${toneConfig.check}`} />
                        <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{item}</p>
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
        <article id={`release-${release.version.replace(/[^a-zA-Z0-9-]/g, '-')}`} className="scroll-mt-6 group">
            <Card className="overflow-hidden border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-[0_2px_12px_rgba(20,55,42,.03)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(20,55,42,.06)]">
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent opacity-80" />
                <CardHeader className="gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between p-5 md:p-6">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <GitBranch className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wide border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">v{release.version}</Badge>
                                <Badge variant="outline" className={`text-[10px] uppercase tracking-wide border ${typeStyle[releaseType] ?? typeStyle.patch}`}>
                                    {releaseTypeLabel[releaseType] ?? 'Release'}
                                </Badge>
                                {index === 0 && (
                                    <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-[10px] uppercase tracking-wide">
                                        <Sparkles className="h-3 w-3" /> Latest
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg md:text-xl leading-snug tracking-tight text-slate-900 dark:text-slate-100">{release.title}</CardTitle>
                            <CardDescription className="max-w-4xl text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{release.summary}</CardDescription>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {publishedDate}</span>
                                <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {totalItems} change{totalItems === 1 ? '' : 's'}</span>
                            </div>
                        </div>
                    </div>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="shrink-0 gap-2 self-start h-8 rounded-lg text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800" 
                        onClick={() => setExpanded((value) => !value)} 
                        aria-expanded={expanded}
                    >
                        {expanded ? 'Hide details' : 'Read notes'}
                        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/20 px-5 py-6 md:px-6">
                        {release.release_notes && (
                            <section className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-900 p-4 shadow-sm">
                                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                    <BookOpenText className="h-4 w-4" />
                                    Release overview
                                </div>
                                <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{release.release_notes}</p>
                            </section>
                        )}

                        {/* Using a fluid grid that expands to full width */}
                        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                            <ReleaseSection title="New capabilities" description="New functionality introduced." items={features} icon={Sparkles} tone="success" />
                            <ReleaseSection title="Improvements" description="Workflow and usability refinements." items={improvements} icon={Wrench} tone="default" />
                            <ReleaseSection title="Bug fixes" description="Corrections and reliability improvements." items={fixes} icon={Bug} tone="danger" />
                            <ReleaseSection title="Security and privacy" description="Security-relevant changes." items={security} icon={LockKeyhole} tone="warning" />
                        </div>
                        
                        <ReleaseSection title="Known issues and limitations" description="Items to be aware of while using this version." items={issues} icon={CircleHelp} tone="warning" />

                        {(release.minimum_php_version || release.minimum_database_version) && (
                            <section className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                                    <Code2 className="h-4 w-4" /> Compatibility information
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {release.minimum_php_version && (
                                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Minimum PHP version</p>
                                            <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{release.minimum_php_version}</p>
                                        </div>
                                    )}
                                    {release.minimum_database_version && (
                                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Database compatibility</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{release.minimum_database_version}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {!release.release_notes && totalItems === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
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
            {/* Changed from max-w-5xl to max-w-none w-full to use the full available width */}
            <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-5">
                    
                    {/* BREADCRUMB */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Link href={dashboard()} className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
                            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
                        </Link>
                        <span aria-hidden="true">/</span>
                        <span className="text-slate-900 dark:text-slate-100">Release notes</span>
                    </nav>

                    {/* HERO HEADER */}
                    <section className="relative isolate overflow-hidden rounded-2xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] dark:bg-none dark:bg-[#111c2d] p-6 md:p-8 shadow-sm">
                        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                        <div className="absolute right-12 top-12 h-24 w-24 rounded-full bg-emerald-300/30 dark:bg-emerald-500/[0.08] blur-2xl" />
                        
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="min-w-0 flex-1 space-y-4">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 dark:border-emerald-400/20 dark:bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:text-emerald-300">
                                    <HeartPulse className="h-3 w-3" /> Ivona Wayside Clinic
                                </span>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">Release notes</h1>
                                    <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                        A clear record of what has changed across the clinic workspace — new capabilities, workflow improvements, fixes, and security guidance.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50 px-2.5 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300"><Sparkles className="h-3 w-3 text-emerald-600" /> New capabilities</span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50 px-2.5 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300"><ShieldCheck className="h-3 w-3 text-emerald-600" /> Security notes</span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50 px-2.5 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300"><Bug className="h-3 w-3 text-emerald-600" /> Fixes & reliability</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 lg:min-w-[320px]">
                                <div className="rounded-xl border border-white/60 bg-white/70 dark:border-slate-700 dark:bg-slate-800/70 p-4 shadow-sm backdrop-blur-sm">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Releases listed</p>
                                    <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">{total}</p>
                                </div>
                                <div className="rounded-xl border border-white/60 bg-white/70 dark:border-slate-700 dark:bg-slate-800/70 p-4 shadow-sm backdrop-blur-sm">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Current view</p>
                                    <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">{currentPage}<span className="text-base text-slate-400 dark:text-slate-500">/{lastPage}</span></p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SEARCH BAR */}
                    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-xl">
                            <BookOpenText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input 
                                value={query} 
                                onChange={(event) => setQuery(event.target.value)} 
                                placeholder="Search versions, features, fixes…" 
                                className="h-10 rounded-xl bg-white dark:bg-[#111c2d] border-slate-200 dark:border-slate-800 pl-9 text-sm shadow-sm focus-visible:ring-emerald-500" 
                                aria-label="Search release notes" 
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Badge variant="secondary" className="rounded-md px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium uppercase tracking-wide">
                                {filteredReleases.length} shown
                            </Badge>
                            {query && (
                                <Button variant="ghost" size="sm" onClick={() => setQuery('')} className="h-8 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                                    Clear search
                                </Button>
                            )}
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
                        <Card className="border-dashed border-slate-200 dark:border-slate-800 bg-transparent shadow-none">
                            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                    {query ? <CircleHelp className="h-6 w-6" /> : <Clock3 className="h-6 w-6" />}
                                </div>
                                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{query ? 'No matching release notes' : 'No published releases yet'}</h2>
                                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                    {query ? 'Try a different version number or keyword. Search includes the detailed notes and change lists.' : 'Published product updates will appear here when release notes are available.'}
                                </p>
                                {query && (
                                    <Button className="mt-5 h-8 rounded-lg text-xs" variant="outline" onClick={() => setQuery('')}>
                                        Clear search
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* PAGINATION */}
                    {isPaginator && pagination.length > 0 && lastPage > 1 && (
                        <nav aria-label="Release history pagination" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-3 shadow-sm">
                            <p className="px-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">Page {currentPage} of {lastPage}</p>
                            <div className="flex flex-wrap gap-1">
                                {pagination.map((item, index) => (
                                    <Button
                                        key={`${item.label}-${index}`}
                                        size="sm"
                                        variant={item.active ? 'default' : 'outline'}
                                        disabled={!item.url}
                                        onClick={() => item.url && (window.location.href = item.url)}
                                        className={`min-w-8 h-8 text-xs rounded-lg ${item.active ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: item.label }} />
                                    </Button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* FOOTER */}
                    <footer className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 pb-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                        <p className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> Release history for the Ivona Wayside Clinic workspace</p>
                        <Link href={dashboard()} className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline">
                            Back to dashboard <ArrowRight className="h-3 w-3" />
                        </Link>
                    </footer>
                </div>
            </main>
        </>
    );
}
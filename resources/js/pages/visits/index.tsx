import { Head, Link, router } from '@inertiajs/react';
import { 
    CalendarClock, Search, UserRound, ArrowUpRight, ClipboardList, Activity, 
    MapPin, CheckCircle2, Clock3, Filter, Hash, Stethoscope, Fingerprint, 
    ShieldCheck, TrendingUp, CircleDot, Plus, ArrowRight, ListChecks, Loader2
} from 'lucide-react';
import { FormEvent, useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Visit = { id: number; encounter_number: string; patient_id: number; patient_name: string | null; medical_record_number: string | null; visit_type: string; status: string; priority: string; arrived_at: string | null; department: string | null; coverage_type: string | null; sha_eligibility_status: string | null; sha_benefit_code: string | null; sha_benefit_name: string | null; sha_sub_benefit_code: string | null; sha_sub_benefit_name: string | null; sha_preauthorization_status: string | null };
type Props = { visits: { data: Visit[]; current_page: number; last_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] }; filters: { q: string; status: string } };

/* ------------------------------ Helpers (unchanged) ----------------------------- */

const label = (value: string | null | undefined) => value ? value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—';
const date = (value: string | null) => value ? new Date(value).toLocaleString() : '—';

/* -------------------------------- Stat card ------------------------------- */

function StatCard({ label: title, value, caption, tone, icon: Icon, delay = 0 }: { label: string; value: number | string; caption: string; tone: 'emerald' | 'amber' | 'sky' | 'violet'; icon: typeof Activity; delay?: number; }) {
    const toneMap = {
        emerald: { icon: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300', line: '#10b981', glow: 'shadow-emerald-500/10' },
        amber: { icon: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300', line: '#f59e0b', glow: 'shadow-amber-500/10' },
        sky: { icon: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300', line: '#0ea5e9', glow: 'shadow-sky-500/10' },
        violet: { icon: 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300', line: '#8b5cf6', glow: 'shadow-violet-500/10' },
    } as const;
    const t = toneMap[tone];
    const bars = useMemo(() => { const seed = (typeof value === 'number' ? value : title.length) % 11; return Array.from({ length: 7 }, (_, i) => 25 + Math.round(Math.abs(Math.sin(i + seed)) * 60)); }, [value, title]);
    
    return (
        <article className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111c2d] ${t.glow}`} style={{ animation: `cardIn .5s ease-out ${delay}ms both` }}>
            <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.icon}`}><Icon className="h-5 w-5" /></div>
                <div className="flex h-9 items-end gap-[3px]">{bars.map((h, i) => <span key={i} className="w-1 rounded-sm opacity-60 transition-all duration-500 group-hover:opacity-90" style={{ height: `${h}%`, background: t.line }} />)}</div>
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
            <div className="mt-1 flex items-end justify-between gap-2">
                <strong className="text-2xl font-semibold leading-none tracking-tight text-slate-950 tabular-nums dark:text-slate-50">{value}</strong>
            </div>
            <p className="mt-2 truncate text-[11px] text-slate-500 dark:text-slate-400">{caption}</p>
        </article>
    );
}

/* ---------------------------------- Page --------------------------------- */

export default function VisitsIndex({ visits, filters }: Props) {
    const [q, setQ] = useState(filters.q || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isSearching, setIsSearching] = useState(false);
    
    // Use a ref to prevent the initial mount from triggering a redundant search
    const isFirstRun = useRef(true);

    // Derived stats
    const activeCount = visits.data.filter(v => ['started', 'registered', 'arrived', 'triaged', 'in_progress'].includes(v.status)).length;
    const completedCount = visits.data.filter(v => v.status === 'completed').length;
    const shaCount = visits.data.filter(v => v.coverage_type === 'sha' || !!v.sha_eligibility_status).length;

    const statusOptions = [
        { value: '', label: 'All', icon: ListChecks },
        { value: 'in_progress', label: 'In Progress', icon: Activity },
        { value: 'completed', label: 'Completed', icon: CheckCircle2 },
        { value: 'cancelled', label: 'Cancelled', icon: Clock3 },
    ];

    // Real-time Debounced Search & Filter
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            router.get('/visits', { q, status }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            });
        }, 350); // 350ms debounce

        return () => clearTimeout(timer);
    }, [q, status]);

    // Handle form submit (Enter key) to bypass debounce if needed
    const submit = (e: FormEvent) => { 
        e.preventDefault(); 
        setIsSearching(true);
        router.get('/visits', { q, status }, { 
            preserveState: true, 
            preserveScroll: true,
            onFinish: () => setIsSearching(false)
        }); 
    };

    return (
        <>
            <Head title="Visits" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .visit-row { animation: rowIn .35s ease-out both; }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] px-4 py-5 text-slate-900 transition-colors dark:bg-[#08131a] dark:text-slate-100 md:px-6 md:py-6">
                <div className="mx-auto w-full max-w-none space-y-4">
                    
                    {/* HERO SECTION */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <CalendarClock className="h-3 w-3" /> Patient care · Encounters
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">Visits <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    Track active and completed outpatient, inpatient, emergency and follow-up encounters. Open a visit workspace to continue clinical care.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    <Button asChild className="h-9 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                                        <Link href="/patients/create"><Plus className="mr-2 h-4 w-4"/>Register patient</Link>
                                    </Button>
                                </div>
                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[
                                        { k: 'Total Visits', v: visits.total, i: ClipboardList }, 
                                        { k: 'Active (Page)', v: activeCount, i: Activity }, 
                                        { k: 'Completed (Page)', v: completedCount, i: CheckCircle2 }
                                    ].map((m) => (
                                        <div key={m.k} className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-2.5 py-1.5 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
                                            <m.i className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.k}</p>
                                                <p className="text-sm font-bold leading-tight tabular-nums text-slate-900 dark:text-slate-100">{m.v}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT HERO - Pulse Panel */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6 flex flex-col justify-between">
                            <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[26px] border-white/[.08]" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100">
                                    <TrendingUp className="h-3 w-3" /> Visit Workload
                                </span>
                                <h2 className="mt-3 text-lg font-bold tracking-tight">{activeCount} active encounters</h2>
                                <p className="mt-1 text-[11px] leading-5 text-emerald-50/80">
                                    Current page snapshot. Completed and cancelled visits remain in the register for audit and review.
                                </p>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><Stethoscope className="h-3 w-3" /> Clinical Load</p>
                                        <p className="mt-1 text-xl font-bold">{activeCount} <span className="text-xs font-normal text-emerald-200">pending</span></p>
                                    </div>
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><Fingerprint className="h-3 w-3" /> SHA Linked</p>
                                        <p className="mt-1 text-xl font-bold">{shaCount} <span className="text-xs font-normal text-emerald-200">visits</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STAT CARDS */}
                    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <StatCard label="Matching visits" value={visits.total} caption="Matches current filter" tone="sky" icon={ClipboardList} delay={0} />
                        <StatCard label="Active (page)" value={activeCount} caption="Requires clinical action" tone={activeCount > 0 ? 'amber' : 'emerald'} icon={Activity} delay={40} />
                        <StatCard label="Completed (page)" value={completedCount} caption="Ready for closure/billing" tone="emerald" icon={CheckCircle2} delay={80} />
                        <StatCard label="SHA coverage" value={shaCount} caption="Linked to SHA workflows" tone="violet" icon={ShieldCheck} delay={120} />
                    </section>

                    {/* FILTER BAR (Real-time) */}
                    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#111c2d] sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            {isSearching ? (
                                <Loader2 className="absolute left-3 top-3 h-4 w-4 animate-spin text-emerald-500" />
                            ) : (
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            )}
                            <Input 
                                value={q} 
                                onChange={e => setQ(e.target.value)} 
                                placeholder="Search patient name, MRN or visit number..." 
                                className="h-10 border-slate-200 pl-9 dark:border-slate-700 dark:bg-slate-900 focus-visible:ring-emerald-500" 
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((opt) => (
                                <button 
                                    key={opt.value} 
                                    type="button" 
                                    onClick={() => setStatus(opt.value)} 
                                    className={`inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${status === opt.value ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                                >
                                    <opt.icon className="h-3.5 w-3.5" />{opt.label}
                                </button>
                            ))}
                        </div>
                        <Button type="submit" className="h-10 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 hidden sm:flex">
                            <Filter className="mr-2 h-4 w-4" /> Apply
                        </Button>
                    </form>

                    {/* TABLE */}
                    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Visit register</h2>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Latest encounters first. Open a visit workspace to continue or complete the encounter.</p>
                            </div>
                            {isSearching && <span className="text-[10px] font-semibold text-emerald-600 animate-pulse">Updating...</span>}
                        </div>
                        
                        {visits.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[950px] text-left text-sm">
                                    <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                        <tr>
                                            {['Visit / patient', 'Type & coverage', 'Department', 'Arrival', 'Status', ''].map(x => <th key={x} className="px-5 py-3 font-semibold">{x}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {visits.data.map((v, i) => (
                                            <tr key={v.id} className="visit-row transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30" style={{ animationDelay: `${i * 25}ms` }}>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-2.5">
                                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                                            <Hash className="h-3.5 w-3.5" />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{v.encounter_number}</p>
                                                            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                                <UserRound className="h-3 w-3 text-slate-400" />{v.patient_name || 'Name unavailable'}
                                                            </p>
                                                            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{v.medical_record_number || 'No MRN'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">{label(v.visit_type)}</p>
                                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            {label(v.coverage_type)}
                                                        </span>
                                                        {v.sha_eligibility_status && (
                                                            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${v.sha_eligibility_status === 'eligible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60'}`}>
                                                                Elig: {label(v.sha_eligibility_status)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {v.sha_benefit_name && (
                                                        <div className="mt-2 space-y-0.5 rounded-lg border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-900/30">
                                                            <p className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                                                <ShieldCheck className="h-3 w-3" /> {v.sha_benefit_name}
                                                            </p>
                                                            {v.sha_sub_benefit_name && <p className="text-[10px] font-medium text-teal-700 dark:text-teal-400">↳ {v.sha_sub_benefit_name}</p>}
                                                            {v.sha_preauthorization_status && <p className="text-[10px] text-slate-500">Preauth: {label(v.sha_preauthorization_status)}</p>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        <MapPin className="h-3 w-3 text-slate-400" />
                                                        {v.department || '—'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-[11px] text-slate-600 dark:text-slate-300">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock3 className="h-3 w-3 text-slate-400" />
                                                        {date(v.arrived_at)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                        v.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 
                                                        v.status === 'cancelled' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                                    }`}>
                                                        {label(v.status)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Button variant="ghost" size="sm" asChild className="h-8 rounded-lg px-2.5 text-xs text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50">
                                                        <Link href={`/visits/${v.id}`} aria-label="Open visit workspace">
                                                            Open <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-16 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800/50">
                                    <CalendarClock className="h-6 w-6" />
                                </div>
                                <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">No visits found</h3>
                                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">No encounters match these filters. Register or open a patient to start a visit, then return here to track it.</p>
                                <Button className="mt-4 h-9 rounded-xl bg-emerald-700 px-5 text-xs text-white" asChild>
                                    <Link href="/patients/create">Start patient registration</Link>
                                </Button>
                            </div>
                        )}

                        {/* PAGINATION */}
                        {visits.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                                <span className="text-[11px] font-medium text-slate-500">Page {visits.current_page} of {visits.last_page}</span>
                                <div className="flex flex-wrap gap-1">
                                    {visits.links.map((link, i) => (
                                        <Button key={i} size="sm" variant={link.active ? 'default' : 'outline'} className={`h-8 rounded-lg text-xs ${link.active ? 'bg-emerald-700 text-white shadow-sm' : 'border-slate-200 dark:border-slate-700'}`} disabled={!link.url} onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}>
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
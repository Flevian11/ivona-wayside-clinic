import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Fixed missing import for the alert icon
import { AlertCircle as AlertCircle2 } from 'lucide-react';

import {
    ClipboardList, Search, ArrowUpRight, ShieldCheck, Clock3, CheckCircle2, AlertTriangle, Eye, X,
    Activity, TrendingUp, TrendingDown, ServerCrash, FileCheck2, CircleDot, ChevronRight, User, 
    CalendarClock, FlaskConical, Quote, Sparkles, Minus, Hash, BadgeCheck, Banknote, ListChecks,
    HeartPulse, ArrowRight, ShieldAlert, Fingerprint, Stethoscope, Filter, ReceiptText
} from 'lucide-react';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Claim = {
    id: number; encounter_number: string; patient_name: string | null; medical_record_number: string | null;
    visit_type: string; visit_status: string; eligibility: string | null; preauthorization: string | null;
    invoice_status: string | null; invoice_total: number; claim_status: string | null; claim_reference: string | null;
    claim_submitted_at: string | null; benefit: string | null; can_review: boolean; clinical_assessment: string | null;
    icd11_code: string | null; icd11_display: string | null; billing_items: { code?: string; description?: string; quantity?: number | string; unit_price?: number | string }[];
    claim_submitter: string | null; claim_transaction_status: string | null; claim_environment: string | null; claim_provider_reference: string | null;
    created_at: string | null; visit_completed_at: string | null;
};
type Props = {
    claims: { data: Claim[]; current_page: number; last_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: { q: string; status: string }; canSubmit: boolean; environment: string;
};

/* ------------------------------ Helpers (unchanged) ----------------------------- */

const label = (s: string | null | undefined) => s ? s.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Not recorded';
const money = (n: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n || 0);
const date = (s: string | null) => s ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(s)) : '—';

/* --------------------------------- Pills --------------------------------- */

function StatusPill({ tone, icon: Icon, children, className = '' }: { tone: 'success' | 'danger' | 'warn' | 'info' | 'muted' | 'violet'; icon?: typeof CircleDot; children: React.ReactNode; className?: string; }) {
    const map = {
        success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
        danger: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60',
        warn: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
        info: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60',
        muted: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        violet: 'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/60',
    } as const;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[tone]} ${className}`}>
            {Icon && <Icon className="h-2.5 w-2.5" />}
            {children}
        </span>
    );
}

/* -------------------------------- Stat card ------------------------------- */

function StatCard({ label: title, value, caption, tone, icon: Icon, trend, delay = 0 }: { label: string; value: number | string; caption: string; tone: 'emerald' | 'amber' | 'sky' | 'rose'; icon: typeof Activity; trend?: { dir: 'up' | 'down' | 'flat'; text: string }; delay?: number; }) {
    const toneMap = {
        emerald: { icon: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300', line: '#10b981', glow: 'shadow-emerald-500/10' },
        amber: { icon: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300', line: '#f59e0b', glow: 'shadow-amber-500/10' },
        sky: { icon: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300', line: '#0ea5e9', glow: 'shadow-sky-500/10' },
        rose: { icon: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300', line: '#f43f5e', glow: 'shadow-rose-500/10' },
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
                {trend && <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${trend.dir === 'up' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{trend.dir === 'up' ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}{trend.text}</span>}
            </div>
            <p className="mt-2 truncate text-[11px] text-slate-500 dark:text-slate-400">{caption}</p>
        </article>
    );
}

/* ------------------------------ Hero side panel ---------------------------- */

function HeroSidePanel({ submitted, outstanding, failed, total, totalValue, environment, canSubmit }: { submitted: number; outstanding: number; failed: number; total: number; totalValue: number; environment: string; canSubmit: boolean; }) {
    const pct = total ? Math.round((submitted / total) * 100) : 0;
    const r = 36; const c = 2 * Math.PI * r; const dash = (pct / 100) * c;
    const segments = [
        { label: 'Submitted', value: submitted, color: '#10b981', bg: 'bg-emerald-500' },
        { label: 'Outstanding', value: outstanding, color: '#f59e0b', bg: 'bg-amber-500' },
        { label: 'Failed', value: failed, color: '#f43f5e', bg: 'bg-rose-500' },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/70">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
            <div className="relative flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0">
                    <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                        <circle cx="44" cy="44" r={r} fill="none" className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeWidth="8" />
                        <circle cx="44" cy="44" r={r} fill="none" stroke="url(#submitGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} className="transition-all duration-1000" />
                        <defs><linearGradient id="submitGrad" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#0ea5e9" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Submitted</span><strong className="text-xl font-bold text-slate-900 dark:text-slate-100">{pct}%</strong></div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submission health · this page</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{submitted} of {total} encounters sent</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <StatusPill tone={environment === 'production' ? 'success' : 'warn'} icon={Fingerprint}>{environment}</StatusPill>
                        <StatusPill tone={canSubmit ? 'success' : 'muted'} icon={ShieldCheck}>{canSubmit ? 'Submit access' : 'Read-only'}</StatusPill>
                    </div>
                </div>
            </div>
            <div className="relative mt-4 space-y-2">
                {segments.map((s) => (
                    <div key={s.label} className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${s.bg}`} /><span className="flex-1 text-[11px] text-slate-600 dark:text-slate-300">{s.label}</span><strong className="text-xs text-slate-900 dark:text-slate-100">{s.value}</strong><span className="w-9 text-right text-[9px] text-slate-400">{total ? Math.round((s.value / total) * 100) : 0}%</span></div>
                ))}
            </div>
            <div className="relative mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 dark:border-emerald-900/40 dark:bg-emerald-900/10">
                <div className="flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /><span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Invoiced</span></div>
                <strong className="text-sm font-bold tabular-nums text-emerald-900 dark:text-emerald-200">{money(totalValue)}</strong>
            </div>
        </div>
    );
}

/* ---------------------------------- Page --------------------------------- */

export default function ShaClaimsIndex({ claims, filters, canSubmit, environment }: Props) {
    const [q, setQ] = useState(filters.q || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [view, setView] = useState<Claim | null>(null);

    const submit = (e: FormEvent) => { e.preventDefault(); router.get('/operations/sha-claims', { q, status }, { preserveState: true, preserveScroll: true }); };

    const submitted = claims.data.filter(c => !!c.claim_submitted_at).length;
    const outstanding = claims.data.filter(c => !c.claim_submitted_at).length;
    const failed = claims.data.filter(c => ['failed', 'rejected', 'error'].includes((c.claim_status || '').toLowerCase())).length;
    const totalValue = useMemo(() => claims.data.reduce((n, c) => n + (c.invoice_total || 0), 0), [claims.data]);
    
    const submittedPct = claims.data.length ? Math.round((submitted / claims.data.length) * 100) : 0;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <>
            <Head title="SHA & Claims" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes modalIn { from { opacity: 0; transform: scale(.97) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .claim-row { animation: rowIn .35s ease-out both; }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] px-4 py-5 dark:bg-[#08131a] md:px-6 md:py-6">
                <div className="mx-auto w-full max-w-none space-y-4">
                    {/* HERO */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"><ClipboardList className="h-3 w-3" /> Operations · Revenue cycle</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800/50 dark:text-slate-300"><Clock3 className="h-3 w-3" /> Updated live</span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">SHA & Claims <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">{greeting}. Review SHA-covered encounters, track submission outcomes, and open outstanding visits for completion. A claim is never approved solely because it was submitted.</p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    <Button className="h-9 rounded-xl bg-emerald-700 px-4 text-sm text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800" asChild>
                                        <Link href="/patients/create"><Stethoscope className="mr-2 h-4 w-4" />New encounter</Link>
                                    </Button>
                                    <Button variant="outline" className="h-9 rounded-xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700" asChild>
                                        <Link href="/patients"><Search className="mr-2 h-4 w-4" />Find patient</Link>
                                    </Button>
                                </div>
                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[{ k: 'Total', v: claims.total, i: ListChecks }, { k: 'Submitted', v: submitted, i: FileCheck2 }, { k: 'Outstanding', v: outstanding, i: Clock3 }].map((m) => (
                                        <div key={m.k} className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-2.5 py-1.5 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
                                            <m.i className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                                            <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.k}</p><p className="text-sm font-bold leading-tight tabular-nums text-slate-900 dark:text-slate-100">{m.v}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <HeroSidePanel submitted={submitted} outstanding={outstanding} failed={failed} total={claims.data.length} totalValue={totalValue} environment={environment} canSubmit={canSubmit} />
                    </section>

                    {/* STAT CARDS */}
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Matching SHA encounters" value={claims.total} caption={`Page ${claims.current_page} of ${claims.last_page}`} tone="emerald" icon={Stethoscope} delay={0} />
                        <StatCard label="Submitted (this page)" value={submitted} caption="Successfully sent to provider" tone="emerald" icon={FileCheck2} trend={submitted ? { dir: 'up', text: `${submittedPct}%` } : undefined} delay={60} />
                        <StatCard label="Outstanding (this page)" value={outstanding} caption="Awaiting claim submission" tone="amber" icon={Clock3} delay={120} />
                        <StatCard label="Failed / rejected" value={failed} caption="Require follow-up" tone={failed ? 'rose' : 'emerald'} icon={failed ? ServerCrash : CheckCircle2} delay={180} />
                    </section>

                    {/* FILTER BAR */}
                    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#111c2d] sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input className="h-10 border-slate-200 pl-9 dark:border-slate-700 dark:bg-slate-900" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient, MRN, visit or claim reference" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[{ key: 'all', label: 'All', icon: ListChecks }, { key: 'submitted', label: 'Submitted', icon: CheckCircle2 }, { key: 'outstanding', label: 'Outstanding', icon: Clock3 }, { key: 'failed', label: 'Failed', icon: ServerCrash }].map((opt) => (
                                <button key={opt.key} type="button" onClick={() => setStatus(opt.key)} className={`inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${status === opt.key ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}><opt.icon className="h-3.5 w-3.5" />{opt.label}</button>
                            ))}
                        </div>
                        <Button type="submit" className="h-10 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"><Filter className="mr-2 h-4 w-4" />Apply</Button>
                    </form>

                    {/* TABLE */}
                    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
                            <div><h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">SHA claim register</h2><p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Submission is tracked from the encounter record. Open a row to review clinical details, eligibility, authorization and invoice before attempting submission.</p></div>
                            <Badge variant="outline" className="w-fit border-slate-200 text-[10px] dark:border-slate-700"><ReceiptText className="mr-1 h-3 w-3" />{money(totalValue)} invoiced</Badge>
                        </div>
                        {claims.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                        <tr>{['Encounter / patient', 'Coverage & readiness', 'Invoice', 'Claim state', 'Last submission', ''].map((x) => <th key={x} className="whitespace-nowrap px-4 py-3 font-semibold">{x}</th>)}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {claims.data.map((c, i) => {
                                            const sent = !!c.claim_submitted_at; const isFailed = ['failed', 'rejected', 'error'].includes((c.claim_status || '').toLowerCase());
                                            return (
                                                <tr key={c.id} className="claim-row align-top transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30" style={{ animationDelay: `${i * 25}ms` }}>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-start gap-2.5">
                                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><Hash className="h-3.5 w-3.5" /></span>
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-slate-900 dark:text-slate-100">{c.encounter_number}</p>
                                                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{c.patient_name || 'Name unavailable'}</p>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.medical_record_number || 'No MRN'} · {label(c.visit_type)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium text-slate-800 dark:text-slate-100">{c.benefit || 'Benefit not selected'}</p>
                                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                            <StatusPill tone={c.eligibility === 'eligible' ? 'success' : c.eligibility ? 'warn' : 'muted'} icon={BadgeCheck}>Elig · {label(c.eligibility)}</StatusPill>
                                                            <StatusPill tone={c.preauthorization === 'approved' ? 'success' : c.preauthorization ? 'warn' : 'muted'} icon={ShieldCheck}>Auth · {label(c.preauthorization)}</StatusPill>
                                                            <StatusPill tone={c.visit_status === 'completed' ? 'info' : 'muted'} icon={CalendarClock}>Visit {label(c.visit_status)}</StatusPill>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-4"><p className="font-semibold text-slate-900 dark:text-slate-100">{money(c.invoice_total)}</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{label(c.invoice_status)}</p></td>
                                                    <td className="px-4 py-4">
                                                        <StatusPill tone={sent ? 'success' : isFailed ? 'danger' : 'muted'} icon={sent ? CheckCircle2 : isFailed ? ServerCrash : Clock3}>{sent ? 'Submitted' : label(c.claim_status || 'not submitted')}</StatusPill>
                                                        {c.claim_reference && <p className="mt-2 max-w-48 break-all font-mono text-[10px] text-slate-500 dark:text-slate-400">Ref: {c.claim_reference}</p>}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-[11px] text-slate-600 dark:text-slate-300">{date(c.claim_submitted_at)}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button size="sm" variant="outline" className="h-8 rounded-lg border-slate-200 text-xs dark:border-slate-700" onClick={() => setView(c)}><Eye className="mr-1.5 h-3.5 w-3.5" />View</Button>
                                                            <Button size="sm" className="h-8 rounded-lg bg-emerald-700 text-xs text-white hover:bg-emerald-800" asChild><Link href={`/visits/${c.id}`}>Open visit<ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><ShieldCheck className="h-6 w-6" /></div>
                                <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">No SHA encounters found</h3>
                                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">Try a different filter, or confirm that the encounter is marked as SHA-covered.</p>
                            </div>
                        )}
                        {claims.last_page > 1 && (
                            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
                                {claims.links.map((l, i) => (
                                    <Button key={i} size="sm" variant={l.active ? 'default' : 'outline'} className={`h-8 rounded-lg text-xs ${l.active ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'border-slate-200 dark:border-slate-700'}`} disabled={!l.url} onClick={() => l.url && router.visit(l.url, { preserveScroll: true })}>{l.label.replace('&laquo;', '«').replace('&raquo;', '»')}</Button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* FOOTER NOTE */}
                    <div className="flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{environment === 'development' ? 'Development mode: any claim response must be clearly treated as synthetic and not a real SHA submission.' : 'Live environment: provider failures must remain visible and must never be converted into mock success.'} {canSubmit ? 'Submission permissions are active; the visit workspace is the review point before submission.' : 'You have read-only access to this register.'} A claim is not considered approved solely because it was submitted.</p>
                    </div>
                </div>
            </main>

            {view && <ClaimDetailModal claim={view} environment={environment} onClose={() => setView(null)} />}
        </>
    );
}

/* -------------------------- Claim Detail Modal (rich) ------------------------- */

function ClaimDetailModal({ claim, environment, onClose }: { claim: Claim; environment: string; onClose: () => void; }) {
    const sent = !!claim.claim_submitted_at;
    const isFailed = ['failed', 'rejected', 'error'].includes((claim.claim_status || '').toLowerCase());
    const lineTotal = claim.billing_items.reduce((n, item) => n + Number(item.quantity || 0) * Number(item.unit_price || 0), 0);
    
    const readiness = [
        { label: 'Eligibility', value: claim.eligibility, ok: claim.eligibility === 'eligible' },
        { label: 'Preauthorization', value: claim.preauthorization, ok: claim.preauthorization === 'approved' },
        { label: 'Invoice', value: claim.invoice_status, ok: !!claim.invoice_status && claim.invoice_status !== 'draft' },
        { label: 'Visit completed', value: claim.visit_status, ok: claim.visit_status === 'completed' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="claim-detail-title" className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-[#f6faf8] shadow-2xl dark:border-slate-700 dark:bg-[#0d1824]" style={{ animation: 'modalIn .22s ease-out both' }}>
                
                {/* HEADER */}
                <header className="sticky top-0 z-20 overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] px-5 py-4 dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                    <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border-[24px] border-white/30 dark:border-white/[0.035]" />
                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 text-emerald-800 shadow-sm dark:bg-slate-800 dark:text-emerald-300"><ClipboardList className="h-5 w-5" /></div>
                            <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">SHA claim details</span>
                                    <StatusPill tone={sent ? 'success' : isFailed ? 'danger' : 'muted'} icon={sent ? CheckCircle2 : isFailed ? ServerCrash : Clock3}>{sent ? 'Submitted' : label(claim.claim_status || 'not submitted')}</StatusPill>
                                    <StatusPill tone="violet" icon={Fingerprint}>{label(claim.claim_environment || environment)}</StatusPill>
                                </div>
                                <h2 id="claim-detail-title" className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">{claim.encounter_number}</h2>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                                    <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{claim.patient_name || 'Name unavailable'}</span>
                                    <span className="text-slate-400">·</span>
                                    <span className="inline-flex items-center gap-1"><Hash className="h-3 w-3" />{claim.medical_record_number || 'No MRN'}</span>
                                    <span className="text-slate-400">·</span>
                                    <span className="inline-flex items-center gap-1"><Stethoscope className="h-3 w-3" />{label(claim.visit_type)}</span>
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" aria-label="Close claim details" className="h-8 w-8 shrink-0 rounded-lg text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onClose}><X className="h-4 w-4" /></Button>
                    </div>

                    <div className="relative mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                            { k: 'Invoice total', v: money(claim.invoice_total), i: Banknote },
                            { k: 'Line items', v: claim.billing_items.length, i: ListChecks },
                            { k: 'Submitted', v: claim.claim_submitted_at ? new Date(claim.claim_submitted_at).toLocaleDateString() : '—', i: CalendarClock },
                            { k: 'Reference', v: claim.claim_reference || claim.claim_provider_reference || '—', i: Hash },
                        ].map((m) => (
                            <div key={m.k} className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/70 px-2.5 py-1.5 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/70">
                                <m.i className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                                <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.k}</p><p className="truncate text-[11px] font-bold text-slate-900 dark:text-slate-100">{m.v}</p></div>
                            </div>
                        ))}
                    </div>
                </header>

                <div className="space-y-4 p-5">
                    
                    {/* READINESS */}
                    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Claim readiness</h3>
                            <span className="text-[10px] text-slate-400">{readiness.filter((r) => r.ok).length}/{readiness.length} ready</span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-4">
                            {readiness.map((r) => (
                                <div key={r.label} className={`flex items-center gap-2 rounded-xl border p-2.5 ${r.ok ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-900/10' : 'border-slate-100 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/30'}`}>
                                    {r.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle2 className="h-4 w-4 shrink-0 text-amber-500" />}
                                    <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{r.label}</p><p className="truncate text-[11px] font-semibold text-slate-800 dark:text-slate-200">{label(r.value)}</p></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                        {/* LEFT */}
                        <div className="space-y-3">
                            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Activity className="h-3.5 w-3.5 text-emerald-600" /> Submission context</h3>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Detail label="Claim state" value={sent ? 'Submitted' : label(claim.claim_status || 'not_submitted')} tone={sent ? 'success' : 'muted'} />
                                    <Detail label="Claim reference" value={claim.claim_reference || claim.claim_provider_reference || 'Not assigned'} mono />
                                    <Detail label="Submitted at" value={date(claim.claim_submitted_at)} />
                                    <Detail label="Submitted by" value={claim.claim_submitter || (claim.claim_submitted_at ? 'Submitter not recorded in transaction log' : 'Not submitted')} />
                                    <Detail label="Provider response" value={label(claim.claim_transaction_status)} tone={['success', 'succeeded', 'ok'].includes((claim.claim_transaction_status || '').toLowerCase()) ? 'success' : ['failed', 'rejected', 'error'].includes((claim.claim_transaction_status || '').toLowerCase()) ? 'danger' : 'muted'} />
                                    <Detail label="Environment" value={label(claim.claim_environment || environment)} />
                                    <Detail label="Visit type / status" value={`${label(claim.visit_type)} · ${label(claim.visit_status)}`} />
                                    <Detail label="Benefit" value={claim.benefit || 'Not selected'} />
                                </div>
                            </section>
                            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"><FlaskConical className="h-3.5 w-3.5 text-emerald-600" /> Clinical</h3>
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                    <StatusPill tone="violet" icon={Hash}>ICD-11 · {claim.icd11_code || 'Not coded'}</StatusPill>
                                    {claim.icd11_display && <StatusPill tone="info">{claim.icd11_display}</StatusPill>}
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/30">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assessment</p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{claim.clinical_assessment || 'Not recorded'}</p>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-3">
                            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"><HeartPulse className="h-3.5 w-3.5 text-emerald-600" /> Coverage</h3>
                                <div className="space-y-2">
                                    <Row icon={BadgeCheck} label="Eligibility" value={label(claim.eligibility)} tone={claim.eligibility === 'eligible' ? 'success' : 'warn'} />
                                    <Row icon={ShieldCheck} label="Preauthorization" value={label(claim.preauthorization)} tone={claim.preauthorization === 'approved' ? 'success' : 'warn'} />
                                    <Row icon={CalendarClock} label="Visit status" value={label(claim.visit_status)} tone={claim.visit_status === 'completed' ? 'success' : 'info'} />
                                    <Row icon={Quote} label="Benefit" value={claim.benefit || 'Not selected'} tone="muted" />
                                </div>
                            </section>
                            <section className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-none dark:bg-emerald-900/10">
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
                                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300"><ReceiptText className="h-3.5 w-3.5" /> Financials</h3>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs"><span className="text-slate-600 dark:text-slate-300">Invoice status</span><span className="font-semibold text-slate-900 dark:text-slate-100">{label(claim.invoice_status)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-600 dark:text-slate-300">Line items</span><span className="font-semibold text-slate-900 dark:text-slate-100">{claim.billing_items.length}</span></div>
                                    <div className="my-2 h-px bg-emerald-200/60 dark:bg-emerald-800/40" />
                                    <div className="flex items-end justify-between">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Invoice total</span>
                                        <strong className="text-lg font-bold tabular-nums text-emerald-900 dark:text-emerald-200">{money(claim.invoice_total)}</strong>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* LINE ITEMS */}
                    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"><ListChecks className="h-3.5 w-3.5 text-emerald-600" /> Invoice line items</h3>
                            <span className="text-[10px] text-slate-400">Sum {money(lineTotal)}</span>
                        </div>
                        {claim.billing_items.length ? (
                            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                                        <tr><th className="p-2.5 text-left font-semibold">Tariff</th><th className="p-2.5 text-left font-semibold">Description</th><th className="p-2.5 text-right font-semibold">Qty</th><th className="p-2.5 text-right font-semibold">Unit</th><th className="p-2.5 text-right font-semibold">Total</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {claim.billing_items.map((item, i) => (
                                            <tr key={`${item.code || 'item'}-${i}`} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                                                <td className="p-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">{item.code || '—'}</td>
                                                <td className="p-2.5 text-slate-800 dark:text-slate-100">{item.description || '—'}</td>
                                                <td className="p-2.5 text-right tabular-nums">{Number(item.quantity || 0)}</td>
                                                <td className="p-2.5 text-right tabular-nums">{money(Number(item.unit_price || 0))}</td>
                                                <td className="p-2.5 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">{money(Number(item.quantity || 0) * Number(item.unit_price || 0))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="rounded-xl border border-slate-100 p-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">No saved invoice line items.</p>
                        )}
                    </section>

                    <div className="flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
                        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <p>Submitted is not the same as approved. Confirm the provider response status before confirming revenue. All actions remain within the visit workspace.</p>
                    </div>
                </div>

                <footer className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-[#111c2d]/95">
                    <Button variant="outline" className="h-9 rounded-lg border-slate-200 text-xs dark:border-slate-700" onClick={onClose}>Close</Button>
                    <Button className="h-9 rounded-lg bg-emerald-700 text-xs text-white hover:bg-emerald-800" asChild><Link href={`/visits/${claim.id}`}>Open visit<ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button>
                </footer>
            </section>
        </div>
    );
}

/* -------------------------------- Sub pieces ------------------------------- */

function Detail({ label: title, value, tone = 'default', mono = false }: { label: string; value: string; tone?: 'default' | 'success' | 'danger' | 'muted'; mono?: boolean; }) {
    const valueTone = tone === 'success' ? 'text-emerald-700 dark:text-emerald-400' : tone === 'danger' ? 'text-rose-700 dark:text-rose-400' : tone === 'muted' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-900 dark:text-slate-100';
    return (
        <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/40 p-2.5 dark:border-slate-800 dark:bg-slate-800/20">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
            <p className={`mt-1 break-words text-[12px] font-medium ${valueTone} ${mono ? 'font-mono text-[11px]' : ''}`}>{value}</p>
        </div>
    );
}

function Row({ icon: Icon, label: title, value, tone }: { icon: typeof Activity; label: string; value: string; tone: 'success' | 'warn' | 'info' | 'muted'; }) {
    const toneCls = { success: 'text-emerald-700 dark:text-emerald-400', warn: 'text-amber-700 dark:text-amber-400', info: 'text-sky-700 dark:text-sky-400', muted: 'text-slate-700 dark:text-slate-300' }[tone];
    return (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/40 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-800/20">
            <div className="flex min-w-0 items-center gap-2"><Icon className={`h-3.5 w-3.5 shrink-0 ${toneCls}`} /><span className="text-[11px] text-slate-600 dark:text-slate-300">{title}</span></div>
            <span className={`truncate text-[11px] font-semibold ${toneCls}`}>{value}</span>
        </div>
    );
}


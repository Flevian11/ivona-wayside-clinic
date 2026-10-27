import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Activity,
    ArrowUpRight,
    CalendarClock,
    FileText,
    Filter,
    ReceiptText,
    Search,
    ShieldCheck,
    Wallet,
    Clock3,
    CheckCircle2,
    TrendingUp,
    CircleDot,
    Hash,
    User,
    Building2,
    BadgeCheck,
    Banknote,
    ListChecks,
    ChevronRight,
    Sparkles,
    Stethoscope,
    Minus,
} from 'lucide-react';

/* ------------------------------ Types (unchanged) ----------------------------- */

type InvoiceRow = {
    id: number;
    encounter_number: string;
    patient_name: string;
    mrn: string | null;
    visit_type: string;
    department: string | null;
    coverage: string | null;
    invoice_status: string;
    invoice_reference: string | null;
    invoice_total: number;
    item_count: number;
    arrived_at: string | null;
    claim_status: string | null;
    visit_url: string;
};
type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};
type Props = {
    summary: { total: number; draft: number; issued: number; value: number };
    invoices: Pagination<InvoiceRow>;
    filters: { q: string; invoice_status: string; coverage: string };
};

/* ------------------------------ Helpers (unchanged) ----------------------------- */

const money = (n: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 }).format(n || 0);

const statusStyle: Record<string, string> = {
    draft: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60',
    issued: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60',
    paid: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60',
    partially_paid:
        'bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60',
    not_required:
        'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
};

/* --------------------------------- Pills --------------------------------- */

function Pill({
    tone,
    icon: Icon,
    children,
}: {
    tone: 'success' | 'danger' | 'warn' | 'info' | 'muted' | 'violet';
    icon?: typeof CircleDot;
    children: React.ReactNode;
}) {
    const map = {
        success:
            'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
        danger:
            'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60',
        warn: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
        info: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60',
        muted:
            'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        violet:
            'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/60',
    } as const;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[tone]}`}
        >
            {Icon && <Icon className="h-2.5 w-2.5" />}
            {children}
        </span>
    );
}

/* -------------------------------- Stat card ------------------------------- */

function StatCard({
    label: title,
    value,
    caption,
    tone,
    icon: Icon,
    trend,
    delay = 0,
    isMoney = false,
}: {
    label: string;
    value: number | string;
    caption: string;
    tone: 'emerald' | 'amber' | 'sky' | 'violet';
    icon: typeof Activity;
    trend?: { dir: 'up' | 'down' | 'flat'; text: string };
    delay?: number;
    isMoney?: boolean;
}) {
    const toneMap = {
        emerald: {
            icon: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
            line: '#10b981',
            glow: 'shadow-emerald-500/10',
        },
        amber: {
            icon: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
            line: '#f59e0b',
            glow: 'shadow-amber-500/10',
        },
        sky: {
            icon: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300',
            line: '#0ea5e9',
            glow: 'shadow-sky-500/10',
        },
        violet: {
            icon: 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300',
            line: '#8b5cf6',
            glow: 'shadow-violet-500/10',
        },
    } as const;
    const t = toneMap[tone];

    const bars = useMemo(() => {
        const seed = (typeof value === 'number' ? value : title.length) % 11;
        return Array.from({ length: 7 }, (_, i) => 25 + Math.round(Math.abs(Math.sin(i + seed)) * 60));
    }, [value, title]);

    return (
        <article
            className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111c2d] ${t.glow}`}
            style={{ animation: `cardIn .5s ease-out ${delay}ms both` }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.icon}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex h-9 items-end gap-[3px]">
                    {bars.map((h, i) => (
                        <span
                            key={i}
                            className="w-1 rounded-sm opacity-60 transition-all duration-500 group-hover:opacity-90"
                            style={{ height: `${h}%`, background: t.line }}
                        />
                    ))}
                </div>
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {title}
            </p>
            <div className="mt-1 flex items-end justify-between gap-2">
                <strong
                    className={`font-semibold leading-none tracking-tight text-slate-950 tabular-nums dark:text-slate-50 ${
                        isMoney ? 'text-lg' : 'text-2xl'
                    }`}
                >
                    {value}
                </strong>
                {trend && (
                    <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            trend.dir === 'up'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : trend.dir === 'down'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        {trend.dir === 'up' ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : trend.dir === 'down' ? (
                            <TrendingUp className="h-3 w-3 rotate-180" />
                        ) : (
                            <Minus className="h-3 w-3" />
                        )}
                        {trend.text}
                    </span>
                )}
            </div>
            <p className="mt-2 truncate text-[11px] text-slate-500 dark:text-slate-400">{caption}</p>
        </article>
    );
}

/* ---------------------------- Hero right panel ---------------------------- */

function HeroSidePanel({
    total,
    draft,
    issued,
    value,
}: {
    total: number;
    draft: number;
    issued: number;
    value: number;
}) {
    const issuedPct = total ? Math.round((issued / total) * 100) : 0;
    const draftPct = total ? Math.round((draft / total) * 100) : 0;
    const otherPct = Math.max(0, 100 - issuedPct - draftPct);

    const r = 36;
    const c = 2 * Math.PI * r;
    const segments = [
        { label: 'Issued', value: issued, color: '#10b981', pct: issuedPct, bg: 'bg-emerald-500' },
        { label: 'Draft', value: draft, color: '#f59e0b', pct: draftPct, bg: 'bg-amber-500' },
        {
            label: 'Other states',
            value: Math.max(0, total - issued - draft),
            color: '#94a3b8',
            pct: otherPct,
            bg: 'bg-slate-400',
        },
    ];
    let offset = 0;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/70">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />

            <div className="relative flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0">
                    <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                        <circle
                            cx="44"
                            cy="44"
                            r={r}
                            fill="none"
                            className="text-slate-200 dark:text-slate-700"
                            stroke="currentColor"
                            strokeWidth="8"
                        />
                        {segments.map((s, i) => {
                            const dash = (s.pct / 100) * c;
                            const el = (
                                <circle
                                    key={i}
                                    cx="44"
                                    cy="44"
                                    r={r}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth="8"
                                    strokeDasharray={`${dash} ${c - dash}`}
                                    strokeDashoffset={-offset}
                                    strokeLinecap="butt"
                                />
                            );
                            offset += dash;
                            return el;
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Issued</span>
                        <strong className="text-xl font-bold text-slate-900 dark:text-slate-100">{issuedPct}%</strong>
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Invoice lifecycle · this view
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {issued} issued · {draft} draft
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <Pill tone="success" icon={ShieldCheck}>
                            {issued} issued
                        </Pill>
                        <Pill tone="warn" icon={Clock3}>
                            {draft} draft
                        </Pill>
                    </div>
                </div>
            </div>

            <div className="relative mt-4 space-y-2">
                {segments.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${s.bg}`} />
                        <span className="flex-1 text-[11px] text-slate-600 dark:text-slate-300">{s.label}</span>
                        <strong className="text-xs text-slate-900 dark:text-slate-100">{s.value}</strong>
                        <span className="w-9 text-right text-[9px] text-slate-400">{s.pct}%</span>
                    </div>
                ))}
            </div>

            <div className="relative mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 dark:border-emerald-900/40 dark:bg-emerald-900/10">
                <div className="flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Invoice value
                    </span>
                </div>
                <strong className="text-sm font-bold tabular-nums text-emerald-900 dark:text-emerald-200">
                    {money(value)}
                </strong>
            </div>
        </div>
    );
}

/* ---------------------------------- Page --------------------------------- */

export default function BillingIndex({ summary, invoices, filters }: Props) {
    const [q, setQ] = useState(filters.q || '');
    const [invoiceStatus, setInvoiceStatus] = useState(filters.invoice_status || '');
    const [coverage, setCoverage] = useState(filters.coverage || '');

    const apply = () =>
        router.get('/billing', { q, invoice_status: invoiceStatus, coverage }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });

    const invoiceStatusOptions = [
        { value: '', label: 'All', icon: ListChecks },
        { value: 'draft', label: 'Draft', icon: Clock3 },
        { value: 'issued', label: 'Issued', icon: ShieldCheck },
        { value: 'paid', label: 'Paid', icon: CheckCircle2 },
        { value: 'partially_paid', label: 'Partial', icon: Activity },
        { value: 'not_required', label: 'N/A', icon: Minus },
    ];

    const coverageOptions = [
        { value: '', label: 'All coverage' },
        { value: 'sha', label: 'SHA' },
        { value: 'cash', label: 'Cash' },
        { value: 'private', label: 'Private' },
    ];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const issuedPct = summary.total ? Math.round((summary.issued / summary.total) * 100) : 0;

    return (
        <>
            <Head title="Billing & payments" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .billing-row { animation: rowIn .35s ease-out both; }
                .shimmer-bar { background: linear-gradient(90deg, rgba(16,185,129,.10), rgba(16,185,129,.28), rgba(16,185,129,.10)); background-size: 400px 100%; animation: shimmer 2.4s linear infinite; }
                @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] px-4 py-5 text-slate-900 transition-colors dark:bg-[#08131a] dark:text-slate-100 md:px-6 md:py-6">
                <div className="mx-auto w-full max-w-none space-y-4">
                    {/* HERO — two-column like dashboard */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d] md:p-7">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <ReceiptText className="h-3 w-3" /> Finance operations
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                                        <Clock3 className="h-3 w-3" /> Updated live
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
                                    Billing & payments <span className="text-emerald-700 dark:text-emerald-400">✦</span>
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {greeting}. Review encounter invoices, draft charges and issued invoice values
                                    from the visit record. Open any row to continue in the visit workspace.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    <Link
                                        href="/patients"
                                        className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800"
                                    >
                                        <Stethoscope className="h-4 w-4" />
                                        Open visits
                                    </Link>
                                    <Link
                                        href="/operations/sha-claims"
                                        className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        SHA & claims
                                    </Link>
                                </div>
                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[
                                        { k: 'Records', v: summary.total, i: FileText },
                                        { k: 'Issued', v: summary.issued, i: ShieldCheck },
                                        { k: 'Draft', v: summary.draft, i: Clock3 },
                                    ].map((m) => (
                                        <div
                                            key={m.k}
                                            className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-2.5 py-1.5 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60"
                                        >
                                            <m.i className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                    {m.k}
                                                </p>
                                                <p className="text-sm font-bold leading-tight tabular-nums text-slate-900 dark:text-slate-100">
                                                    {m.v}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <HeroSidePanel
                            total={summary.total}
                            draft={summary.draft}
                            issued={summary.issued}
                            value={summary.value}
                        />
                    </section>

                    {/* STAT CARDS */}
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Encounter invoices"
                            value={summary.total}
                            caption="Matching current filters"
                            tone="sky"
                            icon={FileText}
                            delay={0}
                        />
                        <StatCard
                            label="Draft invoices"
                            value={summary.draft}
                            caption="Not yet issued"
                            tone="amber"
                            icon={CalendarClock}
                            delay={60}
                        />
                        <StatCard
                            label="Issued invoices"
                            value={summary.issued}
                            caption="Issued from visit workspace"
                            tone="emerald"
                            icon={ShieldCheck}
                            trend={summary.total ? { dir: 'up', text: `${issuedPct}%` } : undefined}
                            delay={120}
                        />
                        <StatCard
                            label="Invoice value"
                            value={money(summary.value)}
                            caption="Draft and issued records"
                            tone="violet"
                            icon={Wallet}
                            delay={180}
                            isMoney
                        />
                    </section>

                    {/* FILTER + TABLE */}
                    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Invoice register
                                </h2>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                    Open an encounter to review or update its invoice using the established visit
                                    workflow.
                                </p>
                            </div>
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                <ListChecks className="h-3 w-3" />
                                {invoices.total.toLocaleString()} records
                            </span>
                        </div>

                        {/* FILTER BAR */}
                        <div className="border-b border-slate-100 bg-[#f8fbf9] p-4 dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900">
                                    <Search className="h-4 w-4 text-slate-400" />
                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && apply()}
                                        placeholder="Patient, MRN or encounter"
                                        className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                                    />
                                </label>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                                        {invoiceStatusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setInvoiceStatus(opt.value)}
                                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                                                    invoiceStatus === opt.value
                                                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20'
                                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <opt.icon className="h-3 w-3" />
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    <select
                                        value={coverage}
                                        onChange={(e) => setCoverage(e.target.value)}
                                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        {coverageOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={apply}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-900"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                    <tr>
                                        {['Encounter / patient', 'Coverage & visit', 'Invoice', 'Status', 'Charges', ''].map(
                                            (h) => (
                                                <th key={h} className="px-5 py-3 font-semibold">
                                                    {h}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {invoices.data.map((row, i) => (
                                        <tr
                                            key={row.id}
                                            className="billing-row align-top transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10"
                                            style={{ animationDelay: `${i * 22}ms` }}
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-start gap-2.5">
                                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                                        <Hash className="h-3.5 w-3.5" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                            {row.encounter_number}
                                                        </p>
                                                        <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-700 dark:text-slate-200">
                                                            <User className="h-3 w-3 text-slate-400" />
                                                            {row.patient_name}
                                                        </p>
                                                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                            <Building2 className="h-3 w-3" />
                                                            {row.mrn || 'No MRN recorded'} ·{' '}
                                                            {row.department || 'Unassigned department'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Pill
                                                    tone={
                                                        row.coverage === 'sha'
                                                            ? 'violet'
                                                            : row.coverage === 'cash'
                                                            ? 'success'
                                                            : row.coverage === 'private'
                                                            ? 'info'
                                                            : 'muted'
                                                    }
                                                    icon={BadgeCheck}
                                                >
                                                    {row.coverage || 'Not specified'}
                                                </Pill>
                                                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] capitalize text-slate-500 dark:text-slate-400">
                                                    <Stethoscope className="h-3 w-3" />
                                                    {row.visit_type || 'Visit'}
                                                    <span className="text-slate-400">·</span>
                                                    {row.claim_status || 'No claim status'}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
                                                    {money(row.invoice_total)}
                                                </p>
                                                <p className="mt-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                                    {row.invoice_reference || 'No invoice reference'}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${
                                                        statusStyle[row.invoice_status] || statusStyle.not_required
                                                    }`}
                                                >
                                                    {(row.invoice_status || 'not_required').replaceAll('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                    <ListChecks className="h-3.5 w-3.5 text-slate-400" />
                                                    {row.item_count} item{row.item_count === 1 ? '' : 's'}
                                                </p>
                                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                    {row.arrived_at
                                                        ? new Date(row.arrived_at).toLocaleDateString()
                                                        : 'Date not recorded'}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={row.visit_url}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
                                                >
                                                    Review invoice
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {!invoices.data.length && (
                                <div className="flex flex-col items-center py-16 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        <ReceiptText className="h-6 w-6" />
                                    </div>
                                    <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                                        No invoice records found
                                    </p>
                                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                        Adjust the filters or review a visit to create its invoice draft.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PAGINATION */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3 text-emerald-600" />
                                Showing {invoices.from ?? 0}–{invoices.to ?? 0} of {invoices.total}
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {invoices.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                        className={`min-w-8 rounded-lg px-2.5 py-2 text-[11px] font-semibold transition ${
                                            link.active
                                                ? 'bg-emerald-800 text-white shadow-sm'
                                                : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                                        } disabled:cursor-not-allowed disabled:opacity-40`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FOOTER NOTE */}
                    <div className="flex items-start gap-2 rounded-xl border border-sky-200/70 bg-sky-50/70 p-4 text-sm text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-100">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>
                            Invoice totals are computed from the visit record. Draft charges become issued invoices
                            only inside the visit workspace, and payments must be recorded there so audit trails remain
                            intact.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
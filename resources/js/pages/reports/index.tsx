import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Activity,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    FileBarChart,
    Fingerprint,
    HeartPulse,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Wallet,
    Clock3,
    Stethoscope,
    ReceiptText,
    CircleDot,
    ShieldCheck,
    Building2,
    Users,
    Banknote,
    ChartArea,
    Sparkles,
    Minus,
    ShieldAlert,
    Hash,
    ListChecks,
    PieChart,
    ArrowRight,
} from 'lucide-react';

import { LayoutGrid, CalendarRange } from 'lucide-react';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Props = {
    summary: {
        visits: number;
        completed: number;
        cancelled: number;
        sha: number;
        claims_submitted: number;
        claims_pending: number;
        invoices_issued: number;
        invoice_value: number | null;
        draft_invoices: number;
        inpatient: number;
        outpatient: number;
    };
    daily: { date: string; count: number }[];
    departments: { name: string; count: number; value: number }[];
    visit_statuses: { name: string; count: number }[];
    coverage: { name: string; count: number }[];
    claim_states: { name: string; count: number }[];
    filters: { from: string; to: string };
    financial_allowed: boolean;
};

/* ------------------------------ Helpers (unchanged) ----------------------------- */

const money = (n: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 }).format(n || 0);
const number = (n: number) => (n || 0).toLocaleString('en-KE');

/* --------------------------------- Pills --------------------------------- */

function Pill({
    tone,
    icon: Icon,
    children,
    className = '',
}: {
    tone: 'success' | 'danger' | 'warn' | 'info' | 'muted' | 'violet' | 'sky';
    icon?: typeof CircleDot;
    children: React.ReactNode;
    className?: string;
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
        sky: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60',
    } as const;
    
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[tone]} ${className}`}
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
    note,
    tone,
    icon: Icon,
    delay = 0,
}: {
    label: string;
    value: number;
    note: string;
    tone: 'sky' | 'emerald' | 'violet' | 'teal' | 'amber' | 'rose';
    icon: typeof Activity;
    delay?: number;
}) {
    const toneMap = {
        sky: {
            icon: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300',
            line: '#0ea5e9',
            glow: 'shadow-sky-500/10',
        },
        emerald: {
            icon: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
            line: '#10b981',
            glow: 'shadow-emerald-500/10',
        },
        violet: {
            icon: 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300',
            line: '#8b5cf6',
            glow: 'shadow-violet-500/10',
        },
        teal: {
            icon: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300',
            line: '#14b8a6',
            glow: 'shadow-teal-500/10',
        },
        amber: {
            icon: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
            line: '#f59e0b',
            glow: 'shadow-amber-500/10',
        },
        rose: {
            icon: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300',
            line: '#f43f5e',
            glow: 'shadow-rose-500/10',
        },
    } as const;
    const t = toneMap[tone];

    const bars = useMemo(() => {
        const seed = value % 11;
        return Array.from({ length: 7 }, (_, i) => 25 + Math.round(Math.abs(Math.sin(i + seed)) * 60));
    }, [value]);

    return (
        <article
            className={`group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111c2d] ${t.glow}`}
            style={{ animation: `cardIn .5s ease-out ${delay}ms both` }}
        >
            <div className="flex items-start justify-between gap-2">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.icon}`}>
                    <Icon className="h-4 w-4" />
                </span>
                <div className="flex h-8 items-end gap-[3px]">
                    {bars.map((h, i) => (
                        <span
                            key={i}
                            className="w-1 rounded-sm opacity-60 transition-all duration-500 group-hover:opacity-90"
                            style={{ height: `${h}%`, background: t.line }}
                        />
                    ))}
                </div>
            </div>
            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {title}
            </p>
            <p className="mt-1 text-2xl font-bold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">
                {number(value)}
            </p>
            <p className="mt-1.5 min-h-7 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{note}</p>
        </article>
    );
}

/* -------------------------- Activity line chart ------------------------- */


function VisitActivityChart({ data }: { data: { date: string; count: number }[] }) {
    const [hover, setHover] = useState<number | null>(null);
    const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    // 1. Aggregate Data based on view
    const aggregated = useMemo(() => {
        if (view === 'daily') return data;
        
        const groups: Record<string, number> = {};
        
        data.forEach((d) => {
            const dateObj = new Date(d.date);
            let key = d.date;
            
            if (view === 'monthly') {
                key = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            } else if (view === 'weekly') {
                // Calculate the Monday of the week for grouping
                const day = dateObj.getDay();
                const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(dateObj.setDate(diff));
                key = `Wk ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            }
            
            groups[key] = (groups[key] || 0) + d.count;
        });

        return Object.entries(groups).map(([date, count]) => ({ date, count }));
    }, [data, view]);

    const valid = aggregated;

    // 2. Empty state
    if (!valid.length) {
        return (
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl bg-[#f7faf9] px-6 py-8 text-center dark:bg-slate-800/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900">
                    <CalendarDays className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No encounters recorded
                </p>
                <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                    Activity will appear here once visits are registered for this period.
                </p>
            </div>
        );
    }

    // 3. Chart Math
    const max = Math.max(1, ...valid.map((p) => p.count));
    const total = valid.reduce((n, p) => n + p.count, 0);
    const avg = valid.length ? Math.round(total / valid.length) : 0;
    const peak = valid.reduce((m, p) => (p.count > m.count ? p : m), valid[0]);
    
    const w = 600;
    const h = 180;
    const padX = 26;
    const padTop = 20;
    const padBottom = 24;
    const chartW = w - padX * 2;
    const chartH = h - padTop - padBottom;

    const xStep = chartW / Math.max(valid.length - 1, 1);
    const coords = valid
        .map((p, i) => `${padX + i * xStep},${padTop + chartH - (p.count / max) * chartH}`)
        .join(' ');
    const polygonCoords = `${padX},${padTop + chartH} ${coords} ${padX + (valid.length - 1) * xStep},${
        padTop + chartH
    }`;

    return (
        <div className="rounded-xl bg-[#f7faf9] px-3 pt-3 dark:bg-slate-800/50">
            {/* Header with stats and toggle */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">Total</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{total.toLocaleString()}</p>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">Avg / {view === 'monthly' ? 'mo' : view === 'weekly' ? 'wk' : 'day'}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{avg}</p>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">Peak</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{peak.count}</p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <button
                        onClick={() => setView('daily')}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            view === 'daily'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <LayoutGrid className="h-3 w-3" /> Daily
                    </button>
                    <button
                        onClick={() => setView('weekly')}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            view === 'weekly'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <CalendarRange className="h-3 w-3" /> Weekly
                    </button>
                    <button
                        onClick={() => setView('monthly')}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            view === 'monthly'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <CalendarDays className="h-3 w-3" /> Monthly
                    </button>
                </div>
            </div>

            {/* SVG Chart */}
            <svg viewBox={`0 0 ${w} ${h}`} className="h-[180px] w-full" role="img" aria-label="Visit activity">
                <defs>
                    <linearGradient id="visitActivityArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity=".30" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <filter id="visitActivityGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Horizontal Grid */}
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                    <line
                        key={pct}
                        x1={padX}
                        x2={w - padX}
                        y1={padTop + chartH * (1 - pct)}
                        y2={padTop + chartH * (1 - pct)}
                        className="text-slate-200 dark:text-slate-700"
                        stroke="currentColor"
                        strokeDasharray="3 5"
                    />
                ))}

                {/* Area & Line */}
                <polygon points={polygonCoords} fill="url(#visitActivityArea)" />
                <polyline
                    points={coords}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#visitActivityGlow)"
                />

                {/* Data Points & Tooltips */}
                {valid.map((p, i) => {
                    const cx = padX + i * xStep;
                    const cy = padTop + chartH - (p.count / max) * chartH;
                    const isHover = hover === i;
                    return (
                        <g
                            key={`${p.date}-${i}`}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                            className="cursor-pointer"
                        >
                            <circle cx={cx} cy={cy} r="14" fill="transparent" />
                            <circle
                                cx={cx}
                                cy={cy}
                                r={isHover ? 6 : 3.6}
                                fill="white"
                                stroke="#059669"
                                strokeWidth={isHover ? 3 : 2.2}
                                className="transition-all duration-150"
                            />
                            {isHover && (
                                <g>
                                    <rect x={cx - 30} y={cy - 30} width="60" height="22" rx="6" fill="#0f172a" className="drop-shadow-md" />
                                    <text
                                        x={cx}
                                        y={cy - 16}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="10"
                                        fontWeight="600"
                                    >
                                        {p.count} visits
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* X-Axis Labels */}
            <div
                className="grid pb-2 text-center text-[9px] text-slate-500 dark:text-slate-400"
                style={{ gridTemplateColumns: `repeat(${valid.length}, minmax(0, 1fr))` }}
            >
                {valid.map((p, i) => (
                    <span
                        key={`${p.date}-label-${i}`}
                        className={hover === i ? 'font-semibold text-emerald-700 dark:text-emerald-400' : ''}
                    >
                        {p.date}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ---------------------------- Financial gauge ---------------------------- */

function FinancialGauge({
    allowed,
    invoiceValue,
    issued,
    draft,
}: {
    allowed: boolean;
    invoiceValue: number;
    issued: number;
    draft: number;
}) {
    const total = issued + draft;
    const issuedPct = total ? Math.round((issued / total) * 100) : 0;
    const r = 40;
    const c = 2 * Math.PI * r;
    const dash = (issuedPct / 100) * c;

    return (
        <div className="relative">
            {allowed ? (
                <>
                    <div className="mt-3 flex items-center gap-4">
                        <div className="relative h-28 w-28 shrink-0">
                            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={r}
                                    fill="none"
                                    className="text-slate-200 dark:text-slate-700"
                                    stroke="currentColor"
                                    strokeWidth="9"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={r}
                                    fill="none"
                                    stroke="url(#finGrad)"
                                    strokeWidth="9"
                                    strokeLinecap="round"
                                    strokeDasharray={`${dash} ${c - dash}`}
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="finGrad" x1="0" x2="1" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#0ea5e9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Issued
                                </span>
                                <strong className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    {issuedPct}%
                                </strong>
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Recorded invoice value
                            </p>
                            <p className="mt-0.5 text-2xl font-bold leading-tight tabular-nums text-slate-950 dark:text-slate-50">
                                {money(invoiceValue)}
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
                    <p className="mt-3 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                        Invoice value is not a confirmed cash receipt or SHA reimbursement.
                    </p>
                </>
            ) : (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                    <div className="mb-1 flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span className="font-semibold">Financial totals hidden</span>
                    </div>
                    Your account does not have the financial report permission.
                </div>
            )}
        </div>
    );
}

/* ------------------------------- Breakdown -------------------------------- */

function Breakdown({
    title,
    subtitle,
    rows,
    empty,
    financialAllowed = false,
    icon: Icon = ListChecks,
    tone = 'emerald',
}: {
    title: string;
    subtitle: string;
    rows: { name: string; count: number; value?: number }[];
    empty: string;
    financialAllowed?: boolean;
    icon?: typeof Activity;
    tone?: 'emerald' | 'violet' | 'sky' | 'amber' | 'teal';
}) {
    const max = Math.max(1, ...rows.map((r) => r.count));
    const toneMap = {
        emerald: 'from-emerald-700 to-emerald-400',
        violet: 'from-violet-700 to-violet-400',
        sky: 'from-sky-700 to-sky-400',
        amber: 'from-amber-700 to-amber-400',
        teal: 'from-teal-700 to-teal-400',
    } as const;
    const iconTone = {
        emerald: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
        violet: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300',
        sky: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300',
        amber: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
        teal: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300',
    } as const;

    return (
        <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconTone[tone]}`}>
                    <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
                <Pill tone="muted" className="ml-auto">
                    {number(rows.reduce((n, r) => n + r.count, 0))}
                </Pill>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row) => (
                    <div
                        key={row.name}
                        className="grid grid-cols-[minmax(90px,1fr)_minmax(80px,1.5fr)_44px] items-center gap-3 px-4 py-2.5"
                    >
                        <span className="truncate text-xs font-medium capitalize text-slate-700 dark:text-slate-200">
                            {row.name.replaceAll('_', ' ')}
                        </span>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${toneMap[tone]} transition-all duration-700`}
                                style={{
                                    width: `${Math.max(row.count > 0 ? 3 : 0, (row.count / max) * 100)}%`,
                                }}
                            />
                        </div>
                        <span className="text-right text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                            {number(row.count)}
                        </span>
                        {financialAllowed && row.value !== undefined && (
                            <span className="col-span-3 -mt-1 text-right text-[10px] text-slate-500 dark:text-slate-400">
                                {money(row.value)}
                            </span>
                        )}
                    </div>
                ))}
                {!rows.length && (
                    <div className="px-4 py-8 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{empty}</p>
                    </div>
                )}
            </div>
        </article>
    );
}

/* ---------------------------------- Page --------------------------------- */

export default function ReportsIndex({
    summary,
    daily,
    departments,
    visit_statuses,
    coverage,
    claim_states,
    filters,
    financial_allowed,
}: Props) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');
    const peak = useMemo(
        () => daily.reduce((best, row) => (row.count > (best?.count ?? -1) ? row : best), daily[0]),
        [daily],
    );
    const completionRate = summary.visits ? Math.round((summary.completed / summary.visits) * 100) : 0;
    const claimRate = summary.sha ? Math.round((summary.claims_submitted / summary.sha) * 100) : 0;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const cards = [
        {
            label: 'Registered visits',
            value: summary.visits,
            note: 'Encounters arriving in period',
            icon: Activity,
            tone: 'sky' as const,
        },
        {
            label: 'Completed visits',
            value: summary.completed,
            note: `${completionRate}% of registered visits`,
            icon: CheckCircle2,
            tone: 'emerald' as const,
        },
        {
            label: 'SHA-covered visits',
            value: summary.sha,
            note: 'Coverage/payment type recorded as SHA',
            icon: Fingerprint,
            tone: 'violet' as const,
        },
        {
            label: 'Claims submitted',
            value: summary.claims_submitted,
            note: `${claimRate}% of SHA-covered visits`,
            icon: ClipboardCheck,
            tone: 'teal' as const,
        },
        {
            label: 'Claims not submitted',
            value: summary.claims_pending,
            note: 'SHA encounters without submitted state',
            icon: AlertCircle,
            tone: 'amber' as const,
        },
        {
            label: 'Invoices issued',
            value: summary.invoices_issued,
            note: `${summary.draft_invoices} invoice drafts`,
            icon: ReceiptText,
            tone: 'rose' as const,
        },
    ];

    return (
        <>
            <Head title="Reports & analytics" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
                .report-row { animation: rowIn .35s ease-out both; }
                .shimmer-bar { background: linear-gradient(90deg, rgba(16,185,129,.10), rgba(16,185,129,.28), rgba(16,185,129,.10)); background-size: 400px 100%; animation: shimmer 2.4s linear infinite; }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] px-4 py-5 text-slate-900 transition-colors dark:bg-[#08131a] dark:text-slate-100 md:px-6 md:py-6">
                <div className="mx-auto w-full max-w-none space-y-4">
                    {/* HERO — richer, dashboard-style */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
                        <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d] md:p-7">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <HeartPulse className="h-3 w-3" /> Clinic operations · Reporting
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                                        <Clock3 className="h-3 w-3" /> {filters.from} → {filters.to}
                                    </span>
                                    {financial_allowed ? (
                                        <Pill tone="success" icon={ShieldCheck}>
                                            Financial access
                                        </Pill>
                                    ) : (
                                        <Pill tone="muted" icon={ShieldAlert}>
                                            No financial access
                                        </Pill>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
                                    Reports &amp; analytics{' '}
                                    <span className="text-emerald-700 dark:text-emerald-400">✦</span>
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {greeting}. A period-based view of patient flow, clinical completion, coverage,
                                    claims and invoice workflow. All indicators are calculated from saved encounter
                                    records.
                                </p>

                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[
                                        { k: 'Visits', v: summary.visits, i: Activity },
                                        { k: 'Completion', v: `${completionRate}%`, i: CheckCircle2 },
                                        { k: 'Claim rate', v: `${claimRate}%`, i: ClipboardCheck },
                                    ].map((m) => (
                                        <div
                                            key={m.k}
                                            className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-2.5 py-1.5 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60"
                                        >
                                            <m.i className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
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

                                {/* date control */}
                                <div className="mt-5 flex flex-wrap items-end gap-2">
                                    <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        From
                                        <input
                                            type="date"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            className="mt-1 block h-9 rounded-lg border border-slate-200 bg-white/90 px-2 text-xs text-slate-800 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                    </label>
                                    <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        To
                                        <input
                                            type="date"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            className="mt-1 block h-9 rounded-lg border border-slate-200 bg-white/90 px-2 text-xs text-slate-800 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                    </label>
                                    <button
                                        onClick={() =>
                                            router.get(
                                                '/reports',
                                                { from, to },
                                                { preserveScroll: true, replace: true },
                                            )
                                        }
                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Run
                                    </button>
                                </div>
                            </div>
                        </article>

                        {/* RIGHT: Operational pulse with two animated gauges */}
                        <article className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6">
                            <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[26px] border-white/[.08]" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100">
                                    <TrendingUp className="h-3 w-3" /> Period highlights
                                </span>
                                <h2 className="mt-3 text-lg font-bold tracking-tight">Operational pulse</h2>
                                <p className="mt-1 text-[11px] leading-5 text-emerald-50/80">
                                    {filters.from} to {filters.to}. Use these signals to identify follow-up work;
                                    they are not payer approval or payment reconciliation.
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <MiniGauge
                                        title="Visit completion"
                                        pct={completionRate}
                                        caption={`${number(summary.completed)} of ${number(summary.visits)} visits`}
                                    />
                                    <MiniGauge
                                        title="SHA claim submission"
                                        pct={claimRate}
                                        caption={`${number(summary.claims_pending)} not submitted`}
                                    />
                                </div>
                                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-100/80">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Financial totals are permission-gated;
                                    submitted does not mean accepted.
                                </p>
                            </div>
                        </article>
                    </section>

                    {/* STAT CARDS */}
                    <section className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
                        {cards.map((c, i) => (
                            <StatCard
                                key={c.label}
                                label={c.label}
                                value={c.value}
                                note={c.note}
                                tone={c.tone}
                                icon={c.icon}
                                delay={i * 40}
                            />
                        ))}
                    </section>

                    {/* CHARTS */}
                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                            <div className="mb-3 flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        Daily visit activity
                                    </h2>
                                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                        Encounter arrivals by day in the selected period
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ChartArea className="h-4 w-4 text-emerald-700" />
                                    {peak && (
                                        <Pill tone="success" icon={Sparkles}>
                                            Peak {peak.date}
                                        </Pill>
                                    )}
                                </div>
                            </div>
                            <VisitActivityChart data={daily} />
                            {daily.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    <div className="rounded-lg bg-[#f7faf9] p-2.5 dark:bg-slate-900/60">
                                        <p className="text-[9px] uppercase tracking-wide text-slate-500">Period total</p>
                                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                                            {number(summary.visits)}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-[#f7faf9] p-2.5 dark:bg-slate-900/60">
                                        <p className="text-[9px] uppercase tracking-wide text-slate-500">Peak day</p>
                                        <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {peak?.date ?? '—'}
                                        </p>
                                        <p className="text-[9px] text-slate-500">
                                            {number(peak?.count ?? 0)} visits
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-[#f7faf9] p-2.5 dark:bg-slate-900/60">
                                        <p className="text-[9px] uppercase tracking-wide text-slate-500">Daily average</p>
                                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                                            {number(daily.length ? Math.round(summary.visits / daily.length) : 0)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </article>

                        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        Financial snapshot
                                    </h2>
                                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                        Issued, paid or partially paid invoice records
                                    </p>
                                </div>
                                <Wallet className="h-4 w-4 text-emerald-700" />
                            </div>
                            <FinancialGauge
                                allowed={financial_allowed}
                                invoiceValue={summary.invoice_value || 0}
                                issued={summary.invoices_issued}
                                draft={summary.draft_invoices}
                            />
                        </article>
                    </section>

                    {/* BREAKDOWNS */}
                    <section className="grid gap-3 lg:grid-cols-3">
                        <Breakdown
                            title="Department activity"
                            subtitle="Visit volume by assigned department"
                            rows={departments}
                            empty="No department activity."
                            financialAllowed={financial_allowed}
                            icon={Building2}
                            tone="emerald"
                        />
                        <Breakdown
                            title="Visit status"
                            subtitle="Current recorded status of encounters"
                            rows={visit_statuses}
                            empty="No visit statuses recorded."
                            icon={Users}
                            tone="sky"
                        />
                        <Breakdown
                            title="Coverage mix"
                            subtitle="Coverage/payment type on encounter"
                            rows={coverage}
                            empty="No coverage values recorded."
                            icon={Fingerprint}
                            tone="violet"
                        />
                    </section>

                    <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <Breakdown
                            title="SHA claim state"
                            subtitle="Encounter claim status, not payer adjudication"
                            rows={claim_states}
                            empty="No claim states recorded."
                            icon={ClipboardCheck}
                            tone="teal"
                        />

                        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        Reporting guide
                                    </h2>
                                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                        How to interpret these indicators
                                    </p>
                                </div>
                                <FileBarChart className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <GuideCard
                                    icon={Activity}
                                    title="Visit activity"
                                    body="Based on encounter arrival dates. Completed and cancelled visits remain part of registered volume."
                                    tone="emerald"
                                />
                                <GuideCard
                                    icon={Fingerprint}
                                    title="SHA workflow"
                                    body="A submitted state is a recorded submission only; it does not imply acceptance, payment or reconciliation."
                                    tone="violet"
                                />
                                <GuideCard
                                    icon={Stethoscope}
                                    title="Department"
                                    body="Encounters without a department are grouped under Unassigned."
                                    tone="sky"
                                />
                                <GuideCard
                                    icon={Clock3}
                                    title="Date range"
                                    body="All operational counts and breakdowns use the selected arrival-date window."
                                    tone="amber"
                                />
                            </div>
                        </article>
                    </section>

                    {/* footer disclaimer */}
                    <div className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 text-[10px] leading-4 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <p>
                            Report data is calculated from records currently saved in the clinic database. It does not
                            infer payer approval, cash receipts, or claim acceptance from invoice values or HTTP
                            responses.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}

/* ------------------------------- MiniGauge ------------------------------- */

function MiniGauge({ title, pct, caption }: { title: string; pct: number; caption: string }) {
    const r = 26;
    const c = 2 * Math.PI * r;
    const dash = (pct / 100) * c;
    return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="flex items-start justify-between">
                <p className="text-[9px] uppercase tracking-wider text-emerald-100/80">{title}</p>
                <TrendingUp className="h-3 w-3 text-emerald-200/80" />
            </div>
            <div className="mt-1 flex items-center gap-2">
                <div className="relative h-12 w-12 shrink-0">
                    <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
                        <circle
                            cx="30"
                            cy="30"
                            r={r}
                            fill="none"
                            className="text-white/15"
                            stroke="currentColor"
                            strokeWidth="5"
                        />
                        <circle
                            cx="30"
                            cy="30"
                            r={r}
                            fill="none"
                            stroke="#a7f3d0"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${c - dash}`}
                            className="transition-all duration-1000"
                        />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="text-xl font-bold leading-tight">{pct}%</p>
                    <p className="text-[10px] leading-3 text-emerald-50/75">{caption}</p>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------- Guide card ------------------------------- */

function GuideCard({
    icon: Icon,
    title,
    body,
    tone,
}: {
    icon: typeof Activity;
    title: string;
    body: string;
    tone: 'emerald' | 'violet' | 'sky' | 'amber';
}) {
    const toneMap = {
        emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
        sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
        amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    } as const;
    return (
        <div className="rounded-lg border border-slate-100 bg-[#f7faf9] p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                <span className={`flex h-5 w-5 items-center justify-center rounded-md ${toneMap[tone]}`}>
                    <Icon className="h-3 w-3" />
                </span>
                {title}
            </p>
            <p className="mt-1.5 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{body}</p>
        </div>
    );
}
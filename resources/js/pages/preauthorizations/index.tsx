import { Head, Link, router } from '@inertiajs/react';
import {
    ShieldCheck, ArrowUpRight, ClipboardCheck, CircleAlert,
    ChevronLeft, ChevronRight, User, Activity, ServerCog,
    CalendarClock, LoaderCircle, ArrowRight, Hash, CheckCircle2,
    XCircle, AlertCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type Transaction = {
    id: number; provider: string; operation: string; environment: string;
    status: string; http_status: number | null; provider_reference: string | null;
    patient_name: string | null; medical_record_number: string | null;
    encounter_number: string | null; created_at: string | null;
    completed_at: string | null; error_code: string | null;
};
type Link_ = { url: string | null; label: string; active: boolean };
type Props = { transactions: { data: Transaction[]; current_page: number; last_page: number; total: number; links: Link_[] } };

const label = (v: string | null | undefined) =>
    v ? v.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';

const formatDate = (v: string | null) => {
    if (!v) return '—';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleString(undefined, {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

function statusTone(status: string) {
    const s = (status || '').toLowerCase();
    if (['succeeded', 'success', 'ok', 'approved'].includes(s))
        return {
            pill: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50',
            dot: 'bg-emerald-500',
            icon: CheckCircle2
        };
    if (['failed', 'error', 'rejected', 'denied'].includes(s))
        return {
            pill: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/50',
            dot: 'bg-rose-500',
            icon: XCircle
        };
    return {
        pill: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50',
        dot: 'bg-amber-500',
        icon: AlertCircle
    };
}

export default function PreauthorizationsIndex({ transactions }: Props) {
    const [perPage, setPerPage] = useState<number>(15);
    const [loading, setLoading] = useState(false);

    const goTo = (url: string | null) => {
        if (!url) return;
        setLoading(true);
        router.visit(url, {
            preserveScroll: true,
            preserveState: false,
            onFinish: () => setLoading(false),
        });
    };

    const changePerPage = (value: number) => {
        setPerPage(value);
        const url = new URL(window.location.href);
        url.searchParams.set('per_page', String(value));
        url.searchParams.set('page', '1');
        goTo(url.toString());
    };

    const compactLinks = useMemo(() => {
        const links = transactions.links || [];
        const prev = links[0];
        const next = links[links.length - 1];
        const numbers = links.slice(1, -1);
        const current = transactions.current_page;
        const total = transactions.last_page;
        
        const windowSet = new Set<number>();
        windowSet.add(1);
        windowSet.add(total);
        for (let i = current - 1; i <= current + 1; i++) if (i >= 1 && i <= total) windowSet.add(i);
        
        const sorted = Array.from(windowSet).sort((a, b) => a - b);
        const withGaps: (number | 'gap')[] = [];
        sorted.forEach((n, i) => {
            if (i > 0 && n - sorted[i - 1] > 1) withGaps.push('gap');
            withGaps.push(n);
        });
        return { prev, next, numbers, pages: withGaps };
    }, [transactions]);

    const Pagination = ({ position }: { position: 'top' | 'bottom' }) => (
        <div className={`flex flex-wrap items-center justify-between gap-2 ${position === 'top' ? 'px-3 py-2 sm:px-4 border-b border-emerald-100/60 dark:border-slate-800/60 bg-white dark:bg-[#111c2d]' : 'px-3 py-2.5 sm:px-4 border-t border-emerald-100/70 dark:border-slate-800 bg-emerald-50/30 dark:bg-slate-900/40'}`}>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Show</span>
                <select
                    value={perPage}
                    onChange={(e) => changePerPage(Number(e.target.value))}
                    className="h-7 rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                    {[10, 15, 25, 50, 100, 200].map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    · {transactions.total} total
                </span>
                {loading && <LoaderCircle className="h-3 w-3 animate-spin text-emerald-600 dark:text-emerald-400 ml-1" />}
            </div>

            {transactions.last_page > 1 && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => goTo(transactions.links[0]?.url)}
                        disabled={!transactions.links[0]?.url}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </button>

                    {compactLinks.pages.map((p, i) =>
                        p === 'gap' ? (
                            <span key={`gap-${i}`} className="px-1 text-[10px] text-slate-400 dark:text-slate-500">…</span>
                        ) : (
                            <button
                                key={`page-${p}-${i}`}
                                onClick={() => goTo(compactLinks.numbers[p - 1]?.url ?? null)}
                                disabled={p === transactions.current_page}
                                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg border px-2 text-[11px] font-semibold transition-colors ${
                                    p === transactions.current_page
                                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm shadow-emerald-900/20 cursor-default'
                                        : 'border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => goTo(transactions.links[transactions.links.length - 1]?.url)}
                        disabled={!transactions.links[transactions.links.length - 1]?.url}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Head title="Preauthorizations" />
            <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-3 py-4 sm:px-4 md:px-6 md:py-6 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-3.5">

                    {/* HEADER */}
                    <header className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-2.5 text-emerald-800 shadow-sm dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-300">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[.17em] text-emerald-700 dark:text-emerald-400">
                                    Patient access · Authorization
                                </p>
                                <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-2xl">
                                    Preauthorizations
                                </h1>
                                <p className="mt-0.5 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
                                    Review recorded preauthorization integration activity and its provider response.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-emerald-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-300 shadow-sm">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {transactions.total} transaction{transactions.total === 1 ? '' : 's'}
                        </div>
                    </header>

                    {/* NOTICE */}
                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                        <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <div>
                            <p className="font-semibold">No invented authorization results</p>
                            <p className="mt-0.5 leading-relaxed">
                                This workspace displays preauthorization transactions recorded by the configured integration. It does not create a request or claim approval unless the approved API contract is configured and a provider response is recorded.
                            </p>
                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-sm overflow-hidden">
                        <div className="border-b border-emerald-100/70 bg-gradient-to-br from-[#e9fbf2] to-[#d8f6e8]/50 dark:border-slate-800 dark:bg-none dark:bg-slate-900/60 px-3 py-3 sm:px-5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 shrink-0">
                                    <ClipboardCheck className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Preauthorization activity</h2>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        Page {transactions.current_page} of {transactions.last_page}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {transactions.data.length ? (
                            <>
                                <Pagination position="top" />

                                {/* MOBILE CARD VIEW (Visible on < md) */}
                                <div className="block md:hidden divide-y divide-emerald-100/60 dark:divide-slate-800/60">
                                    {transactions.data.map((t) => {
                                        const tone = statusTone(t.status);
                                        const StatusIcon = tone.icon;
                                        const isSameTime = t.created_at && t.completed_at && new Date(t.created_at).getTime() === new Date(t.completed_at).getTime();
                                        const hasCompleted = t.completed_at && !isSameTime;

                                        return (
                                            <div key={t.id} className="p-3.5 space-y-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                {/* Top Row: Patient & Status */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">
                                                            {t.patient_name || <span className="text-slate-400 italic font-normal">Not linked</span>}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                                            <span>{t.medical_record_number || 'No MRN'}</span>
                                                            <span className="text-slate-300 dark:text-slate-600">·</span>
                                                            <span>{t.encounter_number || 'No Encounter'}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tone.pill}`}>
                                                        <StatusIcon className="h-2.5 w-2.5" />
                                                        {label(t.status)}
                                                    </div>
                                                </div>

                                                {/* Middle Row: Operation Context */}
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                        {label(t.operation)}
                                                    </span>
                                                    <span className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                                                        {label(t.provider)}
                                                    </span>
                                                    <span className="inline-flex rounded-md border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                        {label(t.environment)}
                                                    </span>
                                                </div>

                                                {/* Bottom Row: Diagnostics & Time */}
                                                <div className="flex items-end justify-between gap-2 pt-1">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {t.http_status && (
                                                            <span className="inline-flex rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-600 dark:text-slate-400">
                                                                HTTP {t.http_status}
                                                            </span>
                                                        )}
                                                        {t.error_code && (
                                                            <span className="inline-flex rounded bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 font-mono text-[9px] text-rose-700 dark:text-rose-300">
                                                                {t.error_code}
                                                            </span>
                                                        )}
                                                        {t.provider_reference && (
                                                            <span className="inline-flex max-w-[100px] truncate rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-500 dark:text-slate-400" title={t.provider_reference}>
                                                                Ref: {t.provider_reference}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-[9.5px] font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                                                            {formatDate(t.created_at)}
                                                        </p>
                                                        {hasCompleted && (
                                                            <p className="text-[8.5px] font-medium text-emerald-700 dark:text-emerald-400 tabular-nums flex items-center justify-end gap-0.5 mt-0.5">
                                                                <ArrowRight className="h-2 w-2" />
                                                                {formatDate(t.completed_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* DESKTOP TABLE VIEW (Visible on >= md) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50/60 dark:bg-slate-900/40 text-[9.5px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                            <tr>
                                                <th className="px-4 py-2 font-semibold">
                                                    <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> Patient Details</span>
                                                </th>
                                                <th className="px-4 py-2 font-semibold">
                                                    <span className="inline-flex items-center gap-1"><ServerCog className="h-3 w-3" /> Integration Activity</span>
                                                </th>
                                                <th className="px-4 py-2 font-semibold">
                                                    <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> Status & Diagnostics</span>
                                                </th>
                                                <th className="px-4 py-2 font-semibold">
                                                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" /> Timestamp</span>
                                                </th>
                                                <th className="px-4 py-2 font-semibold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-100/60 dark:divide-slate-800/60">
                                            {transactions.data.map((t) => {
                                                const tone = statusTone(t.status);
                                                const isSameTime = t.created_at && t.completed_at && new Date(t.created_at).getTime() === new Date(t.completed_at).getTime();
                                                const hasCompleted = t.completed_at && !isSameTime;

                                                return (
                                                    <tr key={t.id} className="group hover:bg-emerald-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                                                                        {t.patient_name || <span className="text-slate-400 italic font-normal">Not linked</span>}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 dark:text-slate-400 font-mono">
                                                                    <span>{t.medical_record_number || 'No MRN'}</span>
                                                                    <span className="text-slate-300 dark:text-slate-600">·</span>
                                                                    <span>{t.encounter_number || 'No Encounter'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                                                                        {label(t.operation)}
                                                                    </span>
                                                                    <span className="inline-flex rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                                                                        {label(t.provider)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                                    <span>{label(t.environment)}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex flex-col items-start gap-1">
                                                                <div className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${tone.pill}`}>
                                                                    <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                                                                    {label(t.status)}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {t.http_status && (
                                                                        <span className="inline-flex rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-600 dark:text-slate-400">
                                                                            HTTP {t.http_status}
                                                                        </span>
                                                                    )}
                                                                    {t.error_code && (
                                                                        <span className="inline-flex rounded bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 font-mono text-[9px] text-rose-700 dark:text-rose-300">
                                                                            {t.error_code}
                                                                        </span>
                                                                    )}
                                                                    {t.provider_reference && (
                                                                        <span className="inline-flex max-w-[100px] truncate rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-500 dark:text-slate-400" title={t.provider_reference}>
                                                                            Ref: {t.provider_reference}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                                                                    {formatDate(t.created_at)}
                                                                </span>
                                                                {hasCompleted && (
                                                                    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                                                                        <ArrowRight className="h-2.5 w-2.5" />
                                                                        {formatDate(t.completed_at)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right">
                                                            {t.patient_name && (
                                                                <Link
                                                                    href={`/patients?q=${encodeURIComponent(t.medical_record_number || '')}`}
                                                                    className="inline-flex h-6 w-6 items-center justify-center rounded border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 opacity-0 group-hover:opacity-100 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                                                    title="View Patient"
                                                                >
                                                                    <ArrowUpRight className="h-3 w-3" />
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <Pagination position="bottom" />
                            </>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-12 text-center">
                                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-emerald-700 dark:text-emerald-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">No preauthorization activity yet</h3>
                                <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    No matching preauthorization transactions have been recorded. The workspace is ready to display results once the approved HIE/SHA preauthorization operation is configured and invoked.
                                </p>
                                <Button asChild variant="outline" size="sm" className="mt-3 h-7 rounded-lg border-emerald-200 bg-white text-[11px] text-emerald-800 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                                    <Link href="/visits">View visits</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
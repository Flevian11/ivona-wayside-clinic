import { Head, Link, router, useForm } from '@inertiajs/react';
import { 
    Package, Plus, Search, ClipboardCheck, Clock3, Truck, CheckCircle2, X, 
    ArrowRight, ShieldCheck, TrendingUp, Activity, AlertTriangle, ListChecks, 
    Banknote, FileCheck2, CircleDot, Filter 
} from 'lucide-react';
import { useState, useMemo } from 'react';

/* ------------------------------ Types (unchanged) ----------------------------- */

type RequestRow = { id: number; request_number: string; item_description: string; category: string | null; quantity: string | number; unit: string; estimated_unit_cost: string | number | null; supplier_name: string | null; priority: string; status: string; justification: string | null; review_notes: string | null; requester_name: string | null; reviewer_name: string | null; created_at: string; reviewed_at: string | null };
type Page<T> = { data: T[]; current_page: number; last_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
type Props = { summary: { total: number; pending: number; approved: number; received: number; estimated_value: number }; requests: Page<RequestRow>; filters: { q: string; status: string } };

/* ------------------------------ Helpers (unchanged) ----------------------------- */

const cash = (n: number | string | null) => n === null ? 'Not estimated' : `KSh ${Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const statusTone: Record<string, string> = { 
    pending: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60', 
    approved: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60', 
    ordered: 'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/60', 
    received: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60', 
    rejected: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60', 
    cancelled: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' 
};

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
                <strong className="text-2xl font-semibold leading-none tracking-tight text-slate-950 tabular-nums dark:text-slate-50">{typeof value === 'number' ? value.toLocaleString() : value}</strong>
            </div>
            <p className="mt-2 truncate text-[11px] text-slate-500 dark:text-slate-400">{caption}</p>
        </article>
    );
}

/* ---------------------------------- Page --------------------------------- */

export default function ProcurementIndex({ summary, requests, filters }: Props) {
    const [showForm, setShowForm] = useState(false); 
    const [review, setReview] = useState<RequestRow | null>(null);
    
    const form = useForm({ item_description: '', category: '', quantity: '1', unit: 'unit', estimated_unit_cost: '', supplier_name: '', priority: 'normal', justification: '' });
    const reviewForm = useForm({ decision: 'approved', review_notes: '' });
    
    const submit = (e: React.FormEvent) => { e.preventDefault(); form.post('/procurement/requests', { preserveScroll: true, onSuccess: () => { form.reset(); setShowForm(false); } }); };
    const decide = (e: React.FormEvent) => { e.preventDefault(); if (!review) return; reviewForm.post(`/procurement/requests/${review.id}/review`, { preserveScroll: true, onSuccess: () => { setReview(null); reviewForm.reset(); } }); };
    const search = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const d = new FormData(e.currentTarget); router.get('/procurement', { q: d.get('q') || '', status: d.get('status') || '' }, { preserveState: true, preserveScroll: true }); };

    return (
        <>
            <Head title="Procurement" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .table-row { animation: rowIn .35s ease-out both; }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] px-4 py-5 text-slate-900 dark:bg-[#08131a] dark:text-slate-100 md:px-6 md:py-6 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-4">
                    
                    {/* HERO */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <Package className="h-3 w-3" /> Clinic operations · Procurement
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">Procurement & supplies <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    Raise supply requests, track approvals and record receiving. Every request has an owner, a status and a review trail.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    <button onClick={() => setShowForm(v => !v)} className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800">
                                        <Plus className="h-4 w-4"/> {showForm ? 'Close form' : 'New requisition'}
                                    </button>
                                    <Link href="/inventory" className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                                        View inventory <ArrowRight className="h-4 w-4"/>
                                    </Link>
                                </div>
                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[
                                        { k: 'Total', v: summary.total, i: ListChecks }, 
                                        { k: 'Pending', v: summary.pending, i: Clock3 }, 
                                        { k: 'Approved', v: summary.approved, i: FileCheck2 }
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

                        {/* RIGHT HERO - Requisition Pulse */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6 flex flex-col justify-between">
                            <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[26px] border-white/[.08]" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100">
                                    <TrendingUp className="h-3 w-3" /> Requisition Pulse
                                </span>
                                <h2 className="mt-3 text-lg font-bold tracking-tight">{summary.pending.toLocaleString()} awaiting review</h2>
                                <p className="mt-1 text-[11px] leading-5 text-emerald-50/80">Prioritize urgent clinical supplies, approve requests with clear justification and record receipt only after goods arrive.</p>
                                
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><Truck className="h-3 w-3" /> Approved / ordered</p>
                                        <p className="mt-1 text-xl font-bold">{summary.approved}</p>
                                    </div>
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><Banknote className="h-3 w-3" /> Estimated pipeline</p>
                                        <p className="mt-1 text-xl font-bold truncate">{cash(summary.estimated_value)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STAT CARDS */}
                    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <StatCard label="All requests" value={summary.total} caption="Logged in register" tone="sky" icon={Package} delay={0} />
                        <StatCard label="Pending review" value={summary.pending} caption="Awaiting approval" tone={summary.pending > 0 ? 'amber' : 'emerald'} icon={Clock3} delay={40} />
                        <StatCard label="Approved / ordered" value={summary.approved} caption="In the pipeline" tone="violet" icon={Truck} delay={80} />
                        <StatCard label="Received" value={summary.received} caption="Goods delivered" tone="emerald" icon={CheckCircle2} delay={120} />
                    </section>

                    {/* CREATE FORM */}
                    {showForm && (
                        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]" style={{ animation: 'cardIn 0.4s ease-out' }}>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">Create procurement requisition</h2>
                                    <p className="mt-1 text-xs text-slate-500">Requests start as pending and must be reviewed by an authorized approver.</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
                            </div>
                            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <label className="text-xs font-semibold sm:col-span-2">Item / supply description<input required value={form.data.item_description} onChange={e => form.setData('item_description', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <label className="text-xs font-semibold">Category<input value={form.data.category} onChange={e => form.setData('category', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <label className="text-xs font-semibold">Supplier (optional)<input value={form.data.supplier_name} onChange={e => form.setData('supplier_name', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <label className="text-xs font-semibold">Quantity<input type="number" min="0.001" step="0.001" required value={form.data.quantity} onChange={e => form.setData('quantity', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <label className="text-xs font-semibold">Unit<input required value={form.data.unit} onChange={e => form.setData('unit', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <label className="text-xs font-semibold">Estimated unit cost (KSh)<input type="number" min="0" step="0.01" value={form.data.estimated_unit_cost} onChange={e => form.setData('estimated_unit_cost', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <label className="text-xs font-semibold">Priority<select value={form.data.priority} onChange={e => form.setData('priority', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">{['low', 'normal', 'high', 'urgent'].map(v => <option key={v} value={v}>{v[0].toUpperCase() + v.slice(1)}</option>)}</select></label>
                                <label className="text-xs font-semibold sm:col-span-2 lg:col-span-4">Justification / clinical need<textarea value={form.data.justification} onChange={e => form.setData('justification', e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" /></label>
                                <div className="flex items-end sm:col-span-2 lg:col-span-4">
                                    <button disabled={form.processing} className="h-10 rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50">{form.processing ? 'Submitting…' : 'Submit for review'}</button>
                                </div>
                                {Object.values(form.errors).length > 0 && <p className="text-sm text-rose-600 sm:col-span-2 lg:col-span-4">{Object.values(form.errors).join(' ')}</p>}
                            </form>
                        </section>
                    )}

                    {/* TABLE */}
                    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Procurement register</h2>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{requests.total} requisitions · requests awaiting review appear first</p>
                            </div>
                            <form onSubmit={search} className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input name="q" defaultValue={filters.q} placeholder="Search request, item, supplier" className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
                                </div>
                                <select name="status" defaultValue={filters.status} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium dark:border-slate-700 dark:bg-slate-900">
                                    <option value="">All statuses</option>
                                    {['pending', 'approved', 'ordered', 'received', 'rejected', 'cancelled'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                </select>
                                <button className="h-9 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800">Filter</button>
                            </form>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] text-left text-sm">
                                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                    <tr>{['Request / item', 'Quantity', 'Estimated value', 'Priority', 'Status', 'Requested by / date', 'Action'].map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {requests.data.map((r, index) => (
                                        <tr key={r.id} className="table-row transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30" style={{ animationDelay: `${index * 25}ms` }}>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100">{r.item_description}</p>
                                                <p className="mt-1 text-[11px] text-slate-500">{r.request_number} · {r.category || 'Uncategorised'}{r.supplier_name ? ` · ${r.supplier_name}` : ''}</p>
                                                {r.justification && <p className="mt-1 max-w-sm text-[11px] text-slate-500 italic">"{r.justification}"</p>}
                                            </td>
                                            <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">{Number(r.quantity).toLocaleString()} {r.unit}</td>
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{cash(r.estimated_unit_cost === null ? null : Number(r.estimated_unit_cost) * Number(r.quantity))}</td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${r.priority === 'urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' : r.priority === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                    {r.priority}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusTone[r.status] || statusTone.pending}`}>
                                                    {r.status.replace('_', ' ')}
                                                </span>
                                                {r.review_notes && <p className="mt-1.5 max-w-[180px] text-[10px] text-slate-500">{r.review_notes}</p>}
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.requester_name || 'Unknown user'}</p>
                                                <p className="mt-0.5 text-[10px] text-slate-500">{new Date(r.created_at).toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })}</p>
                                                {r.reviewer_name && <p className="mt-1 text-[10px] text-slate-500">Reviewed by {r.reviewer_name}</p>}
                                            </td>
                                            <td className="px-5 py-4">
                                                {['pending', 'approved', 'ordered'].includes(r.status) && (
                                                    <button onClick={() => { setReview(r); reviewForm.setData({ decision: r.status === 'pending' ? 'approved' : r.status === 'approved' ? 'ordered' : 'received', review_notes: r.review_notes || '' }); }} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                                                        Review <ArrowRight className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                                {r.status === 'received' && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" /> Complete</span>}
                                                {r.status === 'rejected' && <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400"><X className="h-3.5 w-3.5" /> Closed</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {requests.data.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800/50"><Package className="h-6 w-6" /></div>
                                    <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">No procurement requests found</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adjust your filters or raise a new requisition.</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <span>Page {requests.current_page} of {requests.last_page} · {requests.total} requests</span>
                            <div className="flex gap-1">
                                {requests.links.map((l, i) => (
                                    <button key={i} disabled={!l.url} onClick={() => l.url && router.visit(l.url, { preserveScroll: true })} className={`min-w-8 h-8 rounded-lg px-2.5 text-[11px] font-semibold transition ${l.active ? 'bg-emerald-700 text-white shadow-sm' : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'} disabled:opacity-40`} dangerouslySetInnerHTML={{ __html: l.label }} />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* REVIEW MODAL */}
            {review && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
                    <form onSubmit={decide} className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-[#f6faf8] shadow-2xl dark:border-slate-700 dark:bg-[#0d1824]" style={{ animation: 'cardIn 0.2s ease-out' }}>
                        <header className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] px-5 py-4 dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">{review.request_number}</span>
                                    <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">Review requisition</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.item_description} · {review.quantity} {review.unit}</p>
                                </div>
                                <button type="button" onClick={() => setReview(null)} className="rounded-lg p-2 text-slate-500 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
                            </div>
                        </header>
                        
                        <div className="p-5 space-y-4">
                            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                                <p className="text-xs"><strong className="text-slate-700 dark:text-slate-300">Requested by:</strong> <span className="text-slate-600 dark:text-slate-400">{review.requester_name || 'Unknown'}</span></p>
                                <p className="mt-1.5 text-xs"><strong className="text-slate-700 dark:text-slate-300">Estimated total:</strong> <span className="text-slate-600 dark:text-slate-400 font-semibold">{cash(review.estimated_unit_cost === null ? null : Number(review.estimated_unit_cost) * Number(review.quantity))}</span></p>
                                <p className="mt-1.5 text-xs"><strong className="text-slate-700 dark:text-slate-300">Justification:</strong> <span className="text-slate-600 dark:text-slate-400 italic">{review.justification || 'Not provided'}</span></p>
                            </div>
                            
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Next status
                                <select value={reviewForm.data.decision} onChange={e => reviewForm.setData('decision', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                                    <option value="approved">Approve request</option>
                                    <option value="rejected">Reject request</option>
                                    <option value="ordered">Mark as ordered</option>
                                    <option value="received">Confirm received</option>
                                </select>
                            </label>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Review note
                                <textarea value={reviewForm.data.review_notes} onChange={e => reviewForm.setData('review_notes', e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
                            </label>
                            {Object.values(reviewForm.errors).length > 0 && <p className="text-sm text-rose-600">{Object.values(reviewForm.errors).join(' ')}</p>}
                        </div>
                        
                        <footer className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
                            <button type="button" onClick={() => setReview(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Cancel</button>
                            <button disabled={reviewForm.processing} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50">
                                <ShieldCheck className="h-4 w-4" /> {reviewForm.processing ? 'Saving…' : 'Save decision'}
                            </button>
                        </footer>
                    </form>
                </div>
            )}
        </>
    );
}
import { Head, Link, router, useForm } from '@inertiajs/react';
import { 
    Boxes, Search, Plus, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, 
    PackageCheck, Warehouse, X, RefreshCw, Clock3, Activity, TrendingUp, 
    CircleDot, Filter, Hash, MapPin, Truck, ShieldAlert, ArrowRight, Minus
} from 'lucide-react';
import { useState, useMemo } from 'react';

// local import fix
import { ListChecks } from 'lucide-react';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Item = { id: number; sku: string; name: string; category: string | null; unit: string; quantity_on_hand: string | number; reorder_level: string | number; unit_cost: string | number; location: string | null; supplier_name: string | null; created_at: string };
type Page<T> = { data: T[]; current_page: number; last_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
type Props = { summary: { items: number; low_stock: number; stock_value: number; pending_requests: number }; items: Page<Item>; categories: string[]; movements: { id: number; movement_type: string; quantity_change: string | number; balance_after: string | number; reference: string | null; created_at: string; item_name: string; sku: string; performed_by: string | null }[]; filters: { q: string; category: string; stock: string } };

/* ------------------------------ Helpers (unchanged) ----------------------------- */

const money = (n: number | string) => `KSh ${Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* -------------------------------- Stat card ------------------------------- */

function StatCard({ label: title, value, caption, tone, icon: Icon, delay = 0 }: { label: string; value: number | string; caption: string; tone: 'emerald' | 'amber' | 'sky' | 'rose'; icon: typeof Activity; delay?: number; }) {
    const toneMap = {
        emerald: { icon: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300', line: '#10b981', glow: 'shadow-emerald-500/10' },
        amber: { icon: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300', line: '#f59e0b', glow: 'shadow-amber-500/10' },
        sky: { icon: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300', line: '#0ea5e9', glow: 'shadow-sky-500/10' },
        rose: { icon: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300', line: '#f43f5e', glow: 'shadow-rose-500/10' },
    } as const;
    const t = toneMap[tone];
    
    // Generate a stable sparkline based on the value length
    const bars = useMemo(() => {
        const seed = (typeof value === 'number' ? value : title.length) % 11;
        return Array.from({ length: 7 }, (_, i) => 25 + Math.round(Math.abs(Math.sin(i + seed)) * 60));
    }, [value, title]);

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

export default function InventoryIndex({ summary, items, categories, movements, filters }: Props) {
    const [showAdd, setShowAdd] = useState(false); 
    const [adjust, setAdjust] = useState<Item | null>(null);
    
    const add = useForm({ sku: '', name: '', category: '', unit: 'unit', quantity_on_hand: '0', reorder_level: '0', unit_cost: '0', location: '', supplier_name: '' });
    const stock = useForm({ direction: 'in', quantity: '', reference: '', notes: '' });
    
    const submitAdd = (e: React.FormEvent) => { e.preventDefault(); add.post('/inventory/items', { preserveScroll: true, onSuccess: () => { add.reset(); setShowAdd(false); } }); };
    const submitStock = (e: React.FormEvent) => { e.preventDefault(); if (!adjust) return; stock.post(`/inventory/items/${adjust.id}/movements`, { preserveScroll: true, onSuccess: () => { stock.reset(); setAdjust(null); } }); };
    const search = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const d = new FormData(e.currentTarget); router.get('/inventory', { q: d.get('q') || '', category: d.get('category') || '', stock: d.get('stock') || '' }, { preserveState: true, preserveScroll: true }); };

    return (
        <>
            <Head title="Inventory & stores" />
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
                                        <Boxes className="h-3 w-3" /> Clinic operations · Inventory
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">Inventory & stores <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    Keep stock levels, reorder thresholds and movement history in one place. Quantities change only through recorded stock movements.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    <button onClick={() => setShowAdd(v => !v)} className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800">
                                        <Plus className="h-4 w-4"/> {showAdd ? 'Close form' : 'Add stock item'}
                                    </button>
                                    <Link href="/procurement" className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                                        Procurement requests <ArrowRight className="h-4 w-4"/>
                                    </Link>
                                </div>
                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[
                                        { k: 'Total Items', v: summary.items, i: ListChecks }, 
                                        { k: 'Low Stock', v: summary.low_stock, i: AlertTriangle }, 
                                        { k: 'Pending', v: summary.pending_requests, i: Clock3 }
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

                        {/* RIGHT HERO - Stock Pulse */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6 flex flex-col justify-between">
                            <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[26px] border-white/[.08]" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100">
                                    <TrendingUp className="h-3 w-3" /> Stock Pulse
                                </span>
                                <h2 className="mt-3 text-lg font-bold tracking-tight">{summary.low_stock.toLocaleString()} items need attention</h2>
                                <p className="mt-1 text-[11px] leading-5 text-emerald-50/80">Review reorder thresholds before supplies run short. Stock valuation uses the recorded unit cost and on-hand quantity.</p>
                                
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><Warehouse className="h-3 w-3" /> Active items</p>
                                        <p className="mt-1 text-xl font-bold">{summary.items.toLocaleString()}</p>
                                    </div>
                                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                                        <p className="text-[9px] uppercase tracking-wider text-emerald-200 flex items-center gap-1"><PackageCheck className="h-3 w-3" /> Valuation</p>
                                        <p className="mt-1 text-xl font-bold">{money(summary.stock_value)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STAT CARDS */}
                    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <StatCard label="Active stock items" value={summary.items} caption="Registered in inventory" tone="emerald" icon={Boxes} delay={0} />
                        <StatCard label="Below reorder level" value={summary.low_stock} caption="Requires replenishment" tone={summary.low_stock > 0 ? 'amber' : 'emerald'} icon={AlertTriangle} delay={40} />
                        <StatCard label="Pending procurement" value={summary.pending_requests} caption="Awaiting approval" tone="sky" icon={Clock3} delay={80} />
                        <StatCard label="Stock valuation" value={money(summary.stock_value)} caption="Unit cost × on-hand" tone="rose" icon={PackageCheck} delay={120} />
                    </section>

                    {/* ADD FORM */}
                    {showAdd && (
                        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]" style={{ animation: 'cardIn 0.4s ease-out' }}>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">Register inventory item</h2>
                                    <p className="mt-1 text-xs text-slate-500">Opening quantity creates an auditable opening-stock movement.</p>
                                </div>
                                <button onClick={() => setShowAdd(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
                            </div>
                            <form onSubmit={submitAdd} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {([['sku','SKU / item code'],['name','Item name'],['category','Category'],['unit','Unit'],['quantity_on_hand','Opening quantity'],['reorder_level','Reorder level'],['unit_cost','Unit cost (KSh)'],['location','Store location'],['supplier_name','Supplier']] as [keyof typeof add.data,string][]).map(([key,label]) => (
                                    <label key={key} className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}
                                        <input value={(add.data as Record<string,string>)[String(key)] ?? ''} onChange={e => add.setData(key as any, e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900" required={['sku','name','unit','quantity_on_hand','reorder_level','unit_cost'].includes(String(key))} />
                                    </label>
                                ))}
                                <div className="flex items-end">
                                    <button disabled={add.processing} className="h-[42px] w-full rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50">{add.processing ? 'Saving…' : 'Save inventory item'}</button>
                                </div>
                                {Object.values(add.errors).length > 0 && <p className="text-sm text-rose-600 sm:col-span-2 lg:col-span-4">{Object.values(add.errors).join(' ')}</p>}
                            </form>
                        </section>
                    )}

                    {/* TABLE */}
                    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Stock register</h2>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{items.total} item records · low stock is highlighted first</p>
                            </div>
                            <form onSubmit={search} className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input name="q" defaultValue={filters.q} placeholder="Search item, SKU, supplier" className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
                                </div>
                                <select name="category" defaultValue={filters.category} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium dark:border-slate-700 dark:bg-slate-900">
                                    <option value="">All categories</option>
                                    {categories.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <select name="stock" defaultValue={filters.stock} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium dark:border-slate-700 dark:bg-slate-900">
                                    <option value="">All stock levels</option>
                                    <option value="low">Low stock</option>
                                    <option value="available">Above reorder</option>
                                </select>
                                <button className="h-9 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800">Filter</button>
                            </form>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                    <tr>{['Item / SKU','Category & location','On hand','Reorder level','Unit cost','Stock value','Action'].map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {items.data.map((i, index) => {
                                        const low = Number(i.quantity_on_hand) <= Number(i.reorder_level);
                                        return (
                                            <tr key={i.id} className="table-row transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30" style={{ animationDelay: `${index * 25}ms` }}>
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{i.name}</p>
                                                    <p className="mt-1 flex items-center gap-1 font-mono text-[10px] text-slate-500"><Hash className="h-3 w-3" />{i.sku}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-xs font-medium capitalize text-slate-700 dark:text-slate-300">{i.category || 'Uncategorised'}</p>
                                                    <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><MapPin className="h-3 w-3" />{i.location || 'Location not set'}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${low ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'}`}>
                                                        {Number(i.quantity_on_hand).toLocaleString()} {i.unit}{low ? ' · Low' : ''}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">{Number(i.reorder_level).toLocaleString()} {i.unit}</td>
                                                <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">{money(i.unit_cost)}</td>
                                                <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{money(Number(i.quantity_on_hand) * Number(i.unit_cost))}</td>
                                                <td className="px-5 py-4">
                                                    <button onClick={() => { setAdjust(i); stock.reset(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                                                        <RefreshCw className="h-3.5 w-3.5" /> Adjust
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {items.data.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800/50"><Boxes className="h-6 w-6" /></div>
                                    <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">No inventory items found</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adjust your filters or register a new item.</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <span>Page {items.current_page} of {items.last_page} · {items.total} items</span>
                            <div className="flex gap-1">
                                {items.links.map((l, i) => (
                                    <button key={i} disabled={!l.url} onClick={() => l.url && router.visit(l.url, { preserveScroll: true })} className={`min-w-8 h-8 rounded-lg px-2.5 text-[11px] font-semibold transition ${l.active ? 'bg-emerald-700 text-white shadow-sm' : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'} disabled:opacity-40`} dangerouslySetInnerHTML={{ __html: l.label }} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* RECENT MOVEMENTS */}
                    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent stock movements</h2>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Audit trail for stock received, issued and opening balances.</p>
                            </div>
                            <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                            {movements.map(m => (
                                <div key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${Number(m.quantity_change) >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'}`}>
                                        {Number(m.quantity_change) >= 0 ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{m.item_name} <span className="font-normal text-slate-500">· {m.sku}</span></p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.movement_type.replaceAll('_', ' ')} · {m.reference || 'No reference'} · {m.performed_by || 'Unknown user'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${Number(m.quantity_change) >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>{Number(m.quantity_change) > 0 ? '+' : ''}{Number(m.quantity_change)}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Balance {Number(m.balance_after)}</p>
                                    </div>
                                </div>
                            ))}
                            {movements.length === 0 && <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-900">Stock movements will appear after items are registered or adjusted.</p>}
                        </div>
                    </section>
                </div>
            </main>

            {/* ADJUST MODAL */}
            {adjust && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
                    <form onSubmit={submitStock} className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-[#f6faf8] shadow-2xl dark:border-slate-700 dark:bg-[#0d1824]" style={{ animation: 'cardIn 0.2s ease-out' }}>
                        <header className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] px-5 py-4 dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Adjust stock</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{adjust.name} · balance {adjust.quantity_on_hand} {adjust.unit}</p>
                                </div>
                                <button type="button" onClick={() => setAdjust(null)} className="rounded-lg p-2 text-slate-500 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
                            </div>
                        </header>
                        <div className="p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Movement
                                    <select value={stock.data.direction} onChange={e => stock.setData('direction', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                                        <option value="in">Receive stock (+)</option>
                                        <option value="out">Issue stock (−)</option>
                                    </select>
                                </label>
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity
                                    <input type="number" min="0.001" step="0.001" required value={stock.data.quantity} onChange={e => stock.setData('quantity', e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                                </label>
                            </div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Reference
                                <input value={stock.data.reference} onChange={e => stock.setData('reference', e.target.value)} placeholder="Delivery note / issue reference" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                            </label>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Notes
                                <textarea value={stock.data.notes} onChange={e => stock.setData('notes', e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" rows={3} />
                            </label>
                            {Object.values(stock.errors).length > 0 && <p className="text-sm text-rose-600">{Object.values(stock.errors).join(' ')}</p>}
                        </div>
                        <footer className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
                            <button type="button" onClick={() => setAdjust(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Cancel</button>
                            <button disabled={stock.processing} className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50">{stock.processing ? 'Saving…' : 'Record movement'}</button>
                        </footer>
                    </form>
                </div>
            )}
        </>
    );
}


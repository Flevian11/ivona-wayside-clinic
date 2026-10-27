import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, UserRound, ArrowUpRight, CalendarPlus, Activity, ShieldCheck, Hash, Filter, Phone, CheckCircle2, Clock3, Users } from 'lucide-react';
import { FormEvent, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Patient = { id: number; medical_record_number: string; full_name: string | null; date_of_birth: string | null; phone: string | null; registration_source: string; status: string; encounters_count: number };
type Props = { patients: { data: Patient[]; links: { url: string | null; label: string; active: boolean }[]; total: number }; filters: { q: string }; can: { register: boolean } };

export default function PatientsIndex({ patients, filters, can }: Props) {
    const [q, setQ] = useState(filters.q);
    const submit = (e: FormEvent) => { e.preventDefault(); router.get('/patients', { q }, { preserveState: true, replace: true }); };

    // Derived stats for the hero panel
    const shaCount = patients.data.filter(p => p.registration_source === 'sha').length;
    const localCount = patients.data.filter(p => p.registration_source !== 'sha').length;
    const totalVisits = patients.data.reduce((n, p) => n + p.encounters_count, 0);

    return (
        <>
            <Head title="Patient registry" />
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .patient-row { animation: rowIn .35s ease-out both; }
            `}</style>

            <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-4">
                    
                    {/* RICH HERO SECTION */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <UserRound className="h-3 w-3" /> Patient Care · Registry
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">Patient registry <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    Search existing records before registering a patient again. All encounters, identifiers, and consents are tied to this longitudinal master record.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    {can.register && (
                                        <Button asChild className="h-9 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                                            <Link href="/patients/create"><Plus className="mr-2 h-4 w-4" />New patient / visit</Link>
                                        </Button>
                                    )}
                                </div>
                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                                    {[
                                        { k: 'Registry Total', v: patients.total, i: Users }, 
                                        { k: 'Page Visits', v: totalVisits, i: Activity }, 
                                        { k: 'SHA Linked', v: shaCount, i: ShieldCheck }
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

                        {/* Right Hero Panel - Registration Sources */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/70 flex flex-col justify-center">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Registration Sources
                            </h3>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Breakdown of records on this page.</p>
                            
                            <div className="mt-5 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-emerald-500" /> SHA / HIE</span>
                                        <span className="text-slate-500 tabular-nums">{shaCount} patients</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.round((shaCount / Math.max(1, patients.data.length)) * 100)}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Hash className="h-3 w-3 text-sky-500" /> Local Registration</span>
                                        <span className="text-slate-500 tabular-nums">{localCount} patients</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className="h-full rounded-full bg-sky-500 transition-all duration-1000" style={{ width: `${Math.round((localCount / Math.max(1, patients.data.length)) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/30">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Linked Visits</span>
                                <strong className="text-sm font-bold text-slate-900 dark:text-slate-100">{totalVisits}</strong>
                            </div>
                        </div>
                    </section>

                    {/* SEARCH & DATA TABLE PANEL */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-sm">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input 
                                        value={q} 
                                        onChange={e=>setQ(e.target.value)} 
                                        placeholder="Search MRN, name, phone or Client Registry ID" 
                                        className="h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 pl-9 text-sm focus-visible:ring-emerald-500" 
                                    />
                                </div>
                                <Button type="submit" className="h-10 rounded-xl px-6 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800">
                                    <Filter className="mr-2 h-4 w-4" /> Apply
                                </Button>
                            </form>
                        </div>

                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/20">
                            <span>{patients.total} patient records matched</span>
                            <span>Page limit: 15</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Patient</th>
                                        <th className="px-5 py-3 font-semibold">MRN</th>
                                        <th className="px-5 py-3 font-semibold">Contact</th>
                                        <th className="px-5 py-3 font-semibold">Source</th>
                                        <th className="px-5 py-3 font-semibold">Visits</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {patients.data.map((p, i) => (
                                        <tr key={p.id} className="patient-row hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors" style={{ animationDelay: `${i * 25}ms` }}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                        <UserRound className="h-4 w-4"/>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.full_name || 'Name not recorded'}</div>
                                                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.date_of_birth || 'DOB not recorded'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-300">
                                                    <Hash className="h-3 w-3 text-slate-400" />{p.medical_record_number}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                                    {p.phone ? <><Phone className="h-3 w-3 text-slate-400" />{p.phone}</> : '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${p.registration_source === 'sha' ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                    {p.registration_source === 'sha' ? <><ShieldCheck className="h-3 w-3" /> SHA</> : 'Local'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                                    <Activity className="h-3.5 w-3.5" />{p.encounters_count}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${p.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'}`}>
                                                    {p.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" asChild className="h-8 rounded-lg px-3 text-xs border-slate-200 dark:border-slate-700">
                                                        <Link href={`/patients/${p.id}`}>View <ArrowUpRight className="ml-1 h-3 w-3"/></Link>
                                                    </Button>
                                                    <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                                                        <Link href={`/patients/${p.id}`}><CalendarPlus className="h-4 w-4"/></Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {patients.data.length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800/50">
                                        <UserRound className="h-6 w-6"/>
                                    </div>
                                    <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">No matching patients</h3>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try a different search or register a new patient after checking identifiers.</p>
                                    {can.register && (
                                        <Button asChild className="mt-4 h-9 rounded-xl bg-emerald-700 text-xs px-5">
                                            <Link href="/patients/create">Register patient</Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {patients.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                                <p className="text-[11px] font-medium text-slate-500">Page navigation</p>
                                <div className="flex flex-wrap gap-1">
                                    {patients.links.map((link,i)=>(
                                        <button 
                                            key={`${link.label}-${i}`} 
                                            disabled={!link.url} 
                                            onClick={()=>link.url&&router.visit(link.url)} 
                                            className={`h-8 min-w-[32px] rounded-lg px-2.5 text-xs font-semibold transition-colors ${link.active ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'} disabled:opacity-40`} 
                                            dangerouslySetInnerHTML={{__html:link.label}}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
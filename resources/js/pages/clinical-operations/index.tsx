import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import {
    Activity, ArrowUpRight, CalendarClock,
    ClipboardList, FlaskConical, HeartPulse, Pill, Search, ShieldCheck, Stethoscope,
    Users, RefreshCw, Clock3, Fingerprint, Building2, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Encounter = {
    id: number; encounter_number: string; patient_name: string | null; mrn: string | null;
    department: string | null; visit_type: string; status: string; priority: string;
    arrived_at: string | null; coverage_type: string | null;
};
type Props = {
    module: 'nursing' | 'laboratory' | 'pharmacy'; title: string; subtitle: string; description: string;
    encounters: { data: Encounter[]; current_page: number; last_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    counts: { active: number; inpatient: number; outpatient: number; sha: number };
    filters: { q: string; status: string };
};
const number = (n: number) => (n || 0).toLocaleString('en-KE');
const pretty = (v: string | null | undefined) => v ? v.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—';
const date = (v: string | null) => v ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' }).format(new Date(v)) : '—';

const themes = {
    nursing: {
        icon: HeartPulse, kicker: 'PATIENT CARE · NURSING STATION', title: 'Care coordination at a glance',
        line: 'from-emerald-700 to-teal-500', pale: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
        hero: 'from-[#d9f7e9] via-[#eefbf4] to-[#c9efdf]', darkHero: 'dark:from-[#0d332b] dark:via-[#102b29] dark:to-[#10202a]',
        narrative: 'Keep patient flow visible and move into the encounter record to continue documented care.',
        callout: 'Patient observations and nursing notes should be saved in the approved encounter workflow.',
    },
    laboratory: {
        icon: FlaskConical, kicker: 'DIAGNOSTICS · LABORATORY', title: 'A clearer view of diagnostic workload',
        line: 'from-sky-700 to-cyan-500', pale: 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
        hero: 'from-[#dcefff] via-[#f0f9ff] to-[#d9f5f7]', darkHero: 'dark:from-[#102b49] dark:via-[#102a38] dark:to-[#10202a]',
        narrative: 'Find the patient encounter quickly and continue the documented diagnostic workflow from the visit.',
        callout: 'Only saved orders and results belong in the clinical record; this register does not invent lab activity.',
    },
    pharmacy: {
        icon: Pill, kicker: 'MEDICINES · PHARMACY SERVICES', title: 'Support safe, traceable medicine workflows',
        line: 'from-violet-700 to-fuchsia-500', pale: 'bg-violet-50 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
        hero: 'from-[#eee5ff] via-[#faf7ff] to-[#f3e4fb]', darkHero: 'dark:from-[#30204b] dark:via-[#211d37] dark:to-[#10202a]',
        narrative: 'Locate the relevant encounter and proceed to the clinical record for prescribed treatment.',
        callout: 'Dispensing and prescription details must be recorded in their designated workflow before reporting.',
    },
} as const;

function MetricCard({ label, value, note, icon: Icon, tone, index }: {
    label: string; value: number; note: string; icon: typeof Activity; tone: string; index: number;
}) {
    return <article style={{ animationDelay: `${index * 45}ms` }} className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111c2d]">
        <div className="flex items-start justify-between gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-4.5 w-4.5" /></span><span className="rounded-full bg-slate-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900">Saved data</span></div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-slate-950 dark:text-white">{number(value)}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{note}</p>
    </article>;
}

export default function ClinicalOperationsIndex({ module, title, subtitle, description, encounters, counts, filters }: Props) {
    const [q, setQ] = useState(filters.q || '');
    const [status, setStatus] = useState(filters.status || '');
    const config = themes[module];
    const Icon = config.icon;
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(`/${module}`, { q, status }, { preserveScroll: true, preserveState: true, replace: true });
    };
    const paginationLabel = (label: string) => {
        const plain = label.replace(/<[^>]*>/g, '').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&amp;/g, '&').trim();
        if (/previous|«/i.test(plain)) return 'Previous';
        if (/next|»/i.test(plain)) return 'Next';
        return plain;
    };

    return <>
        <Head title={title} />
        <style>{`@keyframes clinicCardIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}} .clinic-card-in{animation:clinicCardIn .45s ease-out both}`}</style>
        <main className="min-h-screen w-full bg-[#f4f8f6] px-4 py-5 text-slate-900 transition-colors dark:bg-[#08131a] dark:text-slate-100 md:px-6 md:py-6">
            <div className="mx-auto w-full max-w-none space-y-4">
                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
                    <article className={`clinic-card-in relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br ${config.hero} ${config.darkHero} p-5 shadow-sm dark:border-slate-800 md:p-7`}>
                        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[30px] border-white/30 dark:border-white/[.035]" />
                        <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/20 blur-2xl dark:bg-emerald-400/5" />
                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200`}><Icon className="h-3.5 w-3.5" />{config.kicker}</span><Badge variant="outline" className="border-emerald-900/10 bg-white/50 text-[9px] text-slate-600 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">Live encounter register</Badge></div>
                            <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title} <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{subtitle}</p>
                            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-600 dark:text-slate-300">{description}</p>
                            <div className="mt-5 flex flex-wrap gap-2"><Button asChild className="h-9 rounded-lg bg-emerald-700 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"><Link href="/visits"><ClipboardList className="mr-2 h-3.5 w-3.5" />Open visit register<ArrowUpRight className="ml-1 h-3 w-3" /></Link></Button><Button asChild variant="outline" className="h-9 rounded-lg border-white/80 bg-white/70 text-xs dark:border-slate-700 dark:bg-slate-900/50"><Link href="/patients"><Users className="mr-2 h-3.5 w-3.5" />Find patient</Link></Button></div>
                            <div className="mt-5 grid max-w-xl grid-cols-3 gap-2">{[{ label: 'Active', value: counts.active, icon: Activity }, { label: 'Inpatient', value: counts.inpatient, icon: Building2 }, { label: 'SHA-covered', value: counts.sha, icon: Fingerprint }].map(m => <div key={m.label} className="flex items-center gap-2 rounded-lg border border-white/70 bg-white/55 px-2.5 py-2 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/40"><m.icon className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-300" /><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.label}</p><p className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{number(m.value)}</p></div></div>)}</div>
                        </div>
                    </article>
                    <article className="clinic-card-in relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6" style={{ animationDelay: '80ms' }}>
                        <div className="absolute -bottom-14 -right-8 h-48 w-48 rounded-full border-[26px] border-white/[.08]" /><div className="absolute right-12 top-8 h-16 w-16 rounded-full bg-emerald-300/10 blur-xl" />
                        <div className="relative z-10"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100"><Sparkles className="h-3 w-3" />Department pulse</span><h2 className="mt-3 text-xl font-bold tracking-tight">{config.title}</h2><p className="mt-2 text-[11px] leading-5 text-emerald-50/80">{config.narrative}</p>
                            <div className="mt-5 rounded-xl border border-white/10 bg-white/[.06] p-3.5"><div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-100/70">Matching encounters</p><p className="mt-1 text-2xl font-bold tabular-nums">{number(encounters.total)}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Icon className="h-5 w-5 text-emerald-200" /></div></div><div className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${config.line} opacity-80`} /><p className="mt-2 text-[10px] text-emerald-50/70">Current view based on saved encounter records</p></div>
                            <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-emerald-100/80"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />{config.callout}</p>
                        </div>
                    </article>
                </section>

                <section className="grid grid-cols-2 gap-3 md:grid-cols-4">{[
                    { label: 'Active encounters', value: counts.active, note: 'Not completed or cancelled', icon: Activity, tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
                    { label: 'Inpatient', value: counts.inpatient, note: 'Inpatient visit type', icon: Building2, tone: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300' },
                    { label: 'Outpatient', value: counts.outpatient, note: 'Outpatient visit type', icon: Stethoscope, tone: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
                    { label: 'SHA coverage', value: counts.sha, note: 'Coverage recorded as SHA', icon: ShieldCheck, tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
                ].map((m, i) => <MetricCard key={m.label} {...m} index={i} />)}</section>

                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 md:px-5"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.pale}`}><CalendarClock className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Encounter worklist</h2><p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Search and open a saved patient encounter · {number(encounters.total)} matching records</p></div></div><Badge variant="outline" className="text-[9px] tracking-wider">{module.toUpperCase()} WORKSPACE</Badge></div>
                    <form onSubmit={submit} className="grid gap-2 border-b border-slate-100 bg-[#f8fbf9] p-3 dark:border-slate-800 dark:bg-slate-900/30 md:grid-cols-[minmax(0,1fr)_190px_auto_auto]">
                        <div className="relative min-w-0"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search patient name, MRN or encounter…" className="h-9 border-slate-200 bg-white pl-9 text-xs dark:border-slate-700 dark:bg-slate-950" /></div>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"><option value="">All statuses</option><option value="registered">Registered</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select>
                        <Button type="submit" className="h-9 rounded-lg bg-emerald-700 text-xs text-white hover:bg-emerald-800"><Search className="mr-1.5 h-3.5 w-3.5" />Apply filters</Button><Button type="button" variant="outline" className="h-9 rounded-lg bg-white text-xs dark:bg-slate-950" onClick={() => { setQ(''); setStatus(''); router.get(`/${module}`, {}, { preserveScroll: true, replace: true }); }}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Reset</Button>
                    </form>
                    <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-slate-50 text-[9px] uppercase tracking-[.13em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400"><tr>{['Patient / encounter', 'Department', 'Visit type', 'Coverage', 'Status', 'Arrival', ''].map(h => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{encounters.data.map((e, i) => <tr key={e.id} className="transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10" style={{ animation: `clinicCardIn .35s ease-out ${i * 25}ms both` }}>
                        <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Users className="h-3.5 w-3.5" /></span><div className="min-w-0"><p className="font-semibold text-slate-900 dark:text-white">{e.patient_name || 'Patient record unavailable'}</p><p className="mt-0.5 text-[10px] text-slate-500">{e.encounter_number} <span className="px-1 text-slate-300">·</span> MRN {e.mrn || '—'}</p></div></div></td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{e.department || 'Unassigned'}</td><td className="px-4 py-3.5"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">{pretty(e.visit_type)}</span></td>
                        <td className="px-4 py-3.5">{e.coverage_type?.toLowerCase() === 'sha' ? <Badge className="border-0 bg-violet-100 text-[9px] text-violet-800 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-300"><Fingerprint className="mr-1 h-3 w-3" />SHA</Badge> : <span className="text-slate-500">{pretty(e.coverage_type)}</span>}</td>
                        <td className="px-4 py-3.5"><Badge variant="outline" className={`text-[9px] ${e.status === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300' : e.status === 'cancelled' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300'}`}>{pretty(e.status)}</Badge></td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{date(e.arrived_at)}</span></td>
                        <td className="px-4 py-3.5 text-right"><Button asChild size="sm" variant="outline" className="h-8 rounded-lg border-slate-200 bg-white text-[10px] font-semibold hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-emerald-950/40"><Link href={`/visits/${e.id}`}>Open visit<ArrowUpRight className="ml-1.5 h-3 w-3" /></Link></Button></td>
                    </tr>)}</tbody></table></div>
                    {encounters.data.length === 0 && <div className="flex flex-col items-center justify-center px-6 py-14 text-center"><span className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.pale}`}><Icon className="h-5 w-5" /></span><h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No matching encounters</h3><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Try a different search or reset the filters. New records appear here after they are saved in the visit register.</p></div>}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800"><p className="text-[10px] text-slate-500">Page <span className="font-semibold text-slate-700 dark:text-slate-200">{encounters.current_page}</span> of {encounters.last_page} <span className="px-1">·</span> {number(encounters.total)} records</p><div className="flex flex-wrap gap-1">{encounters.links.map((l, i) => <Button key={`${l.label}-${i}`} type="button" size="sm" variant={l.active ? 'default' : 'outline'} disabled={!l.url} onClick={() => l.url && router.visit(l.url, { preserveScroll: true })} className={`h-7 min-w-8 px-2 text-[10px] ${l.active ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-white dark:bg-slate-950'}`}>{paginationLabel(l.label)}</Button>)}</div></div>
                </section>
                <div className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 text-[10px] leading-4 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" /><p>This workspace displays saved encounter information. It does not create nursing observations, laboratory orders/results, prescriptions, dispensing records, or clinical decisions. Continue those actions through the corresponding authorised workflow.</p></div>
            </div>
        </main>
    </>;
}

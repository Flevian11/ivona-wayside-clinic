import { useForm } from '@inertiajs/react';
import { 
    Save, Shield, ShieldAlert, CheckCircle2, Circle, ListChecks, 
    User, ShieldCheck, TrendingUp, Fingerprint, Activity, ArrowRight
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { AdminPage, AdminPanel, EmptyState, primaryButton, StatusPill } from './_shared';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Role = { id: number; name: string; slug: string; is_system: boolean; is_active: boolean };
type User = { id: number; name: string; email: string; roles: Role[] };

export default function AssignmentsPage({ users, roles }: { users: User[]; roles: Role[] }) {
    const [selected, setSelected] = useState<number | null>(users[0]?.id ?? null);
    const user = users.find(u => u.id === selected);
    
    const form = useForm<{ role_ids: number[] }>({ role_ids: user?.roles.map(r => r.id) ?? [] });
    
    const choose = (id: number) => { 
        const u = users.find(x => x.id === id); 
        setSelected(id); 
        form.setData('role_ids', u?.roles.map(r => r.id) ?? []); 
    };
    
    const submit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (user) form.put(`/admin/administration/role-assignments/${user.id}`, { preserveScroll: true }); 
    };

    // Visual Data Math for the Hero Panel
    const totalRoles = roles.length;
    const assignedRoles = user ? user.roles.length : 0;
    const assignedPct = totalRoles ? Math.round((assignedRoles / totalRoles) * 100) : 0;
    
    const currentActiveRoles = form.data.role_ids.length;
    const activePct = totalRoles ? Math.round((currentActiveRoles / totalRoles) * 100) : 0;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <AdminPage title="Role assignments" description="Manage which active roles are assigned to each login account. Changes are recorded in the audit trail.">
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes donutFill { from { stroke-dasharray: 0 251.2; } to { stroke-dasharray: var(--dash) 251.2; } }
            `}</style>

            {/* RICH HERO SECTION */}
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] mb-6">
                
                {/* LEFT HERO - Gradient */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                    <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                    <div className="relative z-10 flex h-full flex-col justify-center">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <Fingerprint className="h-3 w-3" /> Access Control · Identity
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
                            Role Assignments <span className="text-emerald-700 dark:text-emerald-400">✦</span>
                        </h1>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {greeting}. Manage which active roles are assigned to each login account. Changes are recorded in the audit trail. Ensure all accounts have appropriate access.
                        </p>
                        
                        {/* Inline mini pills */}
                        <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                            {[
                                { k: 'Accounts', v: users.length, i: User }, 
                                { k: 'Roles', v: totalRoles, i: Shield }, 
                                { k: 'Selected', v: currentActiveRoles, i: CheckCircle2 }
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

                {/* RIGHT HERO - Deep Green Gauge Panel */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#073f35] via-[#075e4e] to-[#0f766e] p-5 text-white shadow-sm md:p-6 flex flex-col justify-between">
                    <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[26px] border-white/[.08]" />
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-100">
                            <Activity className="h-3 w-3" /> Active Coverage
                        </span>
                        <h2 className="mt-3 text-lg font-bold tracking-tight">Role Entitlement</h2>
                        <p className="mt-1 text-[11px] leading-5 text-emerald-50/80">
                            {user ? `Configuring access for ${user.name.split(' ')[0]}.` : 'Select an account to configure.'} 
                        </p>
                        
                        <div className="mt-4 flex items-center gap-5">
                            {/* SVG Donut Gauge */}
                            <div className="relative h-24 w-24 shrink-0">
                                <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
                                    <circle cx="44" cy="44" r="36" fill="none" className="text-white/15" stroke="currentColor" strokeWidth="8" />
                                    <circle 
                                        cx="44" cy="44" r="36" fill="none" 
                                        stroke="#a7f3d0" strokeWidth="8" strokeLinecap="round" 
                                        strokeDasharray={`${(activePct / 100) * 226.19} 226.19`} 
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <strong className="text-xl font-bold">{activePct}%</strong>
                                    <span className="text-[9px] uppercase tracking-wider text-emerald-100/70">Selected</span>
                                </div>
                            </div>
                            
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-emerald-100/80">Total Roles</span>
                                    <strong className="font-semibold">{totalRoles}</strong>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-emerald-100/80">Saved Initially</span>
                                    <strong className="font-semibold">{assignedRoles}</strong>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-emerald-100/80">Currently Selected</span>
                                    <strong className="text-emerald-300 font-bold">{currentActiveRoles}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MASTER-DETAIL LAYOUT */}
            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.5fr)]">
                
                {/* LEFT PANEL - Selector */}
                <AdminPanel title="Select account" description={`${users.length} account${users.length === 1 ? '' : 's'} available`}>
                    {users.length === 0 ? (
                        <EmptyState title="No accounts yet" detail="Create a user account before assigning roles."/>
                    ) : (
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                            {users.map(u => {
                                const isActive = selected === u.id;
                                return (
                                    <button 
                                        type="button" 
                                        key={u.id} 
                                        onClick={() => choose(u.id)} 
                                        className={`group w-full rounded-xl border p-3 text-left transition-all relative overflow-hidden ${isActive ? 'border-emerald-500/50 bg-emerald-50/50 shadow-sm dark:border-emerald-500/50 dark:bg-emerald-950/20' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'}`}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className={`block truncate font-semibold ${isActive ? 'text-emerald-950 dark:text-emerald-50' : 'text-slate-900 dark:text-slate-100'}`}>{u.name}</span>
                                                <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</span>
                                            </div>
                                            {isActive && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                                        </div>
                                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                                            {u.roles.length ? u.roles.map(r => (
                                                <span key={r.id} className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ring-1 ring-inset transition-colors ${isActive ? 'bg-white text-emerald-800 ring-emerald-200 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-800' : 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'}`}>
                                                    {r.name}
                                                </span>
                                            )) : (
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">No role</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </AdminPanel>

                {/* RIGHT PANEL - Role Configuration */}
                <AdminPanel title="Assigned access" description={user ? `Configure roles for ${user.name}.` : 'Choose an account to configure its roles.'}>
                    {!user ? (
                        <EmptyState title="Choose an account" detail="Select a user on the left to view and update role assignments."/>
                    ) : (
                        <form onSubmit={submit} className="h-full flex flex-col">
                            {/* Selected User Banner */}
                            <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm dark:bg-slate-800">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Current Roles</p>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{user.roles.length} saved</p>
                                </div>
                            </div>

                            {/* Role Checkboxes */}
                            {roles.length === 0 ? (
                                <EmptyState title="No active roles" detail="Create and activate roles before assigning access."/>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 flex-1">
                                    {roles.map(role => {
                                        const isChecked = form.data.role_ids.includes(role.id);
                                        return (
                                            <label 
                                                key={role.id} 
                                                className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${isChecked ? 'border-emerald-500/50 bg-emerald-50/50 dark:border-emerald-500/50 dark:bg-emerald-950/20' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'} ${(!role.is_active && !isChecked) && 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${isChecked ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'}`}>
                                                        {isChecked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                                    </div>
                                                    <input 
                                                        className="sr-only" 
                                                        type="checkbox" 
                                                        checked={isChecked} 
                                                        disabled={!role.is_active && !isChecked} 
                                                        onChange={e => form.setData('role_ids', e.target.checked ? [...form.data.role_ids, role.id] : form.data.role_ids.filter(id => id !== role.id))}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className={`text-sm font-bold ${isChecked ? 'text-emerald-950 dark:text-emerald-50' : 'text-slate-900 dark:text-slate-100'}`}>{role.name}</span>
                                                        {role.is_system && (
                                                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">System</span>
                                                        )}
                                                    </div>
                                                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-mono">{role.slug}</span>
                                                    
                                                    {!role.is_active && (
                                                        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                                            <ShieldAlert className="h-3 w-3" /> Inactive · existing assignments only
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        <ListChecks className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{form.data.role_ids.length}</span> role(s) selected
                                    </p>
                                </div>
                                <button className={`${primaryButton} h-10 px-6 rounded-xl shadow-md shadow-emerald-900/10`} disabled={form.processing || roles.length === 0}>
                                    <Save className="size-4 mr-2" />
                                    {form.processing ? 'Saving...' : 'Save assignments'}
                                </button>
                            </div>
                        </form>
                    )}
                </AdminPanel>
            </div>
        </AdminPage>
    );
}
import { router, useForm } from '@inertiajs/react';
import { 
    Search, UserPlus, Users, ShieldCheck, CheckCircle2, Clock3, 
    ListChecks, Hash, ArrowRight, User, Mail, Shield, Filter, X 
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { AdminPage, AdminPanel, EmptyState, Field, inputClass, primaryButton, secondaryButton, StatusPill } from './_shared';

/* ------------------------------ Types (unchanged) ----------------------------- */

type Role = { id: number; name: string; slug: string; description?: string | null };
type UserRow = { id: number; name: string; email: string; roles: Role[]; roles_count: number; created_at?: string | null };
type Page<T> = { data: T[]; links: { url: string | null; label: string; active: boolean }[]; total: number; current_page: number; last_page: number };
type Props = { users: Page<UserRow>; roles: Role[]; filters: { q: string } };

export default function UsersPage({ users, roles, filters }: Props) {
    const [query, setQuery] = useState(filters.q ?? '');
    const [showCreate, setShowCreate] = useState(false);
    
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '', role_ids: [] as number[] });
    
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/admin/administration/users', { preserveScroll: true, onSuccess: () => { form.reset(); setShowCreate(false); } });
    };
    
    const search = (event: React.FormEvent) => { 
        event.preventDefault(); 
        router.get('/admin/administration/users', { q: query }, { preserveState: true, replace: true }); 
    };

    // Calculate breakdown for the hero side panel
    const roleUsage = useMemo(() => {
        const counts: Record<string, number> = {};
        users.data.forEach(u => u.roles.forEach(r => { counts[r.name] = (counts[r.name] || 0) + 1; }));
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    }, [users.data]);

    const unassignedCount = users.data.filter(u => u.roles.length === 0).length;
    const assignedCount = users.data.filter(u => u.roles.length > 0).length;

    return (
        <AdminPage title="User accounts" description="Create login accounts and assign their initial access using the clinic’s dynamic role catalogue.">
            <style>{`
                @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rowIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .user-row { animation: rowIn .35s ease-out both; }
            `}</style>

            {/* HERO SECTION */}
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] mb-5">
                <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] p-6 shadow-sm dark:border-slate-800 dark:bg-none dark:bg-[#111c2d]">
                    <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                    <div className="relative z-10 flex h-full flex-col justify-center">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <ShieldCheck className="h-3 w-3" /> Administration · Access
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">User accounts <span className="text-emerald-700 dark:text-emerald-400">✦</span></h1>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            Create login accounts and assign their initial access using the clinic’s dynamic role catalogue. Ensure all accounts have appropriate roles before granting access.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            <button className="h-9 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800" onClick={() => setShowCreate(v => !v)} type="button">
                                {showCreate ? <X className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                {showCreate ? 'Close form' : 'Create user'}
                            </button>
                        </div>
                        <div className="mt-5 grid max-w-lg grid-cols-3 gap-2">
                            {[
                                { k: 'Accounts', v: users.total, i: Users }, 
                                { k: 'Assigned', v: assignedCount, i: CheckCircle2 }, 
                                { k: 'Unassigned', v: unassignedCount, i: Clock3 }
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

                {/* Right Hero Panel - Role distribution */}
                <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/70 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600" /> Active Role Distribution
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Top roles assigned to users in this view.</p>
                    
                    <div className="mt-4 space-y-3">
                        {roleUsage.length ? roleUsage.map(([name, count], i) => {
                            const pct = Math.round((count / Math.max(1, users.data.length)) * 100);
                            return (
                                <div key={name}>
                                    <div className="flex items-center justify-between text-[11px] mb-1">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{name}</span>
                                        <span className="text-slate-500 tabular-nums">{count} user{count === 1 ? '' : 's'}</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${pct}%`, animationDelay: `${i * 100}ms` }} />
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-xs text-slate-500">No roles assigned yet.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* MAIN PANEL */}
            <AdminPanel title="Account directory" description="Search accounts, review their current roles, or create a new account.">
                
                {/* CREATE FORM */}
                {showCreate && (
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]" style={{ animation: 'cardIn 0.4s ease-out' }}>
                        <div className="mb-4">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">New login account</h3>
                            <p className="mt-1 text-sm text-slate-500">Choose one or more active roles. Roles are loaded from the database; no role is hard-coded.</p>
                        </div>
                        <form onSubmit={submit}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Full name" error={form.errors.name}><input className={inputClass} autoComplete="name" value={form.data.name} onChange={e=>form.setData('name',e.target.value)} required /></Field>
                                <Field label="Email address" error={form.errors.email}><input className={inputClass} type="email" autoComplete="email" value={form.data.email} onChange={e=>form.setData('email',e.target.value)} required /></Field>
                                <Field label="Initial password (minimum 12 characters)" error={form.errors.password}><input className={inputClass} type="password" autoComplete="new-password" value={form.data.password} onChange={e=>form.setData('password',e.target.value)} required minLength={12}/></Field>
                                <Field label="Confirm password" error={form.errors.password_confirmation}><input className={inputClass} type="password" autoComplete="new-password" value={form.data.password_confirmation} onChange={e=>form.setData('password_confirmation',e.target.value)} required minLength={12}/></Field>
                            </div>
                            
                            <div className="mt-6 space-y-3">
                                <p className="text-sm font-medium flex items-center justify-between">
                                    <span>Assign role(s) <span className="text-rose-500">*</span></span>
                                    <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{form.data.role_ids.length} selected</span>
                                </p>
                                {form.errors.role_ids && <p className="text-xs text-destructive">{form.errors.role_ids}</p>}
                                
                                {roles.length ? (
                                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                        {roles.map(role => (
                                            <label key={role.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${form.data.role_ids.includes(role.id) ? 'border-emerald-500/50 bg-emerald-50/50 dark:border-emerald-500/50 dark:bg-emerald-950/20 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'}`}>
                                                <input className="mt-1 size-4 accent-emerald-600 rounded" type="checkbox" checked={form.data.role_ids.includes(role.id)} onChange={e=>form.setData('role_ids',e.target.checked?[...form.data.role_ids,role.id]:form.data.role_ids.filter(id=>id!==role.id))}/>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{role.name}</span>
                                                    <span className="mt-0.5 block break-all text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{role.description || role.slug}</span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">No active roles are configured. Create and activate a role before creating a user account.</p>
                                )}
                            </div>
                            
                            <div className="mt-6 flex flex-wrap justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" className={secondaryButton} onClick={()=>{form.reset();setShowCreate(false)}}>Cancel</button>
                                <button className={primaryButton} disabled={form.processing || roles.length===0 || form.data.role_ids.length===0}>
                                    {form.processing?'Creating…':'Create account and assign role'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* SEARCH BAR */}
                <form onSubmit={search} className="mb-4 flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                        <input className={`${inputClass} pl-9 h-11 rounded-xl border-slate-200 dark:border-slate-700`} placeholder="Search name or email…" value={query} onChange={e=>setQuery(e.target.value)}/>
                    </div>
                    <button className={`${secondaryButton} h-11 rounded-xl px-6`}><Search className="size-4 mr-2"/>Search</button>
                </form>

                {/* TABLE */}
                {users.data.length === 0 ? (
                    <EmptyState title="No user accounts found" detail={filters.q ? 'Try another search term or clear the search.' : 'Create the first account when the required roles are ready.'}/>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full min-w-[650px] text-left text-sm">
                            <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">User</th>
                                    <th className="px-5 py-3 font-semibold">Assigned roles</th>
                                    <th className="px-5 py-3 font-semibold">Account ID</th>
                                    <th className="px-5 py-3 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.data.map((user, i) => (
                                    <tr key={user.id} className="user-row transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30" style={{ animationDelay: `${i * 25}ms` }}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                                        <Mail className="h-3 w-3" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex max-w-sm flex-wrap gap-1.5">
                                                {user.roles.length ? user.roles.map(role => (
                                                    <StatusPill key={role.id} positive>{role.name}</StatusPill>
                                                )) : (
                                                    <StatusPill>No role assigned</StatusPill>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                <Hash className="h-3 w-3" /> {user.id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <a className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline" href={`/admin/administration/role-assignments?user=${user.id}`}>
                                                Manage access <ArrowRight className="h-3.5 w-3.5" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* PAGINATION */}
                {users.last_page > 1 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {users.links.map((link, i) => (
                            <button 
                                key={i} 
                                disabled={!link.url} 
                                onClick={() => link.url && router.visit(link.url)} 
                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${link.active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'} disabled:opacity-40`} 
                                dangerouslySetInnerHTML={{__html:link.label}} 
                            />
                        ))}
                    </div>
                )}
            </AdminPanel>
        </AdminPage>
    );
}
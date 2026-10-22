import { router, useForm } from '@inertiajs/react';
import { Search, UserPlus, Users, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { AdminPage, AdminPanel, EmptyState, Field, inputClass, primaryButton, secondaryButton, StatusPill } from './_shared';

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
    const search = (event: React.FormEvent) => { event.preventDefault(); router.get('/admin/administration/users', { q: query }, { preserveState: true, replace: true }); };

    return <AdminPage title="User accounts" description="Create login accounts and assign their initial access using the clinic’s dynamic role catalogue.">
        <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Accounts in this view</p><p className="mt-2 text-2xl font-semibold tracking-tight">{users.total}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Available roles</p><p className="mt-2 text-2xl font-semibold tracking-tight">{roles.length}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Access model</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-primary"/>Explicit role assignment</p></div>
        </section>
        <AdminPanel title="Account directory" description="Search accounts, review their current roles, or create a new account." action={<button className={primaryButton} onClick={() => setShowCreate(v => !v)} type="button"><UserPlus className="size-4"/>{showCreate ? 'Close form' : 'Create user'}</button>}>
            {showCreate && <form onSubmit={submit} className="mb-6 rounded-xl border bg-muted/20 p-4 sm:p-5">
                <div className="mb-4"><h3 className="font-semibold">New login account</h3><p className="mt-1 text-sm text-muted-foreground">Choose one or more active roles. Roles are loaded from the database; no role is hard-coded.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={form.errors.name}><input className={inputClass} autoComplete="name" value={form.data.name} onChange={e=>form.setData('name',e.target.value)} required /></Field>
                    <Field label="Email address" error={form.errors.email}><input className={inputClass} type="email" autoComplete="email" value={form.data.email} onChange={e=>form.setData('email',e.target.value)} required /></Field>
                    <Field label="Initial password (minimum 12 characters)" error={form.errors.password}><input className={inputClass} type="password" autoComplete="new-password" value={form.data.password} onChange={e=>form.setData('password',e.target.value)} required minLength={12}/></Field>
                    <Field label="Confirm password" error={form.errors.password_confirmation}><input className={inputClass} type="password" autoComplete="new-password" value={form.data.password_confirmation} onChange={e=>form.setData('password_confirmation',e.target.value)} required minLength={12}/></Field>
                </div>
                <div className="mt-4 space-y-2"><p className="text-sm font-medium">Assign role(s) <span className="text-destructive">*</span></p>{form.errors.role_ids && <p className="text-xs text-destructive">{form.errors.role_ids}</p>}
                    {roles.length ? <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{roles.map(role=><label key={role.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${form.data.role_ids.includes(role.id)?'border-primary/50 bg-primary/5':'hover:bg-muted/50'}`}><input className="mt-1 size-4 accent-primary" type="checkbox" checked={form.data.role_ids.includes(role.id)} onChange={e=>form.setData('role_ids',e.target.checked?[...form.data.role_ids,role.id]:form.data.role_ids.filter(id=>id!==role.id))}/><span className="min-w-0"><span className="block text-sm font-semibold">{role.name}</span><span className="block break-all text-xs text-muted-foreground">{role.description || role.slug}</span></span></label>)}</div>:<p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No active roles are configured. Create and activate a role before creating a user account.</p>}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" className={secondaryButton} onClick={()=>{form.reset();setShowCreate(false)}}>Cancel</button><button className={primaryButton} disabled={form.processing || roles.length===0 || form.data.role_ids.length===0}>{form.processing?'Creating…':'Create account and assign role'}</button></div>
            </form>}
            <form onSubmit={search} className="mb-4 flex flex-col gap-2 sm:flex-row"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input className={`${inputClass} pl-9`} placeholder="Search name or email…" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className={secondaryButton}><Search className="size-4"/>Search</button></form>
            {users.data.length===0 ? <EmptyState title="No user accounts found" detail={filters.q ? 'Try another search term or clear the search.' : 'Create the first account when the required roles are ready.'}/> :
                <div className="overflow-x-auto rounded-lg border"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-semibold">User</th><th className="px-4 py-3 font-semibold">Assigned roles</th><th className="px-4 py-3 font-semibold">Account ID</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody className="divide-y">{users.data.map(user=><tr key={user.id} className="transition-colors hover:bg-muted/20"><td className="px-4 py-3"><p className="font-semibold">{user.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p></td><td className="px-4 py-3"><div className="flex max-w-sm flex-wrap gap-1.5">{user.roles.length?user.roles.map(role=><StatusPill key={role.id} positive>{role.name}</StatusPill>):<StatusPill>No role</StatusPill>}</div></td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{user.id}</td><td className="px-4 py-3"><a className="text-sm font-semibold text-primary hover:underline" href={`/admin/administration/role-assignments?user=${user.id}`}>Manage access</a></td></tr>)}</tbody></table></div>}
            {users.last_page>1&&<div className="mt-4 flex flex-wrap gap-2">{users.links.map((link,i)=><button key={i} disabled={!link.url} onClick={()=>link.url&&router.visit(link.url)} className={`rounded-lg border px-3 py-2 text-xs ${link.active?'border-primary bg-primary text-primary-foreground':'hover:bg-muted'} disabled:opacity-40`} dangerouslySetInnerHTML={{__html:link.label}} />)}</div>}
        </AdminPanel>
    </AdminPage>;
}

import { Link, useForm } from '@inertiajs/react';
import { Plus, Save, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { AdminPage, AdminPanel, EmptyState, Field, inputClass, primaryButton, secondaryButton, StatusPill } from './_shared';

type Role = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_system: boolean;
    is_active: boolean;
    users_count: number;
    permissions_count: number;
};
type Props = { roles: Role[] };

export default function RolesPage({ roles }: Props) {
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const create = useForm({ name: '', slug: '', description: '' });
    const edit = useForm({ name: '', slug: '', description: '', is_active: true });

    const submitCreate = (event: React.FormEvent) => {
        event.preventDefault();
        create.post('/admin/administration/roles', {
            preserveScroll: true,
            onSuccess: () => { create.reset(); setCreating(false); },
        });
    };

    const beginEdit = (role: Role) => {
        setEditingId(role.id);
        edit.setData({ name: role.name, slug: role.slug, description: role.description ?? '', is_active: role.is_active });
    };

    const submitEdit = (event: React.FormEvent, roleId: number) => {
        event.preventDefault();
        edit.put(`/admin/administration/roles/${roleId}`, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    return (
        <AdminPage title="Roles" description="Create and maintain reusable access roles. Permissions are configured on each role’s dedicated page.">
            <section className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Total roles</p><p className="mt-2 text-2xl font-semibold tracking-tight">{roles.length}</p></div>
                <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Active roles</p><p className="mt-2 text-2xl font-semibold tracking-tight">{roles.filter(role => role.is_active).length}</p></div>
                <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Access model</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-primary" />Database-driven RBAC</p></div>
            </section>

            <AdminPanel title="Role catalogue" description="Role names and slugs are stored in the database; no fixed role list is used." action={
                <button className={primaryButton} type="button" onClick={() => setCreating(value => !value)}><Plus className="size-4" />{creating ? 'Close form' : 'Create role'}</button>
            }>
                {creating && <form onSubmit={submitCreate} className="mb-5 rounded-xl border bg-muted/20 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Role name" error={create.errors.name}><input className={inputClass} value={create.data.name} onChange={event => {
                            const name = event.target.value;
                            create.setData(data => ({ ...data, name, slug: data.slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
                        }} required /></Field>
                        <Field label="Unique slug" error={create.errors.slug}><input className={inputClass} value={create.data.slug} onChange={event => create.setData('slug', event.target.value)} required /></Field>
                        <div className="sm:col-span-2"><Field label="Description" error={create.errors.description}><textarea className={`${inputClass} min-h-20`} value={create.data.description} onChange={event => create.setData('description', event.target.value)} /></Field></div>
                    </div>
                    <div className="mt-4 flex justify-end"><button className={primaryButton} disabled={create.processing}>Create role</button></div>
                </form>}

                {roles.length === 0 ? <EmptyState title="No roles configured" detail="Create a role to define a reusable access profile for clinic staff." /> :
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr>
                                <th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Members</th><th className="px-4 py-3 font-semibold">Permissions</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y">
                                {roles.map(role => <tr key={role.id} className="align-top transition-colors hover:bg-muted/20">
                                    <td className="px-4 py-3"><p className="font-semibold">{role.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{role.slug}{role.is_system ? ' · System role' : ''}</p>{role.description && <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{role.description}</p>}</td>
                                    <td className="px-4 py-3 tabular-nums">{role.users_count}</td>
                                    <td className="px-4 py-3 tabular-nums">{role.permissions_count}</td>
                                    <td className="px-4 py-3"><StatusPill positive={role.is_active}>{role.is_active ? 'Active' : 'Inactive'}</StatusPill></td>
                                    <td className="px-4 py-3"><div className="flex justify-end gap-2">
                                        <Link href={`/admin/administration/roles/${role.id}/permissions`} className={secondaryButton}><ShieldCheck className="size-4" />Permissions</Link>
                                        <button className={secondaryButton} type="button" onClick={() => editingId === role.id ? setEditingId(null) : beginEdit(role)}>{editingId === role.id ? 'Close' : 'Edit'}</button>
                                    </div></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                }

                {roles.filter(role => editingId === role.id).map(role => <form key={role.id} onSubmit={event => submitEdit(event, role.id)} className="mt-4 rounded-xl border bg-muted/20 p-4">
                    <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Edit {role.name}</h3><StatusPill>{role.is_system ? 'System role' : 'Custom role'}</StatusPill></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Role name" error={edit.errors.name}><input className={inputClass} value={edit.data.name} onChange={event => edit.setData('name', event.target.value)} required /></Field>
                        <Field label="Unique slug" error={edit.errors.slug}><input className={inputClass} value={edit.data.slug} onChange={event => edit.setData('slug', event.target.value)} required /></Field>
                        <div className="sm:col-span-2"><Field label="Description" error={edit.errors.description}><textarea className={`${inputClass} min-h-16`} value={edit.data.description} onChange={event => edit.setData('description', event.target.value)} /></Field></div>
                        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" className="size-4 accent-primary" checked={edit.data.is_active} onChange={event => edit.setData('is_active', event.target.checked)} />Role is active and available for assignment</label>
                    </div>
                    {Object.keys(edit.errors).length > 0 && <p className="mt-3 text-sm text-destructive">Please correct the highlighted role details.</p>}
                    <div className="mt-4 flex justify-end"><button className={primaryButton} disabled={edit.processing}><Save className="size-4" />Save changes</button></div>
                </form>)}
            </AdminPanel>
        </AdminPage>
    );
}

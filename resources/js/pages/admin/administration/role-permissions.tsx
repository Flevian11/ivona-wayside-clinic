import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { AdminPage, AdminPanel, EmptyState, primaryButton, secondaryButton } from './_shared';

type Permission = { id: number; name: string; description: string | null; module: string };
type Role = { id: number; name: string; slug: string; description: string | null; is_system: boolean; is_active: boolean; permissions: { id: number }[] };

export default function RolePermissionsPage({ role, permissions }: { role: Role; permissions: Permission[] }) {
    const form = useForm<{ permission_ids: number[] }>({ permission_ids: role.permissions.map(permission => permission.id) });
    const groups = Array.from(new Set(permissions.map(permission => permission.module || 'General'))).sort();
    const toggle = (id: number, checked: boolean) => form.setData('permission_ids', checked
        ? [...form.data.permission_ids, id]
        : form.data.permission_ids.filter(permissionId => permissionId !== id));

    return (
        <AdminPage title={`${role.name} permissions`} description="Configure the exact capabilities granted to this role. Changes are saved to the role-permission pivot and recorded in the audit log.">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><span className="font-mono">{role.slug}</span><span>·</span><span>{role.is_active ? 'Active role' : 'Inactive role'}</span></div>
                <Link href="/admin/administration/roles" className={secondaryButton}><ArrowLeft className="size-4" />Back to roles</Link>
            </div>
            <AdminPanel title="Permission grants" description={`${form.data.permission_ids.length} of ${permissions.length} permissions selected.`} action={
                <button type="button" className={secondaryButton} onClick={() => form.setData('permission_ids', [])}>Clear selection</button>
            }>
                {permissions.length === 0 ? <EmptyState title="No permissions defined" detail="The permission catalogue is empty. Add permission records before configuring role access." /> :
                    <form onSubmit={event => {
                        event.preventDefault();
                        form.put(`/admin/administration/roles/${role.id}/permissions`, { preserveScroll: true });
                    }}>
                        <div className="space-y-4">
                            {groups.map(module => {
                                const items = permissions.filter(permission => (permission.module || 'General') === module);
                                const selectedCount = items.filter(permission => form.data.permission_ids.includes(permission.id)).length;
                                return <section key={module} className="rounded-xl border">
                                    <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3">
                                        <div><h3 className="text-sm font-semibold">{module}</h3><p className="text-xs text-muted-foreground">{selectedCount} of {items.length} selected</p></div>
                                        <button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => {
                                            const ids = items.map(item => item.id);
                                            form.setData('permission_ids', Array.from(new Set([...form.data.permission_ids.filter(id => !ids.includes(id)), ...ids])));
                                        }}>Select module</button>
                                    </header>
                                    <div className="grid gap-0 divide-y sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
                                        {items.map((permission, index) => <label key={permission.id} className={`flex cursor-pointer items-start gap-3 p-3 sm:p-4 ${index > 1 ? 'border-t' : ''} hover:bg-muted/20`}>
                                            <input type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={form.data.permission_ids.includes(permission.id)} onChange={event => toggle(permission.id, event.target.checked)} />
                                            <span className="min-w-0"><span className="block break-words text-sm font-medium">{permission.name}</span>{permission.description && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{permission.description}</span>}</span>
                                        </label>)}
                                    </div>
                                </section>;
                            })}
                        </div>
                        {form.errors.permission_ids && <p className="mt-3 text-sm text-destructive">{form.errors.permission_ids}</p>}
                        <div className="mt-5 flex flex-wrap justify-end gap-2">
                            <Link href="/admin/administration/roles" className={secondaryButton}>Cancel</Link>
                            <button className={primaryButton} disabled={form.processing}><Save className="size-4" />{form.processing ? 'Saving…' : 'Save permission grants'}</button>
                        </div>
                    </form>}
            </AdminPanel>
        </AdminPage>
    );
}

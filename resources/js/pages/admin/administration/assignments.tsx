import { useForm } from '@inertiajs/react';
import { Save, UserCog } from 'lucide-react';
import { useState } from 'react';
import { AdminPage, AdminPanel, EmptyState, primaryButton, StatusPill } from './_shared';
type Role={id:number;name:string;slug:string;is_system:boolean;is_active:boolean};
type User={id:number;name:string;email:string;roles:Role[]};
export default function AssignmentsPage({users,roles}:{users:User[];roles:Role[]}) {
 const [selected,setSelected]=useState<number|null>(users[0]?.id??null);
 const user=users.find(u=>u.id===selected);
 const form=useForm<{role_ids:number[]}>({role_ids:user?.roles.map(r=>r.id)??[]});
 const choose=(id:number)=>{const u=users.find(x=>x.id===id);setSelected(id);form.setData('role_ids',u?.roles.map(r=>r.id)??[]);};
 const submit=(e:React.FormEvent)=>{e.preventDefault();if(user)form.put(`/admin/administration/role-assignments/${user.id}`,{preserveScroll:true});};
 return <AdminPage title="Role assignments" description="Manage which active roles are assigned to each login account. Changes are recorded in the audit trail.">
  <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)]">
   <AdminPanel title="Select account" description={`${users.length} account${users.length===1?'':'s'} available`}>
    {users.length===0?<EmptyState title="No accounts yet" detail="Create a user account before assigning roles."/>:<div className="space-y-2">{users.map(u=><button type="button" key={u.id} onClick={()=>choose(u.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${selected===u.id?'border-primary/50 bg-primary/5':'hover:bg-muted/40'}`}><span className="block font-semibold">{u.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{u.email}</span><span className="mt-2 flex flex-wrap gap-1">{u.roles.length?u.roles.map(r=><StatusPill key={r.id}>{r.name}</StatusPill>):<StatusPill>No role</StatusPill>}</span></button>)}</div>}
   </AdminPanel>
   <AdminPanel title="Assigned access" description={user?`Configure roles for ${user.name}.`: 'Choose an account to configure its roles.'}>
    {!user?<EmptyState title="Choose an account" detail="Select a user on the left to view and update role assignments."/>:<form onSubmit={submit}>
      <div className="mb-4 rounded-lg bg-muted/30 p-3"><p className="font-semibold">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
      {roles.length===0?<EmptyState title="No active roles" detail="Create and activate roles before assigning access."/>:<div className="space-y-2">{roles.map(role=><label key={role.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${form.data.role_ids.includes(role.id)?'border-primary/50 bg-primary/5':'hover:bg-muted/30'}`}><input className="mt-1 size-4 accent-primary" type="checkbox" checked={form.data.role_ids.includes(role.id)} disabled={!role.is_active&&!form.data.role_ids.includes(role.id)} onChange={e=>form.setData('role_ids',e.target.checked?[...form.data.role_ids,role.id]:form.data.role_ids.filter(id=>id!==role.id))}/><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 font-semibold">{role.name}{role.is_system&&<StatusPill>System</StatusPill>}{!role.is_active&&<StatusPill>Inactive · existing assignments only</StatusPill>}</span><span className="mt-0.5 block text-xs text-muted-foreground">{role.slug}</span></span></label>)}</div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="text-xs text-muted-foreground">{form.data.role_ids.length} role(s) selected</p><button className={primaryButton} disabled={form.processing||roles.length===0}><Save className="size-4"/>Save assignments</button></div>
    </form>}
   </AdminPanel>
  </div>
 </AdminPage>;
}

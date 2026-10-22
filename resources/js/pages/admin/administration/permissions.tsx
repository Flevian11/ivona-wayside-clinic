import { KeyRound, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdminPage, AdminPanel, EmptyState, inputClass, StatusPill } from './_shared';
type Permission={id:number;name:string;description:string|null;module:string|null;roles_count:number};
export default function PermissionsPage({permissions}:{permissions:Permission[]}) {
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>permissions.filter(p=>`${p.name} ${p.module??''} ${p.description??''}`.toLowerCase().includes(query.toLowerCase())),[permissions,query]);
 const modules=Array.from(new Set(filtered.map(p=>p.module||'General'))).sort();
 return <AdminPage title="Permission catalogue" description="Review the permission keys available to roles. Access is enforced server-side through Laravel authorization gates.">
  <AdminPanel title="Available permissions" description={`${permissions.length} permission${permissions.length===1?'':'s'} registered across ${new Set(permissions.map(p=>p.module||'General')).size} module(s).`}>
   <div className="relative mb-5 max-w-lg"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input className={`${inputClass} pl-9`} placeholder="Filter by permission, module, or description…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
   {filtered.length===0?<EmptyState title="No permissions match" detail="Try a different search term."/>:<div className="space-y-5">{modules.map(module=><section key={module} className="overflow-hidden rounded-xl border"><div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3"><h3 className="text-sm font-bold">{module}</h3><StatusPill>{filtered.filter(p=>(p.module||'General')===module).length} permissions</StatusPill></div><div className="divide-y">{filtered.filter(p=>(p.module||'General')===module).map(p=><div key={p.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary"><KeyRound className="size-4"/></div><div className="min-w-0"><p className="break-all font-mono text-sm font-semibold">{p.name}</p><p className="mt-1 text-sm text-muted-foreground">{p.description||'No description provided.'}</p></div></div><div className="shrink-0 text-xs text-muted-foreground">{p.roles_count} role(s) granted</div></div>)}</div></section>)}</div>}
  </AdminPanel>
 </AdminPage>;
}

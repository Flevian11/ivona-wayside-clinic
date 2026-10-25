import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, UserRound, ArrowUpRight, CalendarPlus, Activity, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Patient = {id:number;medical_record_number:string;full_name:string|null;date_of_birth:string|null;phone:string|null;registration_source:string;status:string;encounters_count:number};
type Props={patients:{data:Patient[];links:{url:string|null;label:string;active:boolean}[];total:number};filters:{q:string};can:{register:boolean}};

export default function PatientsIndex({patients,filters,can}:Props) {
  const [q,setQ]=useState(filters.q);
  const submit=(e:FormEvent)=>{e.preventDefault();router.get('/patients',{q},{preserveState:true,replace:true});};

  return (
    <>
      <Head title="Patient registry" />
      <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
        <div className="mx-auto w-full max-w-none space-y-5">
          
          {/* HEADER */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:text-emerald-300">
                Patient care
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Patient registry</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search existing records before registering a patient again.</p>
            </div>
            {can.register && (
              <Button asChild className="h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/10 text-xs font-semibold px-4">
                <Link href="/patients/create"><Plus className="mr-2 h-4 w-4"/>New patient / visit</Link>
              </Button>
            )}
          </div>

          {/* SEARCH & DATA TABLE */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm space-y-4">
            
            {/* Search Bar */}
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  value={q} 
                  onChange={e=>setQ(e.target.value)} 
                  placeholder="Search MRN, name, phone or Client Registry ID" 
                  className="h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 pl-9 text-sm focus-visible:ring-emerald-500" 
                />
              </div>
              <Button type="submit" variant="outline" className="h-10 rounded-xl px-6 text-sm font-semibold border-slate-200 dark:border-slate-700">Search</Button>
            </form>

            {/* Stats */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <span>{patients.total} patient records</span>
              <span>15 per page</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/50">
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Visits</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {patients.data.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <UserRound className="h-4 w-4"/>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{p.full_name||'Name not recorded'}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.date_of_birth||'DOB not recorded'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300">{p.medical_record_number}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">{p.phone||'—'}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {p.registration_source==='sha' ? <><ShieldCheck className="h-3 w-3" />SHA</> : 'Local'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                          <Activity className="h-3.5 w-3.5 text-emerald-600" />{p.encounters_count}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${p.status==='active'?'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400':'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="outline" asChild className="h-7 rounded-md px-2.5 text-[10px] border-slate-200 dark:border-slate-700">
                            <Link href={`/patients/${p.id}`}>Open <ArrowUpRight className="ml-1 h-3 w-3"/></Link>
                          </Button>
                          <Button size="sm" variant="ghost" asChild className="h-7 w-7 p-0 rounded-md">
                            <Link href={`/patients/${p.id}`}><CalendarPlus className="h-3.5 w-3.5 text-slate-500"/></Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {patients.data.length===0 && (
                <div className="py-20 text-center">
                  <UserRound className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600"/>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">No matching patients</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try a different search or register a new patient after checking identifiers.</p>
                  {can.register && (
                    <Button asChild className="mt-4 h-8 rounded-lg bg-emerald-700 text-xs">
                      <Link href="/patients/create">Register patient</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {patients.links.length > 3 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-[11px] font-medium text-slate-500">Page navigation</p>
                <div className="flex flex-wrap gap-1">
                  {patients.links.map((link,i)=>(
                    <button 
                      key={`${link.label}-${i}`} 
                      disabled={!link.url} 
                      onClick={()=>link.url&&router.visit(link.url)} 
                      className={`h-7 min-w-[28px] rounded-md px-2 text-[10px] font-semibold transition-colors ${link.active?'bg-emerald-700 text-white':'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'} disabled:opacity-40`} 
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
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarPlus, ClipboardList, Fingerprint, HeartPulse, History, ShieldCheck, UserRound, Save, FileText, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Encounter = { id:number; encounter_number:string; visit_type:string; status:string; priority:string; arrived_at:string|null; department:string|null; chief_complaint:string|null; payment_type:string|null; coverage_type:string|null; sha_eligibility_status:string|null };
type Identifier = { id:number; type:string; value:string|null; issuer:string|null; is_primary:boolean; verified_at:string|null; verification_source:string|null };
type Consent = { id:number; consent_type:string; status:string; method:string|null; provider:string|null; provider_reference:string|null; requested_at:string|null; granted_at:string|null; expires_at:string|null; revoked_at:string|null };
type Relationship = { type:string; is_principal_member:boolean; related_patient_name:string|null; related_mrn:string|null; source:string; verified_at:string|null };
type Transaction = { id:number; correlation_id:string; provider:string; operation:string; environment:string; status:string; http_status:number|null; provider_reference:string|null; error_code:string|null; completed_at:string|null; created_at:string|null };
type Patient = { id:number; public_id:string; medical_record_number:string; registration_source:string; client_registry_id:string|null; first_name:string|null; middle_name:string|null; last_name:string|null; full_name:string|null; date_of_birth:string|null; sex:string|null; gender:string|null; phone:string|null; email:string|null; preferred_language:string|null; nationality:string|null; county:string|null; sub_county:string|null; ward:string|null; address:string|null; emergency_contact_name:string|null; emergency_contact_relationship:string|null; emergency_contact_phone:string|null; status:string; is_deceased:boolean; last_identity_verified_at:string|null; identity_verification_source:string|null; created_at:string|null; updated_at:string|null; encounters:Encounter[]; identifiers:Identifier[]; consents:Consent[]; relationships:Relationship[] };
type Props = { patient:Patient; can:{update:boolean;createVisit:boolean;checkEligibility:boolean}; integrationTransactions:Transaction[] };

const fieldClass='h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

function Field({label,name,form,type='text'}:{label:string;name:string;form:any;type?:string}) { 
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
      <Input id={name} type={type} value={String(form.data[name]??'')} onChange={e=>form.setData(name,e.target.value)} className="h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"/>{form.errors[name]&&<p className="text-[11px] font-medium text-rose-600">{form.errors[name]}</p>}
    </div>
  ); 
}

function Section({title,subtitle,icon:Icon,children,action}:{title:string;subtitle?:string;icon:any;children:ReactNode;action?:ReactNode}) { 
  return (
    <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Icon className="h-4 w-4"/>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            {subtitle&&<p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  ); 
}

export default function PatientShow({patient,can,integrationTransactions}:Props){
 const {props}=usePage<any>();
 const profile=useForm({first_name:patient.first_name||'',middle_name:patient.middle_name||'',last_name:patient.last_name||'',full_name:patient.full_name||'',date_of_birth:patient.date_of_birth||'',sex:patient.sex||'',gender:patient.gender||'',phone:patient.phone||'',email:patient.email||'',preferred_language:patient.preferred_language||'',nationality:patient.nationality||'',county:patient.county||'',sub_county:patient.sub_county||'',ward:patient.ward||'',address:patient.address||'',emergency_contact_name:patient.emergency_contact_name||'',emergency_contact_relationship:patient.emergency_contact_relationship||'',emergency_contact_phone:patient.emergency_contact_phone||''});
 const visit=useForm({visit_type:'outpatient',department:'',chief_complaint:'',priority:'routine',payment_type:'',coverage_type:''});
 const sha=useForm({identification_type:patient.identifiers.find(i=>i.is_primary)?.type||'National ID',identification_number:patient.identifiers.find(i=>i.is_primary)?.value||''});
 const consent=useForm({consent_type:'care_and_treatment',status:'granted',method:'written',notes:''});
 
 const saveProfile=(e:FormEvent)=>{e.preventDefault();profile.patch(`/patients/${patient.id}`,{preserveScroll:true});};
 const submitVisit=(e:FormEvent)=>{e.preventDefault();visit.post(`/patients/${patient.id}/encounters`);};
 const checkSha=(e:FormEvent)=>{e.preventDefault();sha.post(`/patients/${patient.id}/sha-eligibility`,{preserveScroll:true});};
 const saveConsent=(e:FormEvent)=>{e.preventDefault();consent.post(`/patients/${patient.id}/consents`,{preserveScroll:true,onSuccess:()=>consent.reset('notes')});};
 const displayDate=(value:string|null)=>value?new Date(value).toLocaleString(): '—';
 
 return (
  <>
    <Head title={`${patient.full_name||'Patient'} · ${patient.medical_record_number}`}/>
    <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
      <div className="mx-auto w-full max-w-none space-y-5">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link href="/patients" className="mt-1 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="h-4 w-4"/>
            </Link>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:text-emerald-300">
                Longitudinal record
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">{patient.full_name||'Name not recorded'}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.medical_record_number} · {patient.registration_source==='sha'?'SHA / HIE registration':'Local registration'} · {patient.status}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold px-4">
              <Link href="/patients/create">Register another patient</Link>
            </Button>
          </div>
        </div>

        {props.flash?.success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">{props.flash.success}</div>}
        {Object.values(profile.errors)[0] && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">{String(Object.values(profile.errors)[0])}</div>}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            
            {/* DEMOGRAPHICS */}
            <Section title="Demographics & contact details" subtitle="Update verified demographic details. Changes are saved to the patient master record." icon={UserRound}>
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="First name" name="first_name" form={profile}/>
                  <Field label="Middle name" name="middle_name" form={profile}/>
                  <Field label="Last name" name="last_name" form={profile}/>
                  <Field label="Full name" name="full_name" form={profile}/>
                  <Field label="Date of birth" name="date_of_birth" type="date" form={profile}/>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sex</Label>
                    <select className={fieldClass} value={profile.data.sex} onChange={e=>profile.setData('sex',e.target.value)}>
                      <option value="">Not recorded</option><option value="female">Female</option><option value="male">Male</option><option value="intersex">Intersex</option><option value="unknown">Unknown</option>
                    </select>
                  </div>
                  <Field label="Gender (optional)" name="gender" form={profile}/>
                  <Field label="Phone" name="phone" form={profile}/>
                  <Field label="Email" name="email" type="email" form={profile}/>
                  <Field label="Preferred language" name="preferred_language" form={profile}/>
                  <Field label="Nationality" name="nationality" form={profile}/>
                  <Field label="County" name="county" form={profile}/>
                  <Field label="Sub-county" name="sub_county" form={profile}/>
                  <Field label="Ward" name="ward" form={profile}/>
                </div>
                <Field label="Physical / postal address" name="address" form={profile}/>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Emergency contact</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Contact name" name="emergency_contact_name" form={profile}/>
                    <Field label="Relationship" name="emergency_contact_relationship" form={profile}/>
                    <Field label="Phone" name="emergency_contact_phone" form={profile}/>
                  </div>
                </div>
                
                {can.update && (
                  <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
                    <Button type="submit" disabled={profile.processing} className="h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold px-5">
                      <Save className="mr-2 h-3.5 w-3.5"/>{profile.processing?'Saving…':'Save patient details'}
                    </Button>
                  </div>
                )}
              </form>
            </Section>

            {/* ENCOUNTERS */}
            <Section title="Visit & encounter history" subtitle="OPD, IPD, emergency and follow-up encounters linked to this patient." icon={CalendarPlus}>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50/80 dark:bg-slate-900/50">
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <th className="px-4 py-3">Encounter</th>
                      <th className="px-4 py-3">Type / dept</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Payer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Arrival</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {patient.encounters.map(e=>(
                      <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{e.encounter_number}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{e.priority}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium capitalize text-slate-800 dark:text-slate-200">{e.visit_type.replaceAll('_',' ')}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{e.department||'Unassigned'}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{e.chief_complaint||'Not recorded'}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{e.payment_type||'Not set'}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{e.coverage_type||'No coverage'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 capitalize">{e.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{displayDate(e.arrived_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {patient.encounters.length===0 && <p className="py-10 text-center text-xs text-slate-500">No encounters have been recorded for this patient.</p>}
              </div>
            </Section>

            {/* IDENTIFIERS */}
            <Section title="Identifiers & identity verification" subtitle="Identifiers are stored encrypted and are only shown to authorized users on this record." icon={Fingerprint}>
              <div className="space-y-3">
                {patient.identifiers.map(i=>(
                  <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {i.type}
                        {i.is_primary && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">Primary</span>}
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">{i.value||'Identifier value unavailable'}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{i.issuer||'Issuer not recorded'} · {i.verification_source||'Source not recorded'}</p>
                    </div>
                    <div className="text-right text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {i.verified_at ? <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1"><CheckCircle2 className="h-3 w-3" /> Verified {displayDate(i.verified_at)}</span> : <span className="flex items-center justify-end gap-1"><AlertCircle className="h-3 w-3 text-amber-500" /> Not verified</span>}
                    </div>
                  </div>
                ))}
                {patient.identifiers.length===0 && <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">No identifiers are linked. A medical record number is assigned locally.</p>}
                <div className="rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                  Identity lookup and SHA eligibility are separate provider operations. A locally captured identifier is not considered provider-verified unless a successful verification response is recorded.
                </div>
                <p className="text-[10px] font-medium text-slate-500">Last identity verification: {displayDate(patient.last_identity_verified_at)} · Source: {patient.identity_verification_source||'Not recorded'}</p>
              </div>
            </Section>

            {/* CONSENT */}
            <Section title="Consent & privacy records" subtitle="Record consent status and capture method. This records local consent; it does not represent provider-side consent unless a provider reference is present." icon={ShieldCheck}>
              <div className="space-y-3">
                {patient.consents.map(c=>(
                  <div key={c.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-100 p-3.5 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                    <div>
                      <p className="text-xs font-bold capitalize text-slate-900 dark:text-slate-100">{c.consent_type.replaceAll('_',' ')}</p>
                      <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">{c.status} · {c.method||'Method not recorded'} · {c.provider||'Local'}</p>
                      {c.provider_reference && <p className="mt-0.5 text-[10px] font-mono text-slate-500">Ref: {c.provider_reference}</p>}
                    </div>
                    <div className="text-right text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      <p>Granted: {displayDate(c.granted_at)}</p>
                      {c.revoked_at && <p className="text-rose-500">Revoked: {displayDate(c.revoked_at)}</p>}
                    </div>
                  </div>
                ))}
                {patient.consents.length===0 && <p className="text-xs text-slate-500">No consent entries recorded.</p>}
              </div>
              {can.update && (
                <form onSubmit={saveConsent} className="mt-5 grid gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Consent purpose</Label>
                    <select className={fieldClass} value={consent.data.consent_type} onChange={e=>consent.setData('consent_type',e.target.value)}>
                      <option value="care_and_treatment">Care and treatment</option><option value="data_sharing">Health information sharing</option><option value="sha_processing">SHA processing</option><option value="communications">Patient communications</option><option value="research">Research</option><option value="photography">Photography / media</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</Label>
                    <select className={fieldClass} value={consent.data.status} onChange={e=>consent.setData('status',e.target.value)}>
                      <option value="granted">Granted</option><option value="denied">Denied</option><option value="pending">Pending</option><option value="revoked">Revoked</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Capture method</Label>
                    <select className={fieldClass} value={consent.data.method} onChange={e=>consent.setData('method',e.target.value)}>
                      <option value="written">Written</option><option value="verbal">Verbal</option><option value="electronic">Electronic</option><option value="guardian">Guardian / representative</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notes (optional)</Label>
                    <Input value={consent.data.notes} onChange={e=>consent.setData('notes',e.target.value)} className="h-10 rounded-xl" maxLength={500}/>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={consent.processing} variant="outline" className="h-8 rounded-lg text-xs">{consent.processing?'Saving…':'Add consent record'}</Button>
                    {Object.values(consent.errors)[0] && <p className="mt-2 text-[11px] text-rose-600">{String(Object.values(consent.errors)[0])}</p>}
                  </div>
                </form>
              )}
            </Section>

            {/* RELATIONSHIPS */}
            <Section title="Patient relationships" subtitle="Principal-member and dependant relationships recorded against this patient." icon={HeartPulse}>
              {patient.relationships.length ? patient.relationships.map((r,i)=>(
                <div key={i} className="border-b border-slate-100 dark:border-slate-800 py-2.5 last:border-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.related_patient_name||'Linked patient'} {r.is_principal_member && <span className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase ml-1">· Principal</span>}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.type} · {r.related_mrn||'MRN unavailable'} · {r.source}{r.verified_at?` · verified ${displayDate(r.verified_at)}`:''}</p>
                </div>
              )) : <p className="text-xs text-slate-500">No patient relationships are recorded.</p>}
            </Section>

            {/* INTEGRATION */}
            <Section title="Integration activity" subtitle="Recent SHA / HIE requests associated with this patient. Sensitive request and response bodies are not displayed here." icon={History}>
              <div className="space-y-2">
                {integrationTransactions.map(t=>(
                  <div key={t.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.operation}</p>
                        <p className="mt-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.provider} · {t.environment} · {t.correlation_id}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${t.status==='succeeded'?'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400':'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'}`}>{t.status}</span>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">HTTP {t.http_status??'—'} · {displayDate(t.completed_at||t.created_at)}{t.error_code?` · ${t.error_code}`:''}</p>
                  </div>
                ))}
                {integrationTransactions.length===0 && <p className="text-xs text-slate-500">No integration transactions linked to this patient.</p>}
              </div>
            </Section>
          </div>

          {/* ASIDE */}
          <aside className="space-y-4">
            <section className="rounded-2xl border border-emerald-100/50 bg-gradient-to-br from-emerald-900 to-teal-800 p-5 text-white shadow-sm dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-[.17em] text-emerald-300">Patient master</p>
              <h2 className="mt-1.5 text-xl font-bold">{patient.medical_record_number}</h2>
              <p className="mt-1 break-all text-[10px] text-emerald-100/80 font-mono">Record ID · {patient.public_id}</p>
              
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                  <p className="text-[10px] font-medium text-emerald-200 uppercase tracking-wide">Visits</p>
                  <p className="mt-1 text-xl font-bold">{patient.encounters.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                  <p className="text-[10px] font-medium text-emerald-200 uppercase tracking-wide">Identifiers</p>
                  <p className="mt-1 text-xl font-bold">{patient.identifiers.length}</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-emerald-200/80">Created {displayDate(patient.created_at)} · Updated {displayDate(patient.updated_at)}</p>
            </section>

            {can.createVisit && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                <CalendarPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400"/>
                <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">Create a new visit</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Creates an encounter under this patient; it does not create a duplicate patient.</p>
                <form onSubmit={submitVisit} className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Visit type</Label>
                    <select value={visit.data.visit_type} onChange={e=>visit.setData('visit_type',e.target.value)} className={fieldClass}>
                      <option value="outpatient">Outpatient (OPD)</option><option value="inpatient">Inpatient (IPD)</option><option value="emergency">Emergency</option><option value="follow_up">Follow-up</option><option value="procedure">Procedure</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Priority</Label>
                    <select value={visit.data.priority} onChange={e=>visit.setData('priority',e.target.value)} className={fieldClass}>
                      <option value="routine">Routine</option><option value="urgent">Urgent</option><option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department</Label>
                    <Input value={visit.data.department} onChange={e=>visit.setData('department',e.target.value)} className="h-10 rounded-xl"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payment type</Label>
                    <select value={visit.data.payment_type} onChange={e=>visit.setData('payment_type',e.target.value)} className={fieldClass}>
                      <option value="">Not set</option><option value="sha">SHA</option><option value="cash">Cash / self pay</option><option value="private_insurance">Private insurance</option><option value="corporate">Corporate</option><option value="exempt">Exempt</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Coverage type</Label>
                    <select value={visit.data.coverage_type} onChange={e=>visit.setData('coverage_type',e.target.value)} className={fieldClass}>
                      <option value="">Not set</option><option value="sha">SHA</option><option value="private_insurance">Private insurance</option><option value="corporate">Corporate</option><option value="self_pay">Self pay</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reason for visit</Label>
                    <Input value={visit.data.chief_complaint} onChange={e=>visit.setData('chief_complaint',e.target.value)} className="h-10 rounded-xl"/>
                  </div>
                  <Button type="submit" disabled={visit.processing} className="w-full h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold mt-2">{visit.processing?'Creating…':'Create encounter'}</Button>
                  {Object.values(visit.errors)[0] && <p className="text-[11px] text-rose-600">{String(Object.values(visit.errors)[0])}</p>}
                </form>
              </section>
            )}

            {can.checkEligibility && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400"/>
                <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">SHA eligibility</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Runs the configured provider operation. It does not infer eligibility from local patient data.</p>
                <form onSubmit={checkSha} className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Identifier type</Label>
                    <select value={sha.data.identification_type} onChange={e=>sha.setData('identification_type',e.target.value)} className={fieldClass}>
                      <option>National ID</option><option>ClientRegistry ID</option><option>Birth Notification</option><option>Birth Certificate</option><option>Alien ID</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Identifier number</Label>
                    <Input value={sha.data.identification_number} onChange={e=>sha.setData('identification_number',e.target.value)} required className="h-10 rounded-xl"/>
                  </div>
                  <Button type="submit" disabled={sha.processing} variant="outline" className="w-full h-9 rounded-xl text-xs font-semibold mt-2">{sha.processing?'Checking…':'Check eligibility'}</Button>
                </form>
                {props.flash?.sha_result && <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-slate-950 p-3 text-[10px] text-emerald-300 font-mono">{JSON.stringify(props.flash.sha_result,null,2)}</pre>}
                {Object.values(sha.errors)[0] && <p className="mt-2 text-[11px] text-rose-600">{String(Object.values(sha.errors)[0])}</p>}
              </section>
            )}

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-slate-500"/>
                <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">Record status</h2>
              </div>
              <div className="mt-3 space-y-2">
                <p className="flex justify-between gap-3 text-[11px]"><span className="text-slate-500 dark:text-slate-400">Status</span><strong className="text-slate-900 dark:text-slate-100">{patient.status}</strong></p>
                <p className="flex justify-between gap-3 text-[11px]"><span className="text-slate-500 dark:text-slate-400">Deceased flag</span><strong className="text-slate-900 dark:text-slate-100">{patient.is_deceased?'Recorded':'Not recorded'}</strong></p>
                <p className="flex justify-between gap-3 text-[11px]"><span className="text-slate-500 dark:text-slate-400">Source</span><strong className="text-slate-900 dark:text-slate-100">{patient.registration_source==='sha'?'SHA / HIE':'Local'}</strong></p>
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                Clinical notes, diagnoses, prescriptions, laboratory results, billing and claims are shown in their respective modules when those workflows are connected to this encounter.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  </>
 );
}
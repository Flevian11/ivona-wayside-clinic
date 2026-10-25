import { Head, Link, router, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, ArrowRight, Check, ChevronLeft, Fingerprint, 
    LoaderCircle, Mail, Phone, Search, ShieldCheck, UserRound, Users, 
    WalletCards, Info, AlertTriangle, ShieldAlert, CheckCircle2,
    HeartPulse, Clock, Sparkles, Activity, CircleDot
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = { can: { register: boolean; shaLookup: boolean }; integrationMode: string };
type Benefit = { id?: string; code?: string; name?: string; benefit_name?: string; description?: string; status?: string; package?: string; sub_benefits?: Benefit[]; mock?: boolean; sub_benefits_status?: string; [key: string]: any };
type FormData = {
 registration_source:'local'|'sha'; identifier_type:string; identifier_number:string; client_registry_id:string;
 first_name:string; middle_name:string; last_name:string; full_name:string; date_of_birth:string; sex:string; gender:string; phone:string; email:string; preferred_language:string; nationality:string; county:string; sub_county:string; ward:string; address:string; emergency_contact_name:string; emergency_contact_relationship:string; emergency_contact_phone:string;
 principal_member_patient_id:string; principal_member_client_registry_id:string; relationship_type:string; authorization_challenge_id:string; create_visit:boolean; visit_type:string; department:string; chief_complaint:string; payment_type:string; coverage_type:string; consent_type:string; consent_status:string; consent_method:string; sha_benefit_code:string; sha_benefit_name:string; sha_sub_benefit_code:string; sha_sub_benefit_name:string; sha_preauthorization_status:string;
};
const initial:FormData={registration_source:'sha',identifier_type:'National ID',identifier_number:'',client_registry_id:'',first_name:'',middle_name:'',last_name:'',full_name:'',date_of_birth:'',sex:'',gender:'',phone:'',email:'',preferred_language:'',nationality:'Kenyan',county:'',sub_county:'',ward:'',address:'',emergency_contact_name:'',emergency_contact_relationship:'',emergency_contact_phone:'',principal_member_patient_id:'',principal_member_client_registry_id:'',relationship_type:'',authorization_challenge_id:'',create_visit:true,visit_type:'outpatient',department:'',chief_complaint:'',payment_type:'sha',coverage_type:'sha',consent_type:'',consent_status:'',consent_method:'',sha_benefit_code:'',sha_benefit_name:'',sha_sub_benefit_code:'',sha_sub_benefit_name:'',sha_preauthorization_status:'not_checked'};

const inputCls = 'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-[#111c2d] dark:focus-visible:ring-emerald-400/30';

function nameOf(p:any){return String(p?.full_name||p?.name||[p?.first_name,p?.middle_name,p?.last_name].filter(Boolean).join(' ')||'Name not returned');}
function idOf(p:any){return String(p?.id||p?.client_registry_id||'');}
function flattenGroups(input:any):any[]{if(!Array.isArray(input))return [];return input.flatMap((x:any)=>Array.isArray(x?.result)?x.result:[x]).filter((x:any)=>x&&typeof x==='object');}
function contactsFor(p:any):{type:'phone'|'email';value:string}[]{const raw=[{type:'phone',value:p?.phone},{type:'email',value:p?.email},...(Array.isArray(p?.telecom)?p.telecom.map((x:any)=>({type:String(x?.system||'').toLowerCase(),value:x?.value})):[])];const out:{type:'phone'|'email';value:string}[]=[];for(const x of raw){const type=String(x.type).toLowerCase();const value=typeof x.value==='string'?x.value.trim():'';if((type==='phone'||type==='email')&&value&&!out.some(y=>y.type===type&&y.value===value))out.push({type:type as 'phone'|'email',value});}return out;}

export default function CreatePatient({can,integrationMode}:Props){
 const form=useForm<FormData>(initial); 
 const [step,setStep]=useState(1); 
 const [transitioning,setTransitioning]=useState(false);
 const [lookupBusy,setLookupBusy]=useState(false); 
 const [lookupStatus,setLookupStatus]=useState(''); 
 const [registryPrincipal,setRegistryPrincipal]=useState<any|null>(null); 
 const [selectedPerson,setSelectedPerson]=useState<any|null>(null); 
 const [dependants,setDependants]=useState<any[]>([]); 
 const [benefits,setBenefits]=useState<Benefit[]>([]); 
 const [benefitsBusy,setBenefitsBusy]=useState(false); 
 const [benefitsStatus,setBenefitsStatus]=useState(''); 
 const [selectedBenefit,setSelectedBenefit]=useState<Benefit|null>(null); 
 const [selectedSubBenefit,setSelectedSubBenefit]=useState<Benefit|null>(null); 
 const [preauthStatus,setPreauthStatus]=useState('not_checked'); 
 const [challenge,setChallenge]=useState(''); 
 const [authMethod,setAuthMethod]=useState<'otp'|'biometric'>('otp'); 
 const [contact,setContact]=useState(''); 
 const [otp,setOtp]=useState(''); 
 const [developmentOtp,setDevelopmentOtp]=useState(''); 
 const [otpVerified,setOtpVerified]=useState(false); 
 const [biometricVerified,setBiometricVerified]=useState(false); 
 const [authBusy,setAuthBusy]=useState(false); 
 const [authStatus,setAuthStatus]=useState(''); 
 const [duplicateStatus,setDuplicateStatus]=useState(''); 
 const [duplicateBusy,setDuplicateBusy]=useState(false); 
 const [duplicateMatches,setDuplicateMatches]=useState<any[]>([]);
 
 const csrfHeaders=()=>{const token=document.cookie.split('; ').find(x=>x.startsWith('XSRF-TOKEN='))?.split('=').slice(1).join('=');return {'Content-Type':'application/json','Accept':'application/json','X-Requested-With':'XMLHttpRequest',...(token?{'X-XSRF-TOKEN':decodeURIComponent(token)}:{})};};
 const json=async(r:Response)=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||d.errors?.identification_number||`Request failed (${r.status})`);return d;};
 
 const populate=(person:any,principal:any|null)=>{const full=nameOf(person);const parts=full.split(/\s+/);const dependent=!!principal&&idOf(principal)!==idOf(person);form.setData(d=>({...d,registration_source:'sha',identifier_type:person.identification_type||'ClientRegistry ID',identifier_number:String(person.identification_number||person.id||''),client_registry_id:idOf(person),first_name:person.first_name||parts[0]||'',middle_name:person.middle_name||'',last_name:person.last_name||(parts.length>1?parts.slice(1).join(' '):''),full_name:full,date_of_birth:String(person.date_of_birth||'').slice(0,10),sex:String(person.sex||person.gender||'').toLowerCase(),gender:person.gender||'',phone:person.phone||person.telecom?.find?.((t:any)=>t.system==='phone')?.value||'',email:person.email||'',county:person.county||'',sub_county:person.sub_county||'',ward:person.ward||'',principal_member_client_registry_id:dependent?idOf(principal):'',relationship_type:dependent?String(person.relationship||'dependent').toLowerCase().replace(/\s+/g,'_'):'',coverage_type:'sha',payment_type:'sha',create_visit:true,consent_type:'',consent_status:'',consent_method:'',sha_benefit_code:'',sha_benefit_name:'',sha_sub_benefit_code:'',sha_sub_benefit_name:'',sha_preauthorization_status:'not_checked',authorization_challenge_id:''}));setSelectedPerson(person);setSelectedBenefit(null);setSelectedSubBenefit(null);setBenefits([]);setBenefitsStatus('');setPreauthStatus('not_checked');setChallenge('');setAuthMethod('otp');setContact('');setOtp('');setDevelopmentOtp('');setOtpVerified(false);setBiometricVerified(false);setAuthStatus('');};
 
 const handleSelectMember = async (person: any, principal: any | null) => {
   setTransitioning(true);
   populate(person, principal);
   await loadBenefits(person);
   setTimeout(() => setTransitioning(false), 400);
 };

 const handleAdvance = (nextStep: number) => {
   setTransitioning(true);
   setTimeout(() => { setStep(nextStep); setTransitioning(false); }, 350);
 };
 
 const lookup=async()=>{if(!form.data.identifier_number.trim()){setLookupStatus('Enter the member identifier first.');return;}setLookupBusy(true);setLookupStatus('');setRegistryPrincipal(null);setSelectedPerson(null);setDependants([]);setBenefits([]);try{const r=await fetch('/patients/sha-lookup',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({identification_type:form.data.identifier_type,identification_number:form.data.identifier_number.trim()})});const d=await json(r);if(!d.found||!d.patient){setLookupStatus(d.mock?'No matching synthetic registry fixture was found. No provider was contacted.':'No Client Registry record was returned. Check the identifier or use the local patient workflow.');return;}setRegistryPrincipal(d.patient);setDependants([...flattenGroups(d.dependants).map((x:any)=>({...x,relationship_verified:true})),...flattenGroups(d.unconfirmed_dependants).map((x:any)=>({...x,relationship_verified:false}))]);setLookupStatus(d.mock?'Synthetic development registry record loaded. Select the member or a returned dependant to load that person\'s benefits.':'Client Registry record loaded. Select the member or a returned dependant to load that person\'s benefits.');}catch(e){setLookupStatus(e instanceof Error?e.message:'Registry lookup failed.');}finally{setLookupBusy(false);}};
 
 const loadBenefits=async(person:any)=>{setBenefitsBusy(true);setBenefitsStatus('Loading benefits from the configured integration…');setBenefits([]);setSelectedBenefit(null);setSelectedSubBenefit(null);try{const r=await fetch('/patients/sha-benefits',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({client_registry_id:idOf(person),identification_number:String(person.identification_number||person.id||''),identification_type:person.identification_type||'ClientRegistry ID'})});const d=await json(r);const list=Array.isArray(d.benefits)?d.benefits:Array.isArray(d.body?.benefits)?d.body.benefits:Array.isArray(d.body?.data)?d.body.data:[];setBenefits(list);setBenefitsStatus(d.mock?'Synthetic development benefit scenarios loaded. They are not actual SHA entitlements.':list.length?'Benefits returned by the configured provider. Review their status and details.':'The configured provider returned no benefit records. No coverage has been inferred.');if(d.mock&&d.note)setBenefitsStatus(`${d.note} Select a scenario only to test the UI; it does not establish eligibility.`);setStep(2);}catch(e){setBenefitsStatus(e instanceof Error?e.message:'Benefit lookup failed.');}finally{setBenefitsBusy(false);}};
 
 const chooseBenefit=async(b:Benefit)=>{setSelectedBenefit(b);setSelectedSubBenefit(null);const code=String(b.code||b.id||b.benefit_code||'');const title=String(b.name||b.benefit_name||b.package||'Unnamed benefit');const vt=/in.?patient|admission|ward/i.test(title)?'inpatient':/emergency/i.test(title)?'emergency':'outpatient';form.setData(d=>({...d,sha_benefit_code:code,sha_benefit_name:title,sha_sub_benefit_code:'',sha_sub_benefit_name:'',visit_type:vt,coverage_type:'sha',payment_type:'sha',sha_preauthorization_status:'not_checked'}));setPreauthStatus('checking');setBenefitsStatus('Checking whether this benefit has a configured preauthorization rule…');try{const r=await fetch('/patients/sha-preauthorization-check',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({client_registry_id:idOf(selectedPerson),benefit_code:code,benefit_name:title})});const d=await json(r);const state=String(d.status||d.body?.status||'review-required');setPreauthStatus(state);form.setData(x=>({...x,sha_preauthorization_status:state}));setBenefitsStatus(d.mock?`Development simulation: ${d.message||state}. No SHA preauthorization was performed.`:`Provider response: ${d.message||state}.`);}catch(e){setPreauthStatus('unavailable');form.setData(x=>({...x,sha_preauthorization_status:'unavailable'}));setBenefitsStatus(e instanceof Error?e.message:'Preauthorization check unavailable.');}};
 
 const authVerified=authMethod==='otp'?otpVerified:biometricVerified;

 const chooseSubBenefit=(sb:Benefit)=>{if(!selectedBenefit)return;setSelectedSubBenefit(sb);const code=String(sb.code||sb.id||sb.benefit_code||'');const title=String(sb.name||sb.benefit_name||sb.package||'Unnamed sub-benefit');form.setData(d=>({...d,sha_sub_benefit_code:code,sha_sub_benefit_name:title}));setBenefitsStatus('Sub-benefit selected. Preauthorization status remains the result of the configured benefit-level check; any required sub-benefit-specific authorization must follow the official provider contract.');};

 const isDevelopmentMode=['development','dev','mock'].includes(String(integrationMode||'').trim().toLowerCase());
 const startAuth=async()=>{if(!selectedPerson){setAuthStatus('Select a patient first.');return;}if(authMethod==='otp'&&!contact){setAuthStatus('Select a phone number or email returned by the registry.');return;}setAuthBusy(true);setAuthStatus(authMethod==='otp'?(isDevelopmentMode?'Generating a development-only OTP…':'Requesting OTP through the configured authorization adapter…'):(isDevelopmentMode?'Preparing fingerprint simulation…':'Requesting live biometric verification…'));setChallenge('');setDevelopmentOtp('');setOtp('');setOtpVerified(false);setBiometricVerified(false);try{const principalId=form.data.principal_member_client_registry_id||idOf(selectedPerson);const r=await fetch('/patients/principal-authorization/start',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({method:authMethod,principal_registry_id:principalId,dependent_registry_id:idOf(selectedPerson),...(authMethod==='otp'?{selected_contact:contact}:{})})});const d=await json(r);const nextChallenge=typeof d.challenge_id==='string'?d.challenge_id:'';const generated=isDevelopmentMode&&authMethod==='otp'&&typeof d.development_otp==='string'&&/^\d{6}$/.test(d.development_otp)?d.development_otp:'';setChallenge(nextChallenge);setDevelopmentOtp(generated);setOtp(generated);if(!nextChallenge){setAuthStatus(d.message||'The authorization service did not return a challenge. No verification was completed.');return;}if(isDevelopmentMode&&authMethod==='otp'&&!generated){setAuthStatus(d.message||'The development service returned no six-digit code. No verification was completed.');return;}setAuthStatus(d.message||(authMethod==='otp'?(isDevelopmentMode?'Development OTP generated. No message was sent.':'OTP request accepted by the configured adapter.'):(isDevelopmentMode?'Development fingerprint challenge started.':'Live biometric challenge started.')));}catch(e){setChallenge('');setDevelopmentOtp('');setOtp('');setAuthStatus(e instanceof Error?e.message:'Could not start verification.');}finally{setAuthBusy(false);}};
 const verifyOtp=async()=>{if(!challenge)return;setAuthBusy(true);setAuthStatus('Verifying OTP…');try{const r=await fetch('/patients/principal-authorization/verify',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({challenge_id:challenge,method:'otp',otp})});const d=await json(r);if(!d.verified){setAuthStatus(d.message||'OTP was not verified.');return;}setOtpVerified(true);form.setData(x=>({...x,authorization_challenge_id:challenge}));setAuthStatus(d.message||'OTP verification complete.');handleAdvance(4);}catch(e){setAuthStatus(e instanceof Error?e.message:'OTP verification failed.');}finally{setAuthBusy(false);}};
 const verifyBiometric=async()=>{if(!challenge){await startAuth();return;}setAuthBusy(true);setAuthStatus(isDevelopmentMode?'Processing development fingerprint simulation…':'Waiting for live scanner verification…');try{const r=await fetch('/patients/principal-authorization/verify',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({challenge_id:challenge,method:'biometric',...(isDevelopmentMode?{biometric_scenario:'match'}:{})})});const d=await json(r);if(!d.verified){setAuthStatus(d.message||'Biometric verification was not confirmed.');return;}setBiometricVerified(true);form.setData(x=>({...x,authorization_challenge_id:challenge}));setAuthStatus(d.message||(isDevelopmentMode?'Development biometric simulation passed.':'Live biometric verification confirmed by the authorization service.'));handleAdvance(4);}catch(e){setAuthStatus(e instanceof Error?e.message:'Biometric verification failed.');}finally{setAuthBusy(false);}};
 const duplicateCheck=async()=>{setDuplicateBusy(true);setDuplicateStatus('Checking local records for possible duplicates…');try{const r=await fetch('/patients/duplicate-check',{method:'POST',headers:csrfHeaders(),credentials:'same-origin',body:JSON.stringify({query:form.data.full_name||[form.data.first_name,form.data.middle_name,form.data.last_name].filter(Boolean).join(' '),date_of_birth:form.data.date_of_birth,phone:form.data.phone,identifier_type:form.data.identifier_type,identifier_number:form.data.identifier_number})});const d=await json(r);const m=Array.isArray(d.matches)?d.matches:[];setDuplicateMatches(m);setDuplicateStatus(m.length?`${m.length} possible local match(es) found. Open the existing record instead of creating a duplicate.`:'No likely local duplicate was found.');return m;}catch(e){setDuplicateStatus(e instanceof Error?e.message:'Duplicate check failed.');throw e;}finally{setDuplicateBusy(false);}};
 const submit=async(e:FormEvent)=>{e.preventDefault();if(form.data.registration_source==='sha'&&form.data.create_visit&&!authVerified){setAuthStatus(`Complete the selected ${authMethod==='otp'?'OTP':'biometric'} verification before starting this SHA visit.`);setStep(3);return;}if(form.data.registration_source==='sha'&&form.data.create_visit&&(!selectedBenefit||!form.data.sha_benefit_code)){setBenefitsStatus('Select a returned benefit before creating a SHA visit.');setStep(2);return;}try{const matches=await duplicateCheck();if(matches.length){setStep(4);return;}form.post('/patients',{preserveScroll:true});}catch{setDuplicateStatus('Registration paused because duplicate checking failed. No patient was saved.');}};
 const startLocal=()=>{form.setData(d=>({...d,registration_source:'local',identifier_number:'',client_registry_id:'',coverage_type:'self_pay',payment_type:'cash',principal_member_client_registry_id:'',relationship_type:'',authorization_challenge_id:'',sha_benefit_code:'',sha_benefit_name:'',sha_sub_benefit_code:'',sha_sub_benefit_name:'',sha_preauthorization_status:'not_checked'}));setSelectedPerson(null);setStep(4);};
 const steps=['Find member','Choose benefit','Verify','Confirm'];
 
 return (
   <>
     <Head title="SHA patient journey | Ivona Wayside Clinic" />
     <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
       <div className="mx-auto w-full max-w-none space-y-4">
         
         {/* HERO — matches dashboard greeting card */}
         <header className="relative overflow-hidden rounded-2xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] dark:bg-none dark:bg-[#111c2d] p-6 shadow-sm">
           <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
           <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
             <div className="flex items-start gap-3">
               <Link href="/patients" className="mt-0.5 rounded-xl border border-white/60 bg-white/70 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800">
                 <ArrowLeft className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
               </Link>
               <div>
                 <div className="flex flex-wrap items-center gap-2 mb-2">
                   <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 dark:border-emerald-400/20 dark:bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:text-emerald-300">
                     <HeartPulse className="h-3 w-3" /> Front desk · Patient access
                   </span>
                   <span className="inline-flex items-center gap-1 rounded-full bg-white/50 dark:bg-slate-800/50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                     <Clock className="h-3 w-3" />
                     {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                   </span>
                 </div>
                 <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-3xl">SHA patient journey</h1>
                 <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">Find the member, select the actual patient and returned benefit, choose one verification method, then start the visit.</p>
               </div>
             </div>
           </div>
         </header>

         {/* STEPPER — dashboard pill pattern */}
         <div className="flex items-center justify-between rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-1.5 shadow-sm">
           {steps.map((s, i) => {
             const active = step === i + 1;
             const done = step > i + 1;
             return (
               <div key={s} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-1.5 transition-all ${active ? 'bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30 ring-1 ring-emerald-500/20 dark:ring-emerald-500/20' : ''}`}>
                 <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${active ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20' : done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                   {done ? <Check className="h-3 w-3" /> : i + 1}
                 </span>
                 <span className={`hidden text-xs font-semibold sm:block ${active ? 'text-emerald-900 dark:text-emerald-300' : done ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{s}</span>
               </div>
             );
           })}
         </div>

         <form onSubmit={submit} className={transitioning ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}>
           
           {/* STEP 1: FIND MEMBER */}
           {step === 1 && (
             <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-sm overflow-hidden">
               <div className="border-b border-emerald-100/70 bg-gradient-to-br from-[#e9fbf2] to-[#d8f6e8]/50 dark:border-slate-800 dark:bg-none dark:bg-slate-900/60 px-5 py-4">
                 <div className="flex items-center gap-2">
                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"><Search className="h-3.5 w-3.5"/></span>
                   <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Search SHA / Client Registry</h2>
                 </div>
                 <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">The registry determines the member record and dependant list. Do not manually enter a principal member or relationship.</p>
               </div>
               
               <div className="p-5 space-y-5">
                 <div className="grid gap-3 md:grid-cols-[200px_1fr_auto] items-end">
                   <div>
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Identifier type</Label>
                     <select value={form.data.identifier_type} onChange={e=>form.setData('identifier_type',e.target.value)} className={`mt-1.5 ${inputCls}`}>
                       <option>National ID</option><option>ClientRegistry ID</option><option>Birth Notification</option><option>Birth Certificate</option><option>Alien ID</option><option>Mandate Number</option>
                     </select>
                   </div>
                   <div>
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Identifier number</Label>
                     <Input value={form.data.identifier_number} onChange={e=>form.setData('identifier_number',e.target.value)} placeholder={isDevelopmentMode?'Use a synthetic development identifier':'Enter member identifier'} className={`mt-1.5 ${inputCls}`}/>
                   </div>
                   <Button type="button" onClick={lookup} disabled={lookupBusy||!can.shaLookup} className="h-9 rounded-xl bg-emerald-700 px-4 text-xs text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                     {lookupBusy ? <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin"/> : <Search className="mr-2 h-3.5 w-3.5"/>} Search
                   </Button>
                 </div>

                 {lookupStatus && <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-2.5 text-xs text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300"><Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"/><p>{lookupStatus}</p></div>}

                 {registryPrincipal && (
                   <div className="space-y-3 pt-1">
                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Registry results</h3>
                     
                     <button type="button" onClick={()=>handleSelectMember(registryPrincipal,null)} disabled={transitioning} className={`w-full group relative flex items-center justify-between gap-4 rounded-xl border p-3.5 text-left transition-all ${selectedPerson&&idOf(selectedPerson)===idOf(registryPrincipal)?'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20 dark:bg-emerald-950/30 dark:ring-emerald-500/30':'border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                       <div className="flex items-center gap-3">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white transition-all dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-300 dark:group-hover:from-emerald-600 dark:group-hover:to-teal-600 dark:group-hover:text-white">
                           <UserRound className="h-4.5 w-4.5"/>
                         </div>
                         <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                             {nameOf(registryPrincipal)} 
                             <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">Principal</span>
                           </p>
                           <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">ID {idOf(registryPrincipal)} · DOB {registryPrincipal.date_of_birth||'—'} · {registryPrincipal.gender||registryPrincipal.sex||'—'}</p>
                           {contactsFor(registryPrincipal).length > 0 && (
                             <div className="mt-1.5 flex flex-wrap gap-1.5">
                               {contactsFor(registryPrincipal).map((c) => (
                                 <span key={c.value} className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                   {c.type==='phone' ? <Phone className="h-2.5 w-2.5"/> : <Mail className="h-2.5 w-2.5"/>}
                                   {c.value}
                                 </span>
                               ))}
                             </div>
                           )}
                         </div>
                       </div>
                       <div className="flex flex-col items-end shrink-0">
                         <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-emerald-900/10 group-hover:bg-emerald-800 transition-colors">
                           {transitioning ? <LoaderCircle className="h-3 w-3 animate-spin"/> : 'Select'}
                         </span>
                       </div>
                     </button>

                     {dependants.length > 0 && (
                       <div className="space-y-2 pt-1">
                         <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Users className="h-3 w-3"/> Dependants ({dependants.length})</h3>
                         <div className="grid gap-2 sm:grid-cols-2">
                           {dependants.map((d,i)=>(
                             <button key={`${idOf(d)}-${i}`} type="button" onClick={()=>handleSelectMember(d,registryPrincipal)} disabled={transitioning} className={`w-full group relative flex flex-col justify-between gap-2.5 rounded-xl border p-3 text-left transition-all ${selectedPerson&&idOf(selectedPerson)===idOf(d)?'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20 dark:bg-emerald-950/30 dark:ring-emerald-500/30':'border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                               <div>
                                 <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                                   {nameOf(d)}
                                   <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${d.relationship_verified?'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300':'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'}`}>{d.relationship_verified?'Listed':'Unconfirmed'}</span>
                                 </p>
                                 <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{d.relationship||'—'} · ID {idOf(d)}</p>
                               </div>
                               <div className="flex items-center justify-between mt-1">
                                 <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Select member</span>
                                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors dark:bg-emerald-900/50 dark:text-emerald-400 dark:group-hover:bg-emerald-600">
                                   {transitioning ? <LoaderCircle className="h-3 w-3 animate-spin"/> : <ArrowRight className="h-3 w-3"/>}
                                 </div>
                               </div>
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                     {!dependants.length && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">No dependants returned. The member can still be selected for their own visit.</p>}
                   </div>
                 )}
               </div>

               <div className="border-t border-emerald-100/70 bg-emerald-50/30 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 dark:border-slate-800 dark:bg-slate-900/40">
                 <Button type="button" variant="outline" size="sm" onClick={startLocal} className="h-7 rounded-lg border-emerald-200 bg-white text-[11px] text-emerald-800 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Register local / non-SHA patient</Button>
                 <p className="text-[10px] text-slate-500 dark:text-slate-400">SHA identity lookup does not itself prove eligibility.</p>
               </div>
             </div>
           )}

           {/* STEP 2: BENEFITS */}
           {step === 2 && (
             <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-sm overflow-hidden">
               <div className="border-b border-emerald-100/70 bg-gradient-to-br from-[#e9fbf2] to-[#d8f6e8]/50 dark:border-slate-800 dark:bg-none dark:bg-slate-900/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                 <div className="flex items-center gap-2">
                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"><WalletCards className="h-3.5 w-3.5"/></span>
                   <div>
                     <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Coverage and benefits</h2>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Selected: <strong className="text-slate-800 dark:text-slate-200">{selectedPerson?nameOf(selectedPerson):'None'}</strong></p>
                   </div>
                 </div>
                 <Button type="button" variant="ghost" size="sm" onClick={()=>setStep(1)} className="h-7 text-[11px] shrink-0 self-start sm:self-auto text-emerald-700 dark:text-emerald-400"><ChevronLeft className="mr-1 h-3 w-3"/> Back</Button>
               </div>

               <div className="p-5 space-y-4">
                 {(((selectedPerson?.schemes?.length||0)>0||(selectedPerson?.coverage?.length||0)>0)) && (
                   <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                     <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-900/70 dark:text-emerald-400/70">Coverage from registry</h3>
                     <div className="grid gap-2 sm:grid-cols-2">
                       {(Array.isArray(selectedPerson?.schemes)&&selectedPerson.schemes.length?selectedPerson.schemes:selectedPerson?.coverage||[]).map((c:any,i:number)=>(
                         <div key={i} className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-xs shadow-sm dark:border-slate-800 dark:bg-[#111c2d]">
                           <p className="font-semibold text-slate-900 dark:text-slate-100">{c.name||c.scheme||c.type||c.coverage_type||'Coverage record'}</p>
                           <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{[c.status,c.startDate||c.start_date,c.endDate||c.end_date].filter(Boolean).map(String).join(' · ')||'No additional fields'}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {benefitsBusy && <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"><LoaderCircle className="h-3.5 w-3.5 animate-spin"/> Loading benefits…</p>}
                 {benefitsStatus && <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-2.5 text-xs text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300"><Info className="h-3.5 w-3.5 shrink-0 mt-0.5"/><p>{benefitsStatus}</p></div>}

                 {benefits.length > 0 ? (
                   <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                     {benefits.map((b,i)=>{
                       const code=String(b.code||b.id||b.benefit_code||i);const title=String(b.name||b.benefit_name||b.package||'Unnamed benefit');
                       const isSelected = selectedBenefit===b;
                       return (
                         <button type="button" key={`${code}-${i}`} onClick={()=>void chooseBenefit(b)} className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${isSelected?'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/20 dark:bg-emerald-950/30 dark:ring-emerald-500/30':'border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                           <div>
                             <div className="flex items-start justify-between gap-2">
                               <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{title}</p>
                               <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors ${isSelected?'border-emerald-600 bg-emerald-600 text-white':'border-slate-300 bg-white group-hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800'}`}>
                                 {isSelected && <Check className="h-2.5 w-2.5"/>}
                               </div>
                             </div>
                             <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{b.description||b.sub_benefits?.map(x=>x.name||x.benefit_name).filter(Boolean).join(', ')||'Benefit details'}</p>
                           </div>
                           <div className="mt-2.5 flex items-center justify-between border-t border-emerald-100/50 pt-2 dark:border-slate-700">
                             <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{b.status||'Status not supplied'}</span>
                             <WalletCards className={`h-3.5 w-3.5 ${isSelected?'text-emerald-600 dark:text-emerald-400':'text-slate-300 dark:text-slate-600'}`}/>
                           </div>
                         </button>
                       );
                     })}
                   </div>
                 ) : !benefitsBusy && selectedPerson && (
                   <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                     <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"/>
                     <p>No benefit list is available. Configure the documented `patient.benefits` operation for this environment; the system will not invent SHA entitlements.</p>
                   </div>
                 )}

                 {selectedBenefit && (
                   <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-3.5 dark:border-emerald-900/40 dark:bg-none dark:bg-emerald-950/20">
                     <div className="flex items-start justify-between gap-2">
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Selected benefit</p>
                         <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{form.data.sha_benefit_name}</p>
                       </div>
                       <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${preauthStatus==='approved'?'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20':'bg-amber-500 text-white shadow-sm shadow-amber-900/20'}`}>{preauthStatus.replaceAll('_',' ')}</span>
                     </div>

                     <div className="mt-3 border-t border-emerald-200/60 pt-3 dark:border-emerald-900/40">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Sub-benefits for {String(selectedBenefit.name||selectedBenefit.benefit_name||selectedBenefit.package||'selected benefit')}</h4>
                       <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Loaded for this registry patient and selected benefit.</p>
                       {(selectedBenefit.sub_benefits||[]).length ? (
                         <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                           {(selectedBenefit.sub_benefits||[]).map((sb:any,i:number)=>{
                             const sbCode=String(sb.code||sb.id||sb.benefit_code||i);const sbTitle=String(sb.name||sb.benefit_name||sb.package||'Unnamed sub-benefit');
                             const isSubSelected = selectedSubBenefit===sb;
                             return (
                               <button key={`${sbCode}-${i}`} type="button" onClick={()=>void chooseSubBenefit(sb)} className={`group flex items-center justify-between gap-2 rounded-lg border p-2.5 text-left transition-all ${isSubSelected?'border-emerald-500 bg-white ring-1 ring-emerald-500/20 shadow-sm dark:bg-emerald-950/30':'border-emerald-100 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                                 <div className="min-w-0">
                                   <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 truncate">{sbTitle}</p>
                                   <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400 truncate">{sb.description||sb.status||'Provider-returned sub-benefit'}</p>
                                 </div>
                                 <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${isSubSelected?'border-emerald-600 bg-emerald-600 text-white':'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'}`}>
                                   {isSubSelected && <Check className="h-2.5 w-2.5"/>}
                                 </span>
                               </button>
                             );
                           })}
                         </div>
                       ) : (
                         <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] text-slate-600 dark:bg-slate-900 dark:text-slate-300">{selectedBenefit.sub_benefits_status==='unavailable'?'Sub-benefit lookup is unavailable. Configure the patient.sub_benefits operation using the assigned Postman contract.':'No sub-benefits were returned for this benefit. The system will not invent any.'}</p>
                       )}
                     </div>
                   </div>
                 )}
               </div>

               <div className="border-t border-emerald-100/70 bg-emerald-50/30 px-5 py-2.5 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/40">
                 <span className="text-[10px] text-slate-500 dark:text-slate-400">Choose a benefit {(selectedBenefit?.sub_benefits||[]).length>0?'and sub-benefit ':''}to continue</span>
                 <Button type="button" 
                   disabled={!selectedBenefit||((selectedBenefit.sub_benefits||[]).length>0&&!selectedSubBenefit)||(!isDevelopmentMode&&selectedBenefit.sub_benefits_status==='unavailable')||benefitsBusy||(!isDevelopmentMode&&!['approved','not_required','not-required','not required','not_required_by_rules'].includes(preauthStatus.toLowerCase()))} 
                   onClick={()=>handleAdvance(3)} 
                   className="h-8 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800 transition-all">
                   {transitioning ? <><LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin"/> Continuing…</> : <>Continue to Verification <ArrowRight className="ml-1.5 h-3.5 w-3.5"/></>}
                 </Button>
               </div>
             </div>
           )}

           {/* STEP 3: VERIFY */}
           {step === 3 && (
             <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-sm overflow-hidden">
               <div className="border-b border-emerald-100/70 bg-gradient-to-br from-[#e9fbf2] to-[#d8f6e8]/50 dark:border-slate-800 dark:bg-none dark:bg-slate-900/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                 <div className="flex items-center gap-2">
                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"><ShieldCheck className="h-3.5 w-3.5"/></span>
                   <div>
                     <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                       Verify the member
                       {authVerified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/>}
                     </h2>
                     <p className="text-xs text-slate-500 dark:text-slate-400">{selectedPerson?nameOf(selectedPerson):'—'} · {form.data.sha_benefit_name}{form.data.sha_sub_benefit_name?` · ${form.data.sha_sub_benefit_name}`:''}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 self-start sm:self-auto">
                   <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${authVerified?'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20':'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'}`}>
                     {authVerified ? <><CheckCircle2 className="h-2.5 w-2.5"/> Verified</> : isDevelopmentMode ? 'Dev Simulation' : 'Live required'}
                   </span>
                   <Button type="button" variant="ghost" size="sm" onClick={()=>setStep(2)} className="h-7 text-[11px] text-emerald-700 dark:text-emerald-400"><ChevronLeft className="mr-1 h-3 w-3"/> Back</Button>
                 </div>
               </div>

               <div className="p-5">
                 <div className="grid gap-4 lg:grid-cols-12">
                   <div className="lg:col-span-5 space-y-3">
                     <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${isDevelopmentMode?'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200':'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-200'}`}>
                       <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-80"/>
                       <p className="leading-snug">{isDevelopmentMode?'Development only: synthetic simulations. No real SMS or fingerprint template captured.':'Production requires connected live adapters.'}</p>
                     </div>

                     <div className="space-y-2">
                       <button type="button" onClick={()=>{setAuthMethod('otp');setChallenge('');setOtp('');setDevelopmentOtp('');setOtpVerified(false);setBiometricVerified(false);setAuthStatus('');}} className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${authMethod==='otp'?'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50/60 ring-1 ring-emerald-500/20 dark:bg-emerald-950/30 dark:from-emerald-950/40 dark:to-teal-950/20 dark:ring-emerald-500/30':'border-emerald-100 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                         <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${authMethod==='otp'?'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20':'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'}`}><ShieldCheck className="h-4 w-4"/></div>
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-slate-900 dark:text-slate-100">One-time password</p>
                           <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Via registered phone or email</p>
                         </div>
                         <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${authMethod==='otp'?'border-emerald-600 bg-emerald-600':'border-slate-300 dark:border-slate-600'}`}>{authMethod==='otp' && <Check className="h-2.5 w-2.5 text-white"/>}</div>
                       </button>

                       <button type="button" onClick={()=>{setAuthMethod('biometric');setChallenge('');setOtp('');setDevelopmentOtp('');setOtpVerified(false);setBiometricVerified(false);setAuthStatus('');}} className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${authMethod==='biometric'?'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50/60 ring-1 ring-emerald-500/20 dark:bg-emerald-950/30 dark:from-emerald-950/40 dark:to-teal-950/20 dark:ring-emerald-500/30':'border-emerald-100 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                         <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${authMethod==='biometric'?'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20':'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'}`}><Fingerprint className="h-4 w-4"/></div>
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Fingerprint biometric</p>
                           <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Via connected scanner device</p>
                         </div>
                         <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${authMethod==='biometric'?'border-emerald-600 bg-emerald-600':'border-slate-300 dark:border-slate-600'}`}>{authMethod==='biometric' && <Check className="h-2.5 w-2.5 text-white"/>}</div>
                       </button>
                     </div>

                     <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
                       <p className="font-semibold">Verifying for: <strong className="text-emerald-950 dark:text-emerald-100">{selectedPerson?nameOf(selectedPerson):'—'}</strong></p>
                       <p className="mt-0.5 opacity-80">{form.data.sha_benefit_name}{form.data.sha_sub_benefit_name?` · ${form.data.sha_sub_benefit_name}`:''}</p>
                     </div>
                   </div>

                   <div className="lg:col-span-7 rounded-2xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-[#f7faf9] to-[#eef7f3] dark:bg-none dark:from-slate-900/40 dark:to-slate-800/20 p-4 flex flex-col">
                     
                     {authMethod === 'otp' && (
                       <div className="space-y-3 flex-1 flex flex-col">
                         <div>
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Select destination contact</Label>
                           <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                             {contactsFor(registryPrincipal).map((c) => (
                               <button key={`${c.type}-${c.value}`} type="button" onClick={()=>setContact(c.value)} className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${contact===c.value?'border-emerald-500 bg-white ring-1 ring-emerald-500/20 shadow-sm dark:bg-emerald-950/30':'border-emerald-100 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-[#111c2d] dark:hover:border-emerald-700'}`}>
                                 <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${contact===c.value?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400':'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                   {c.type==='phone'?<Phone className="h-3 w-3"/>:<Mail className="h-3 w-3"/>}
                                 </div>
                                 <span className="flex-1 font-medium truncate text-slate-800 dark:text-slate-200">{c.value}</span>
                                 <div className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${contact===c.value?'border-emerald-600 bg-emerald-600':'border-slate-300 dark:border-slate-600'}`}>{contact===c.value && <Check className="h-2 w-2 text-white"/>}</div>
                               </button>
                             ))}
                           </div>
                         </div>
                         
                         <Button type="button" disabled={authBusy||!contact} onClick={()=>void startAuth()} className="h-9 rounded-xl bg-emerald-700 text-xs text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                           {authBusy?<LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin"/>:isDevelopmentMode?<Sparkles className="mr-2 h-3.5 w-3.5"/>:<Mail className="mr-2 h-3.5 w-3.5"/>}{isDevelopmentMode?'Generate development code':'Request OTP'}
                         </Button>

                         {challenge && (
                           <div className="mt-auto space-y-2.5 border-t border-emerald-100/60 pt-3 dark:border-slate-700">
                             {isDevelopmentMode && developmentOtp && (
                               <div className="rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-3 text-center dark:border-emerald-800/50 dark:bg-none dark:bg-emerald-950/30">
                                 <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Development code · expires in 5 min</p>
                                 <p className="mt-1 font-mono text-xl font-bold tracking-[.22em] text-emerald-950 dark:text-emerald-100">{developmentOtp}</p>
                               </div>
                             )}
                             <div className="flex gap-2">
                               <Input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" maxLength={6} placeholder="Enter 6-digit code" className={`${inputCls} font-mono tracking-widest text-center`}/>
                               <Button type="button" disabled={authBusy||otp.length!==6} onClick={()=>void verifyOtp()} className="h-9 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                                 {authBusy?<LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin"/>:'Verify'}
                               </Button>
                             </div>
                           </div>
                         )}
                       </div>
                     )}

                     {authMethod === 'biometric' && (
                       <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-3">
                         <div className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 ${biometricVerified 
                           ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.45)]' 
                           : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 text-emerald-600 dark:text-emerald-400 border-2 border-dashed border-emerald-300 dark:border-emerald-800/60'}`}>
                           {!biometricVerified && (
                             <>
                               <div className="absolute inset-0 rounded-full border-2 border-emerald-300/40 dark:border-emerald-700/40 animate-ping"/>
                               <div className="absolute -inset-2 rounded-full border border-emerald-200/50 dark:border-emerald-800/30"/>
                             </>
                           )}
                           <div className={`absolute inset-1.5 rounded-full ${biometricVerified?'bg-white/10':'bg-white/60 dark:bg-slate-900/40'} backdrop-blur-sm`}/>
                           <Fingerprint className={`relative h-12 w-12 ${!biometricVerified&&isDevelopmentMode?'animate-pulse':''}`}/>
                           {biometricVerified && <CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white text-emerald-600 shadow-md dark:bg-slate-900"/>}
                         </div>
                         
                         <div className="text-center space-y-1">
                           <p className={`text-sm font-bold ${biometricVerified?'text-emerald-700 dark:text-emerald-400':'text-slate-900 dark:text-slate-100'}`}>
                             {biometricVerified?'Fingerprint verified':isDevelopmentMode?'Ready to simulate':'Waiting for scanner'}
                           </p>
                           <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[260px] mx-auto leading-relaxed">
                             {biometricVerified?'Mock match recorded for this development session.':isDevelopmentMode?'This simulated reader does not capture or store templates.':'Place the patient\'s finger on the connected scanner.'}
                           </p>
                         </div>

                         {isDevelopmentMode? (
                           <Button type="button" disabled={authBusy||biometricVerified} onClick={()=>void verifyBiometric()} className="h-9 w-full max-w-xs rounded-xl bg-emerald-700 text-xs text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                             {authBusy?<LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin"/>:<Fingerprint className="mr-2 h-3.5 w-3.5"/>} {challenge?'Simulate fingerprint match':'Start fingerprint verification'}
                           </Button>
                         ) : (
                           <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200 text-center max-w-xs">
                             Scanner bridge required for live verification.
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                 </div>

                 {authStatus && (
                   <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
                     <Info className="h-3.5 w-3.5 shrink-0 mt-0.5"/>
                     <p>{authStatus}</p>
                   </div>
                 )}
               </div>

               <div className="border-t border-emerald-100/70 bg-emerald-50/30 px-5 py-2.5 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/40">
                 <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{authVerified?'Method verified successfully':'One method required to proceed'}</span>
                 <Button type="button" disabled={!authVerified} onClick={()=>handleAdvance(4)} className="h-8 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800 transition-all">
                   {transitioning ? <><LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin"/> Continuing…</> : <>Continue to Confirmation <ArrowRight className="ml-1.5 h-3.5 w-3.5"/></>}
                 </Button>
               </div>
             </div>
           )}

           {/* STEP 4: CONFIRM — dashboard metric-card pattern */}
           {step === 4 && (
             <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] shadow-sm overflow-hidden">
               <div className="border-b border-emerald-100/70 bg-gradient-to-br from-[#e9fbf2] to-[#d8f6e8]/50 dark:border-slate-800 dark:bg-none dark:bg-slate-900/60 px-5 py-4">
                 <div className="flex items-center gap-2">
                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5"/></span>
                   <div>
                     <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Confirm registration and visit</h2>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Review the selected patient and visit context before saving.</p>
                   </div>
                 </div>
               </div>

               <div className="p-5 space-y-4">
                 {form.data.registration_source==='sha' ? (
                   <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:bg-none dark:bg-emerald-950/20 overflow-hidden">
                     <div className="px-4 py-3 border-b border-emerald-100/60 dark:border-emerald-900/40 flex items-center justify-between">
                       <div className="flex items-center gap-2.5">
                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                           <UserRound className="h-4 w-4"/>
                         </div>
                         <div>
                           <p className="text-sm font-bold text-emerald-950 dark:text-emerald-100">{selectedPerson?nameOf(selectedPerson):form.data.full_name}</p>
                           <p className="text-[10px] text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">Registry ID {form.data.client_registry_id} · DOB {form.data.date_of_birth||'—'}</p>
                         </div>
                       </div>
                       <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm shadow-emerald-900/20">
                         <ShieldCheck className="h-2.5 w-2.5"/> SHA Patient
                       </span>
                     </div>
                     {/* Metric-style tiles matching dashboard */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3">
                       {[
                         { label: 'Benefit', value: form.data.sha_benefit_name||'—' },
                         { label: 'Sub-benefit', value: form.data.sha_sub_benefit_name||'—' },
                         { label: 'Visit type', value: form.data.visit_type },
                         { label: 'Preauth', value: form.data.sha_preauthorization_status.replaceAll('_',' ') },
                       ].map((tile) => (
                         <div key={tile.label} className="rounded-xl border border-emerald-100 bg-white dark:border-slate-800 dark:bg-[#111c2d] px-3 py-2 shadow-sm">
                           <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{tile.label}</p>
                           <p className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100 capitalize truncate">{tile.value}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 ) : (
                   <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                     <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">First name</Label><Input className={`mt-1 ${inputCls}`} value={form.data.first_name} onChange={e=>form.setData('first_name',e.target.value)} required/></div>
                     <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Last name</Label><Input className={`mt-1 ${inputCls}`} value={form.data.last_name} onChange={e=>form.setData('last_name',e.target.value)} required/></div>
                     <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date of birth</Label><Input type="date" className={`mt-1 ${inputCls}`} value={form.data.date_of_birth} onChange={e=>form.setData('date_of_birth',e.target.value)}/></div>
                     <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</Label><Input className={`mt-1 ${inputCls}`} value={form.data.phone} onChange={e=>form.setData('phone',e.target.value)}/></div>
                     <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Visit type</Label><select className={`mt-1 ${inputCls}`} value={form.data.visit_type} onChange={e=>form.setData('visit_type',e.target.value)}><option value="outpatient">Outpatient</option><option value="inpatient">Inpatient</option><option value="emergency">Emergency</option><option value="follow_up">Follow-up</option><option value="procedure">Procedure</option></select></div>
                     <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reason</Label><Input className={`mt-1 ${inputCls}`} value={form.data.chief_complaint} onChange={e=>form.setData('chief_complaint',e.target.value)}/></div>
                   </div>
                 )}

                 <div className="grid gap-3 sm:grid-cols-2">
                   <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Department / ward</Label><Input className={`mt-1 ${inputCls}`} value={form.data.department} onChange={e=>form.setData('department',e.target.value)} placeholder="Optional"/></div>
                   <div><Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reason for visit</Label><Input className={`mt-1 ${inputCls}`} value={form.data.chief_complaint} onChange={e=>form.setData('chief_complaint',e.target.value)} placeholder="Presenting complaint"/></div>
                 </div>

                 <label className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 transition-colors hover:bg-emerald-50/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/50 cursor-pointer">
                   <input type="checkbox" checked={form.data.create_visit} onChange={e=>form.setData('create_visit',e.target.checked)} className="mt-1 h-3.5 w-3.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-600 dark:border-slate-600 dark:bg-slate-700"/>
                   <span>
                     <strong className="block text-xs font-bold text-slate-900 dark:text-slate-100">Start a visit now</strong>
                     <span className="mt-0.5 block text-[10px] text-slate-500 dark:text-slate-400">The visit opens in its own encounter workspace.</span>
                   </span>
                 </label>

                 <div>
                   <Button type="button" variant="outline" size="sm" onClick={()=>void duplicateCheck()} disabled={duplicateBusy} className="h-7 rounded-lg border-emerald-200 bg-white text-[11px] text-emerald-800 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                     {duplicateBusy?<LoaderCircle className="mr-1.5 h-3 w-3 animate-spin"/>:<Search className="mr-1.5 h-3 w-3"/>} Check duplicates
                   </Button>
                   {duplicateStatus && <p className="mt-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">{duplicateStatus}</p>}
                   {duplicateMatches.map((m:any)=>(
                     <div key={m.id} className="mt-1.5 flex items-center justify-between rounded-lg border border-emerald-100 bg-white p-2 text-[11px] dark:border-slate-800 dark:bg-[#111c2d]">
                       <span className="font-medium text-slate-800 dark:text-slate-200">{m.full_name||'Existing patient'} <span className="text-slate-400 mx-0.5">·</span> {m.medical_record_number}</span>
                       <Button type="button" variant="outline" size="sm" className="h-6 rounded-md px-2 text-[10px]" onClick={()=>router.visit(`/patients/${m.id}`)}>Open</Button>
                     </div>
                   ))}
                 </div>

                 {Object.values(form.errors)[0] && (
                   <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                     <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5"/>
                     <p>{Object.values(form.errors)[0]}</p>
                   </div>
                 )}
               </div>

               <div className="border-t border-emerald-100/70 bg-emerald-50/30 px-5 py-2.5 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/40">
                 <Button type="button" variant="outline" size="sm" onClick={()=>setStep(form.data.registration_source==='sha'?3:1)} className="h-7 rounded-lg border-emerald-200 bg-white text-[11px] text-emerald-800 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"><ChevronLeft className="mr-1 h-3 w-3"/> Back</Button>
                 <Button type="submit" disabled={form.processing||duplicateBusy||(form.data.registration_source==='sha'&&form.data.create_visit&&!authVerified)} className="h-8 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800 transition-all">
                   {form.processing ? <><LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin"/> Saving…</> : form.data.create_visit ? <>Start visit <ArrowRight className="ml-1.5 h-3.5 w-3.5"/></> : <>Register patient <CheckCircle2 className="ml-1.5 h-3.5 w-3.5"/></>}
                 </Button>
               </div>
             </div>
           )}
         </form>
         
         <footer className="flex items-start gap-2 px-1 pb-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
           <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-500"/>
           <p>Identity, eligibility, authorization and preauthorization are separate checks. Unknown provider states are never treated as approval.</p>
         </footer>
       </div>
     </main>
   </>
 );
}
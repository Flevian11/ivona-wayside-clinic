import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    FileText,
    Fingerprint,
    HeartPulse,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Users,
    X,
    ReceiptText,
    Package,
    FlaskConical,
    TrendingUp,
    TrendingDown,
    Clock,
    Minus,
    CircleDot,
    Quote,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    ServerCrash,
    ArrowRight,
} from 'lucide-react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ReleaseAnnouncement = {
    id: number;
    version: string;
    title: string;
    release_type: string;
    summary: string;
    release_notes: string | null;
    features: string[];
    improvements: string[];
    bug_fixes: string[];
    security_notes: string[];
    known_issues: string[];
    published_at: string | null;
    acknowledge_url: string;
};
type Metric = { key: string; label: string; value: number; caption: string; tone: string };
type ActivityPoint = { date: string; visits: number | null };
type IntegrationActivity = {
    provider: string;
    operation: string;
    environment: string;
    result: string;
    http_status: number | null;
    created_at: string | null;
};
type DashboardData = {
    announcement: ReleaseAnnouncement | null;
    metrics: Metric[];
    visit_activity: ActivityPoint[];
    integration_activity: IntegrationActivity[];
    capabilities: Record<string, boolean>;
};
type SharedProps = {
    auth: { user: { name: string; email: string } | null; roles: { name: string; slug: string }[]; permissions: string[] };
    site: { name?: string; tagline?: string };
};

const tones: Record<string, { icon: string; line: string; soft: string; ring: string; glow: string }> = {
    emerald: { icon: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300', line: '#10b981', soft: '#d1fae5', ring: 'ring-emerald-500/20', glow: 'shadow-emerald-500/10' },
    blue: { icon: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300', line: '#0ea5e9', soft: '#e0f2fe', ring: 'ring-sky-500/20', glow: 'shadow-sky-500/10' },
    amber: { icon: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300', line: '#f59e0b', soft: '#fef3c7', ring: 'ring-amber-500/20', glow: 'shadow-amber-500/10' },
    violet: { icon: 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300', line: '#8b5cf6', soft: '#ede9fe', ring: 'ring-violet-500/20', glow: 'shadow-violet-500/10' },
    slate: { icon: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', line: '#64748b', soft: '#e2e8f0', ring: 'ring-slate-500/20', glow: 'shadow-slate-500/10' },
    teal: { icon: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300', line: '#14b8a6', soft: '#ccfbf1', ring: 'ring-teal-500/20', glow: 'shadow-teal-500/10' },
    rose: { icon: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300', line: '#f43f5e', soft: '#ffe4e6', ring: 'ring-rose-500/20', glow: 'shadow-rose-500/10' },
};

const icons: Record<string, typeof Users> = {
    patients: Users,
    today_visits: CalendarClock,
    waiting: Activity,
    staff: Stethoscope,
    accounts: ShieldCheck,
    integrations: Fingerprint,
    audit: FileText,
};

function useAnimatedNumber(target: number, duration = 900) {
    const [value, setValue] = useState(0);
    const ref = useRef<number>(0);
    useEffect(() => {
        let start: number | null = null;
        const from = ref.current;
        const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const current = Math.round(from + (target - from) * eased);
            setValue(current);
            ref.current = current;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);
    return value;
}

function Sparkline({ data, color = '#10b981', height = 40 }: { data: number[]; color?: string; height?: number }) {
    const max = Math.max(1, ...data);
    const w = 120;
    const step = w / Math.max(data.length - 1, 1);
    const pts = data.map((v, i) => `${i * step},${height - (v / max) * (height - 4) - 2}`).join(' ');
    return (
        <svg viewBox={`0 0 ${w} ${height}`} className="h-full w-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity=".35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${height} ${pts} ${w},${height}`} fill={`url(#spark-${color.replace('#', '')})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function VisitChart({ data }: { data: ActivityPoint[] }) {
    const valid = data.filter((p): p is ActivityPoint & { visits: number } => p.visits !== null);
    const [hover, setHover] = useState<number | null>(null);

    if (!valid.some((p) => p.visits > 0)) {
        return (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl bg-[#f7faf9] dark:bg-slate-800/50 px-6 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-emerald-700 shadow-sm">
                    <CalendarClock className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">No visits recorded</p>
                <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                    Daily activity will appear here once patient visits are registered.
                </p>
            </div>
        );
    }

    const max = Math.max(1, ...valid.map((p) => p.visits));
    const total = valid.reduce((n, p) => n + p.visits, 0);
    const avg = Math.round(total / valid.length);
    const peak = valid.reduce((m, p) => (p.visits > m.visits ? p : m), valid[0]);
    const xStep = 548 / Math.max(valid.length - 1, 1);
    const coords = valid.map((p, i) => `${26 + i * xStep},${172 - (p.visits / max) * 132}`).join(' ');
    const first = valid[0]?.visits ?? 0;
    const last = valid[valid.length - 1]?.visits ?? 0;
    const trend = last - first;
    const trendPct = first > 0 ? Math.round((trend / first) * 100) : 0;

    return (
        <div className="rounded-xl bg-[#f7faf9] dark:bg-slate-800/50 px-3 pt-3">
            <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">Total</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{total.toLocaleString()}</p>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">Avg</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{avg}</p>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">Peak</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{peak.visits}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${trend > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : trend < 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {trend > 0 ? <TrendingUp className="h-3 w-3" /> : trend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {trendPct > 0 ? '+' : ''}{trendPct}%
                </div>
            </div>
            <svg viewBox="0 0 600 200" className="h-[170px] w-full" role="img" aria-label="Recorded visits over the last seven days">
                <defs>
                    <linearGradient id="visitsArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity=".28" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="18" x2="582" y1={y} y2={y} className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeDasharray="3 5" />
                ))}
                <polygon points={`26,172 ${coords} ${26 + (valid.length - 1) * xStep},172`} fill="url(#visitsArea)" className="animate-[fadeIn_0.8s_ease-out]" />
                <polyline points={coords} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" className="animate-[drawLine_1.4s_ease-out_forwards]" style={{ strokeDasharray: 1200, strokeDashoffset: 0 }} />
                {valid.map((p, i) => {
                    const cx = 26 + i * xStep;
                    const cy = 172 - (p.visits / max) * 132;
                    const isHover = hover === i;
                    return (
                        <g key={p.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                            <circle cx={cx} cy={cy} r="14" fill="transparent" />
                            <circle cx={cx} cy={cy} r={isHover ? 6 : 4} fill="white" stroke="#059669" strokeWidth={isHover ? 3 : 2.2} className="transition-all duration-150" />
                            {isHover && (
                                <g>
                                    <rect x={cx - 22} y={cy - 30} width="44" height="20" rx="4" fill="#0f172a" />
                                    <text x={cx} y={cy - 17} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">{p.visits}</text>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
            <div className="grid pb-2 text-center text-[10px] text-slate-500 dark:text-slate-400" style={{ gridTemplateColumns: `repeat(${valid.length}, minmax(0, 1fr))` }}>
                {valid.map((p) => (
                    <span key={p.date} className={hover === valid.indexOf(p) ? 'font-semibold text-emerald-700 dark:text-emerald-400' : ''}>{p.date}</span>
                ))}
            </div>
        </div>
    );
}

function IntegrationDonut({ items }: { items: IntegrationActivity[] }) {
    const success = items.filter((x) => ['success', 'succeeded', 'ok'].includes((x.result || '').toLowerCase()) || (x.http_status !== null && x.http_status >= 200 && x.http_status < 300)).length;
    const failed = items.filter((x) => ['error', 'failed', 'failure'].includes((x.result || '').toLowerCase()) || (x.http_status !== null && x.http_status >= 400)).length;
    const other = Math.max(0, items.length - success - failed);
    const total = items.length;
    const rate = total ? Math.round((success / total) * 100) : 0;
    const segments = total
        ? [
              { count: success, color: '#10b981', label: 'Successful' },
              { count: failed, color: '#fb7185', label: 'Failed' },
              { count: other, color: '#fbbf24', label: 'Other' },
          ].filter((s) => s.count > 0)
        : [];
    let offset = 0;
    const circles = segments.map((s) => {
        const dash = (s.count / total) * 251.2;
        const result = { ...s, offset, dash };
        offset += dash;
        return result;
    });

    return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl bg-[#f7faf9] dark:bg-slate-800/50 p-4 sm:flex-row sm:gap-6">
            <div className="relative h-36 w-36 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeWidth="9" />
                    {circles.map((s, i) => (
                        <circle
                            key={i}
                            cx="50" cy="50" r="40" fill="none"
                            stroke={s.color} strokeWidth="9"
                            strokeDasharray={`${s.dash} ${251.2 - s.dash}`}
                            strokeDashoffset={-s.offset} strokeLinecap="butt"
                            className="animate-[donutReveal_1s_ease-out_forwards]"
                            style={{ strokeDashoffset: -s.offset }}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Success</span>
                    <strong className="text-2xl tracking-tight text-slate-900 dark:text-slate-100">{rate}%</strong>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">{total} ops</span>
                </div>
            </div>
            <div className="w-full max-w-[200px] space-y-2">
                {[
                    { label: 'Successful', value: success, color: 'bg-emerald-500' },
                    { label: 'Failed', value: failed, color: 'bg-rose-400' },
                    { label: 'Other / pending', value: other, color: 'bg-amber-400' },
                ].map((x) => (
                    <div key={x.label} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${x.color}`} />
                        <span className="flex-1 text-[11px] text-slate-600 dark:text-slate-300">{x.label}</span>
                        <strong className="text-xs text-slate-900 dark:text-slate-100">{x.value}</strong>
                        <span className="w-9 text-right text-[9px] text-slate-400">{total ? Math.round((x.value / total) * 100) : 0}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const QUOTES = [
    { text: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "William Osler" },
    { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
    { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
    { text: "Medicine is not only a science; it is also an art.", author: "Paracelsus" }
];

const IMAGES = [
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800"
];

function CarouselBanner() {
    const [current, setCurrent] = useState(0);
    const [validImages, setValidImages] = useState<string[]>([]);

    useEffect(() => {
        let active = true;
        const checkImages = async () => {
            const valid: string[] = [];
            for (const url of IMAGES) {
                await new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => { valid.push(url); resolve(); };
                    img.onerror = () => resolve();
                    img.src = url;
                });
            }
            if (active) setValidImages(valid);
        };
        checkImages();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % QUOTES.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((p) => (p + 1) % QUOTES.length);
    const prev = () => setCurrent((p) => (p - 1 + QUOTES.length) % QUOTES.length);
    const currentImage = validImages.length > 0 ? validImages[current % validImages.length] : null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 h-full min-h-[220px] flex flex-col justify-end shadow-sm border border-slate-200 dark:border-slate-800">
            {currentImage ? (
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105" style={{ backgroundImage: `url(${currentImage})` }} />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-900 transition-all duration-1000" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/30" />
            <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-end">
                <Quote className="h-8 w-8 text-emerald-400/50 mb-3" />
                <div className="relative h-24">
                    {QUOTES.map((q, i) => (
                        <div key={i} className={`absolute inset-0 transition-all duration-700 ease-in-out ${i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                            <p className="text-sm md:text-base font-medium text-white leading-snug line-clamp-3">"{q.text}"</p>
                            <p className="mt-2 text-xs text-emerald-300 font-semibold">— {q.author}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex gap-1.5">
                        {QUOTES.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />
                        ))}
                    </div>
                    <div className="ml-auto flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-white hover:bg-white/20" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-white hover:bg-white/20" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReleaseBody({ release }: { release: ReleaseAnnouncement }) {
    const sections = [
        ["What's new", release.features],
        ['Improvements', release.improvements],
        ['Fixes', release.bug_fixes],
        ['Security notes', release.security_notes],
        ['Known issues', release.known_issues],
    ] as [string, string[]][];
    return (
        <div className="space-y-3">
            {release.release_notes && <p className="whitespace-pre-line rounded-lg bg-slate-50 dark:bg-slate-800 p-2.5 text-xs leading-5">{release.release_notes}</p>}
            {sections.filter((s) => s[1].length).map(([title, items]) => (
                <div key={title}>
                    <h3 className="text-xs font-semibold">{title}</h3>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-600 dark:text-slate-300">
                        {items.map((item, i) => <li key={`${title}-${i}`}>{item}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
    const Icon = icons[metric.key] || Activity;
    const t = tones[metric.tone] || tones.emerald;
    const animated = useAnimatedNumber(metric.value, 800 + index * 100);
    const spark = useMemo(() => {
        const seed = metric.value % 17;
        return Array.from({ length: 8 }, (_, i) => Math.max(1, Math.round((metric.value / 8) * (1 + Math.sin(i + seed) * 0.5))));
    }, [metric.value]);

    return (
        <article className={`group relative overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${t.glow}`}>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle, ${t.soft}, transparent 70%)` }} />
            <div className="relative flex items-start justify-between gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.icon}`}><Icon className="h-5 w-5" /></div>
                <div className="h-8 w-20 opacity-70"><Sparkline data={spark} color={t.line} height={32} /></div>
            </div>
            <p className="relative mt-3 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
            <div className="relative mt-1 flex items-end justify-between gap-2">
                <strong className="text-2xl font-semibold leading-none tracking-tight text-slate-950 dark:text-slate-50 tabular-nums">{animated.toLocaleString()}</strong>
                <span className="mb-0.5 flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300"><CircleDot className="h-2.5 w-2.5 animate-pulse" />Live</span>
            </div>
            <p className="relative mt-2 truncate text-[11px] text-slate-500 dark:text-slate-400">{metric.caption}</p>
        </article>
    );
}

function SupportPill({ metric }: { metric: Metric }) {
    const Icon = icons[metric.key] || Activity;
    const t = tones[metric.tone] || tones.slate;
    const animated = useAnimatedNumber(metric.value, 700);
    return (
        <article className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] px-4 py-3 shadow-sm transition hover:border-slate-200 dark:hover:border-slate-700">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.icon}`}><Icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
                <p className="text-lg font-semibold leading-tight text-slate-950 dark:text-slate-50 tabular-nums">{animated.toLocaleString()}</p>
            </div>
        </article>
    );
}

export default function Dashboard({ dashboard: data }: { dashboard: DashboardData }) {
    const { auth, site } = usePage().props as unknown as SharedProps;
    const [collapsed, setCollapsed] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [acknowledging, setAcknowledging] = useState(false);
    const [now, setNow] = useState(new Date());
    
    const name = auth.user?.name?.split(' ')[0] || 'there';
    const caps = data.capabilities || {};
    const admin = Boolean(caps.users_manage && caps.roles_manage);

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(t);
    }, []);

    const actions = useMemo(() => [
        { label: 'New patient / visit', desc: 'Register or reopen patient', icon: Plus, href: '/patients/create', show: caps.patients_create, primary: true },
        { label: 'Find a patient', desc: 'Search by MRN, name, phone', icon: Search, href: '/patients', show: caps.patients_view },
        { label: 'Appointments & queue', desc: 'Manage today’s flow', icon: CalendarClock, href: '/appointments', show: caps.appointments_manage },
        { label: 'Clinical workspace', desc: 'Permitted care workflows', icon: Stethoscope, href: '/clinical/encounters', show: caps.clinical_view },
        { label: 'Billing & payments', desc: 'Review billing activity', icon: ReceiptText, href: '/billing', show: caps.billing_view },
        { label: 'SHA eligibility & claims', desc: 'Verify eligibility, claims', icon: Fingerprint, href: '/admin/developer-tools', show: caps.sha_verify },
        { label: 'Staff & access', desc: 'Accounts & permissions', icon: ShieldCheck, href: '/admin/administration/users', show: admin },
        { label: 'Integration operations', desc: 'Provider env & logs', icon: Activity, href: '/admin/developer-tools', show: caps.integrations_view },
    ].filter((a) => a.show), [caps, admin]);

    const ack = () => {
        if (!data.announcement || acknowledging) return;
        setAcknowledging(true);
        router.post(data.announcement.acknowledge_url, {}, { preserveScroll: true, onFinish: () => setAcknowledging(false) });
    };

    const find = (key: string) => data.metrics.find((m) => m.key === key);
    const primaryMetrics = [find('patients'), find('today_visits'), find('waiting')].filter((m): m is Metric => Boolean(m));
    const supportMetrics = data.metrics.filter((m) => !['patients', 'today_visits', 'waiting'].includes(m.key));
    const activity = data.integration_activity || [];
    const visitTotal = (data.visit_activity || []).reduce((n, p) => n + (p.visits || 0), 0);
    
    const capabilityAreas = [
        { label: 'Patient care', ok: caps.patients_view, icon: HeartPulse },
        { label: 'Clinical care', ok: caps.clinical_view, icon: Stethoscope },
        { label: 'Billing', ok: caps.billing_view, icon: ReceiptText },
        { label: 'Inventory', ok: auth.permissions?.includes('inventory.view'), icon: Package },
        { label: 'Diagnostics', ok: auth.permissions?.includes('lab.orders.view'), icon: FlaskConical },
        { label: 'Administration', ok: admin, icon: ShieldCheck },
    ];

    const hour = now.getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';

    return (
        <>
            <Head title="Operations dashboard" />
            <style>{`
                @keyframes drawLine { from { stroke-dashoffset: 1200; } to { stroke-dashoffset: 0; } }
                @keyframes donutReveal { from { stroke-dasharray: 0 251.2; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            
            {/* Changed main wrapper to max-w-none w-full to stretch full width like changelog */}
            <main className="min-h-screen w-full bg-[#f4f8f6] dark:bg-[#08131a] px-4 py-5 md:px-6 md:py-6 transition-colors duration-300">
                <div className="mx-auto w-full max-w-none space-y-4">
                    
                    {/* HERO ROW */}
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-[#d8f6e8] via-[#e9fbf2] to-[#c9efdf] dark:bg-none dark:bg-[#111c2d] p-6 shadow-sm">
                            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30 dark:border-white/[0.035]" />
                            <div className="relative z-10 flex h-full flex-col justify-center">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/65 dark:border-emerald-400/20 dark:bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.17em] text-emerald-900 dark:text-emerald-300">
                                        <HeartPulse className="h-3 w-3" />Clinic operations
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/50 dark:bg-slate-800/50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                        <Clock className="h-3 w-3" />
                                        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
                                    {greeting}, {name} <span className="text-emerald-700 dark:text-emerald-400">✦</span>
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {site.tagline || 'A connected workspace for patient care and clinic operations.'} Start a new registration or continue care for a returning patient.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    {caps.patients_create && (
                                        <Button asChild className="h-9 rounded-xl bg-emerald-700 px-4 text-sm text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                                            <Link href="/patients/create"><Plus className="mr-2 h-4 w-4" />New patient</Link>
                                        </Button>
                                    )}
                                    {caps.patients_view && (
                                        <Button asChild variant="outline" className="h-9 rounded-xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                                            <Link href="/patients"><Search className="mr-2 h-4 w-4" />Find patient</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <CarouselBanner />
                    </section>

                    {/* METRICS */}
                    <section className="grid gap-3 md:grid-cols-3">
                        {primaryMetrics.map((metric, i) => (
                            <MetricCard key={metric.key} metric={metric} index={i} />
                        ))}
                    </section>

                    {/* SUPPORT METRICS */}
                    {supportMetrics.length > 0 && (
                        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                            {supportMetrics.map((m) => (
                                <SupportPill key={m.key} metric={m} />
                            ))}
                        </section>
                    )}

                    {/* CHARTS */}
                    <section className="grid gap-4 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                        <article className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Integration outcomes</h2>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Provider operations</p>
                                </div>
                                <Fingerprint className="h-4 w-4 text-emerald-600" />
                            </div>
                            <IntegrationDonut items={activity} />
                        </article>

                        <article className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Patient visit activity</h2>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Last 7 days encounters</p>
                                </div>
                                <Badge variant="outline" className="text-[10px]">{visitTotal} total</Badge>
                            </div>
                            <VisitChart data={data.visit_activity || []} />
                        </article>
                    </section>

                    {/* ACTIVITY & QUICK ACTIONS */}
                    <section className="grid gap-4 xl:grid-cols-2">
                        {/* Recent Integration Activity */}
                        <article className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Integration Activity</h2>
                                <Activity className="h-4 w-4 text-slate-400" />
                            </div>
                            {activity.length ? (
                                <div className="flex-1 space-y-2.5">
                                    {activity.slice(0, 5).map((row, i) => {
                                        const isSuccess = ['success', 'succeeded', 'ok'].includes((row.result || '').toLowerCase()) || (row.http_status !== null && row.http_status >= 200 && row.http_status < 300);
                                        const isFailed = ['error', 'failed', 'failure'].includes((row.result || '').toLowerCase()) || (row.http_status !== null && row.http_status >= 400);
                                        const statusConfig = isSuccess 
                                            ? { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/50', icon: CheckCircle2 }
                                            : isFailed 
                                            ? { text: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-100 dark:border-rose-900/50', icon: ServerCrash }
                                            : { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-100 dark:border-amber-900/50', icon: AlertCircle };
                                        const Icon = statusConfig.icon;
                                        return (
                                            <div key={i} className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-sm ${statusConfig.border} ${statusConfig.bg}`}>
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-sm ${statusConfig.text}`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{row.provider}</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{row.operation}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-white dark:bg-slate-900 shadow-sm ${statusConfig.text}`}>
                                                        {row.http_status || row.result || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-8">
                                    <Activity className="h-8 w-8 text-slate-200 dark:text-slate-700 mb-2" />
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No recent operations</p>
                                </div>
                            )}
                        </article>

                        {/* Quick Actions - Made more compact */}
                        <article className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h2>
                                <ArrowRight className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 flex-1">
                                {actions.slice(0, 4).map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                                    >
                                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:group-hover:bg-emerald-900/50 dark:group-hover:text-emerald-400 transition-colors shrink-0">
                                            <action.icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{action.label}</span>
                                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">{action.desc}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </article>
                    </section>

                    {/* WORKSPACE CAPABILITIES */}
                    <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111c2d] p-5 shadow-sm">
                         <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="h-5 w-5 text-slate-400" />
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workspace Capabilities</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                            {capabilityAreas.map((area) => (
                                <div key={area.label} className={`flex items-center gap-2 p-2.5 rounded-xl border ${area.ok ? 'border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                                    <area.icon className={`h-4 w-4 ${area.ok ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">{area.label}</span>
                                    {area.ok && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* RELEASE ANNOUNCEMENT */}
            {data.announcement && (collapsed ? (
                <button onClick={() => setCollapsed(false)} className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-emerald-800 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl transition hover:bg-emerald-900">
                    <Sparkles className="h-3.5 w-3.5" />What’s new · v{data.announcement.version}
                </button>
            ) : (
                <section aria-label="New release announcement" className="fixed bottom-3 right-3 z-50 w-[min(420px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-emerald-100 bg-white dark:bg-slate-900 shadow-2xl">
                    <div className="flex items-start gap-2.5 p-3.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800"><Sparkles className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap gap-1.5">
                                <Badge className="bg-emerald-700 text-[9px] px-2 py-0">New release</Badge>
                                <Badge variant="outline" className="text-[9px] px-2 py-0">v{data.announcement.version}</Badge>
                            </div>
                            <h2 className="mt-1.5 text-sm font-semibold text-slate-950 dark:text-slate-50">{data.announcement.title}</h2>
                            <p className="mt-0.5 text-[11px] leading-4 text-slate-600 dark:text-slate-300">{data.announcement.summary}</p>
                            {expanded && <div className="mt-2 max-h-48 overflow-y-auto"><ReleaseBody release={data.announcement} /></div>}
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setExpanded((v) => !v)}>
                                    {expanded ? 'Less' : 'Details'} {expanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                                </Button>
                                <Button size="sm" className="h-7 text-[10px]" onClick={ack} disabled={acknowledging}>{acknowledging ? 'Saving…' : 'Don’t show again'}</Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCollapsed(true)}><ChevronDown className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={ack} disabled={acknowledging}><X className="h-3.5 w-3.5" /></Button>
                        </div>
                    </div>
                </section>
            ))}
        </>
    );
}
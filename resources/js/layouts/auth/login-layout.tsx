import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, HeartPulse, ShieldCheck } from 'lucide-react';
import type { AuthLayoutProps, SharedData } from '@/types';

export default function LoginLayout({
    children,
}: AuthLayoutProps) {
    const { site } = usePage<SharedData>().props;

    return (
        <main className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
            <section className="relative hidden min-h-svh overflow-hidden bg-[#103d2d] text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 size-[34rem] rounded-full border border-white/10" />
                    <div className="absolute -left-20 -top-20 size-[24rem] rounded-full border border-white/10" />
                    <div className="absolute -bottom-56 -right-32 size-[42rem] rounded-full bg-[#5ea77b]/15 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(130,190,150,0.18),transparent_48%)]" />
                </div>

                <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3 rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                    {site.logo_url ? (
                        <img src={site.logo_url} alt="" className="size-12 rounded-xl bg-white/10 object-contain p-1.5" />
                    ) : (
                        <span className="grid size-12 place-items-center rounded-xl border border-white/20 bg-white/10">
                            <HeartPulse className="size-7" aria-hidden="true" />
                        </span>
                    )}
                    <span className="min-w-0">
                        <span className="block text-base font-semibold tracking-tight">{site.name}</span>
                        <span className="mt-0.5 block text-xs text-white/65">Health information system</span>
                    </span>
                </Link>

                <div className="relative z-10 max-w-2xl py-16">
                    <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold tracking-[0.14em] text-white/85 uppercase">
                        <span className="size-1.5 rounded-full bg-emerald-300" />
                        Secure clinical workspace
                    </p>
                    <h1 className="max-w-xl text-5xl leading-[1.08] font-semibold tracking-[-0.045em] xl:text-6xl">
                        Better care starts with a <span className="text-emerald-200">connected team.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-8 text-white/70 xl:text-lg">
                        Sign in to access your authorised clinic workspace and the tools you need to support safe, coordinated care.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5">
                            <ShieldCheck className="size-5 text-emerald-200" aria-hidden="true" />
                            <span className="text-sm font-medium text-white/90">Protected access</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5">
                            <HeartPulse className="size-5 text-emerald-200" aria-hidden="true" />
                            <span className="text-sm font-medium text-white/90">Care-focused workflows</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between gap-6 border-t border-white/15 pt-5 text-xs text-white/55">
                    <span>{site.name}</span>
                    <span>Authorised personnel only</span>
                </div>
            </section>

            <section className="flex min-h-svh flex-col px-5 py-6 sm:px-8 lg:px-10 xl:px-16">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back to website
                    </Link>
                    <span className="text-xs font-medium tracking-wide text-muted-foreground">STAFF SIGN IN</span>
                </div>

                <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
                    <div className="mb-8 lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-3">
                            {site.logo_url ? (
                                <img src={site.logo_url} alt="" className="size-11 rounded-xl border border-border object-contain p-1.5" />
                            ) : (
                                <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                                    <HeartPulse className="size-6" aria-hidden="true" />
                                </span>
                            )}
                            <span>
                                <span className="block text-sm font-semibold">{site.name}</span>
                                <span className="block text-xs text-muted-foreground">Health information system</span>
                            </span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-primary uppercase">Welcome back</p>
                        <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Sign in to your account</h2>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Use your registered staff account to continue to the clinic system.
                        </p>
                    </div>

                    {children}

                    <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
                        Access is monitored and should only be used by authorised personnel.
                    </p>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground">
                    <span>© {new Date().getFullYear()} {site.name}</span>
                    <Link href="/privacy" className="inline-flex items-center gap-1.5 transition hover:text-primary">
                        Privacy and data protection <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                </footer>
            </section>
        </main>
    );
}

import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { AuthenticatedPageHeader } from '@/components/authenticated/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <>
            <Head title={`${title} · Administration`} />
            <main className="mx-auto flex w-full min-w-0 max-w-[1800px] flex-1 flex-col gap-5 p-3 sm:gap-6 sm:p-5 xl:p-6">
                <AuthenticatedPageHeader eyebrow="Clinic administration" title={title} description={description} />
                {children}
            </main>
        </>
    );
}

export function AdminPanel({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
    return (
        <Card className="gap-0 overflow-hidden rounded-xl border-border/80 py-0 shadow-sm">
            <CardHeader className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="space-y-1">
                    <CardTitle className="text-base tracking-tight">{title}</CardTitle>
                    {description && <p className="text-sm leading-5 text-muted-foreground">{description}</p>}
                </div>
                {action}
            </CardHeader>
            <CardContent className="p-4 sm:p-5">{children}</CardContent>
        </Card>
    );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return <label className="grid min-w-0 gap-1.5 text-sm"><span className="font-medium">{label}</span>{children}{error && <span className="text-xs text-destructive">{error}</span>}</label>;
}

export const inputClass = 'min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60';
export const primaryButton = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50';
export const secondaryButton = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50';
export function EmptyState({ title, detail }: { title: string; detail: string }) {
    return <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center"><p className="font-semibold">{title}</p><p className="mt-1 max-w-md text-sm text-muted-foreground">{detail}</p></div>;
}
export function StatusPill({ children, positive = false }: { children: ReactNode; positive?: boolean }) {
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${positive ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-border bg-muted/60 text-muted-foreground'}`}>{children}</span>;
}

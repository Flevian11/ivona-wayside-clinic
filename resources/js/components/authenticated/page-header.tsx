import type { ReactNode } from 'react';

export function AuthenticatedPageHeader({
    eyebrow,
    title,
    description,
    actions,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <header className="flex min-w-0 flex-col justify-between gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-end">
            <div className="min-w-0 space-y-1.5">
                {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
                {description && <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
    );
}

import type { ComponentType, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthenticatedSectionCard({
    title,
    description,
    icon: Icon,
    action,
    children,
    className = '',
}: {
    title: string;
    description?: string;
    icon?: ComponentType<{ className?: string }>; 
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Card className={`min-w-0 gap-0 border-border/80 shadow-sm ${className}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                <div className="flex min-w-0 items-start gap-3">
                    {Icon && <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>}
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                        {description && <CardDescription className="text-xs leading-5">{description}</CardDescription>}
                    </div>
                </div>
                {action}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

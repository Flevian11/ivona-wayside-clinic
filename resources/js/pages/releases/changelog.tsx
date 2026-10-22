import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CheckCircle2, ShieldAlert, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Release = {
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
};

function ReleaseSection({
    title,
    items,
    icon: Icon,
}: {
    title: string;
    items: string[];
    icon: typeof Sparkles;
}) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="size-4 text-primary" />
                {title}
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
            </ul>
        </div>
    );
}

export default function Changelog({ releases }: { releases: Release[] }) {
    return (
        <>
            <Head title="What's New" />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">Product updates</p>
                        <h1 className="text-3xl font-semibold tracking-tight">What’s New</h1>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            Published release notes for the clinic system. Draft and withdrawn releases are not shown here.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={dashboard()}>
                            <ArrowLeft className="size-4" />
                            Back to dashboard
                        </Link>
                    </Button>
                </div>

                {releases.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                <CalendarDays className="size-5 text-muted-foreground" />
                            </div>
                            <h2 className="font-semibold">No published release notes yet</h2>
                            <p className="max-w-md text-sm text-muted-foreground">
                                When a release is published, its summary and changelog will appear here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {releases.map((release) => (
                            <Card key={release.id}>
                                <CardHeader>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline">v{release.version}</Badge>
                                        <Badge variant="secondary">{release.release_type}</Badge>
                                        {release.published_at && (
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <CalendarDays className="size-3.5" />
                                                {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(release.published_at))}
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg">{release.title}</CardTitle>
                                    <CardDescription>{release.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {release.release_notes && (
                                        <p className="text-sm leading-6 whitespace-pre-line">{release.release_notes}</p>
                                    )}
                                    <ReleaseSection title="Features" items={release.features} icon={Sparkles} />
                                    <ReleaseSection title="Improvements" items={release.improvements} icon={CheckCircle2} />
                                    <ReleaseSection title="Bug fixes" items={release.bug_fixes} icon={Wrench} />
                                    <ReleaseSection title="Security notes" items={release.security_notes} icon={ShieldAlert} />
                                    <ReleaseSection title="Known issues" items={release.known_issues} icon={CalendarDays} />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}

Changelog.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: "What's New", href: '/releases/changelog' },
    ] satisfies BreadcrumbItem[],
};

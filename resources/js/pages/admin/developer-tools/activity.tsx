
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DevToolsShell, Panel, Notice } from './_shared';

type Log = {
    id: number;
    integration: string;
    environment: string;
    operation: string;
    http_status: number | null;
    result: string;
    duration_ms: number | null;
    safe_message: string | null;
    created_at: string | null;
};

type Props = {
    activeEnvironment: string;
    logs: {
        data: Log[];
        links?: unknown[];
    };
};

function ActivityTimestamp({ value }: { value: string | null }) {
    const [formatted, setFormatted] = useState<string>('—');

    useEffect(() => {
        if (!value) {
            setFormatted('—');
            return;
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            setFormatted(value);
            return;
        }

        setFormatted(
            date.toLocaleString('en-GB', {
                timeZone: 'Africa/Nairobi',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }),
        );
    }, [value]);

    return <span>{formatted}</span>;
}

export default function ActivityPage({
    activeEnvironment,
    logs,
}: Props) {
    return (
        <DevToolsShell
            title="API activity history"
            description="Review integration test and gateway outcomes without exposing credentials, bearer tokens or clinical payloads."
            environment={activeEnvironment}
        >
            <Panel
                title="Recent requests"
                description="Activity is retained as safe metadata for troubleshooting and audit review."
            >
                {logs.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No API activity recorded.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead>
                                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="px-3 py-3">Time</th>
                                    <th className="px-3 py-3">Provider</th>
                                    <th className="px-3 py-3">Environment</th>
                                    <th className="px-3 py-3">Operation</th>
                                    <th className="px-3 py-3">HTTP</th>
                                    <th className="px-3 py-3">Outcome</th>
                                    <th className="px-3 py-3">Duration</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.data.map(log => (
                                    <tr
                                        key={log.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <ActivityTimestamp
                                                value={log.created_at}
                                            />
                                        </td>

                                        <td className="px-3 py-3">
                                            {log.integration}
                                        </td>

                                        <td className="px-3 py-3">
                                            {log.environment.toUpperCase()}
                                        </td>

                                        <td className="px-3 py-3 font-mono text-xs">
                                            {log.operation}
                                        </td>

                                        <td className="px-3 py-3">
                                            {log.http_status ?? '—'}
                                        </td>

                                        <td className="px-3 py-3">
                                            {log.result}

                                            {log.safe_message && (
                                                <p className="max-w-xs text-xs text-muted-foreground">
                                                    {log.safe_message}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-3 py-3">
                                            {log.duration_ms === null
                                                ? '—'
                                                : `${log.duration_ms} ms`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <Notice>
                <Activity className="mr-2 inline size-4" />
                For privacy and security, this page intentionally does not store
                or render full provider response bodies. Use the testing console
                only for documented read-only endpoints and synthetic test values.
            </Notice>
        </DevToolsShell>
    );
}

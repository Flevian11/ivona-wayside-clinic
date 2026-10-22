import { Head, useForm, usePage } from '@inertiajs/react';
import { Clock3, Save, Settings2 } from 'lucide-react';
import { AdminPage, AdminPanel, Field, inputClass, primaryButton } from './_shared';

type Configuration = { timezone: string; locale: string; currency: string; date_format: string; time_format: string };
type Props = { configuration: Configuration; timezones: string[] };
type AuthProps = { auth?: { permissions?: string[] } };

export default function SystemConfigurationPage({ configuration, timezones }: Props) {
    const { auth } = usePage().props as AuthProps;
    const canManage = (auth?.permissions ?? []).includes('settings.manage');
    const form = useForm({
        timezone: configuration.timezone ?? 'Africa/Nairobi', locale: configuration.locale ?? 'en',
        currency: configuration.currency ?? 'KES', date_format: configuration.date_format ?? 'd M Y',
        time_format: configuration.time_format ?? 'H:i',
    });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/administration/system-configuration', { preserveScroll: true }); };

    return <>
        <Head title="System configuration · Administration" />
        <AdminPage title="System configuration" description="Configure the system-wide regional defaults used for dates, times, currency, and locale.">
            <form onSubmit={submit} className="space-y-5">
                <AdminPanel title="Regional defaults" description="These settings are stored in the existing system.general record. They do not change server environment variables or database credentials.">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <Field label="System timezone" error={form.errors.timezone}>
                            <select className={inputClass} value={form.data.timezone} onChange={event => form.setData('timezone', event.target.value)} disabled={!canManage}>
                                {timezones.map(timezone => <option key={timezone} value={timezone}>{timezone}</option>)}
                            </select>
                        </Field>
                        <Field label="Locale" error={form.errors.locale}>
                            <input className={inputClass} value={form.data.locale} onChange={event => form.setData('locale', event.target.value)} placeholder="en or en-KE" disabled={!canManage} />
                        </Field>
                        <Field label="Currency code" error={form.errors.currency}>
                            <input className={inputClass} value={form.data.currency} onChange={event => form.setData('currency', event.target.value.toUpperCase())} maxLength={3} placeholder="KES" disabled={!canManage} />
                        </Field>
                        <Field label="Date format" error={form.errors.date_format}>
                            <select className={inputClass} value={form.data.date_format} onChange={event => form.setData('date_format', event.target.value)} disabled={!canManage}>
                                <option value="d M Y">22 Oct 2026</option><option value="d/m/Y">22/10/2026</option><option value="Y-m-d">2026-10-22</option><option value="m/d/Y">10/22/2026</option><option value="d F Y">22 October 2026</option>
                            </select>
                        </Field>
                        <Field label="Time format" error={form.errors.time_format}>
                            <select className={inputClass} value={form.data.time_format} onChange={event => form.setData('time_format', event.target.value)} disabled={!canManage}>
                                <option value="H:i">24-hour (14:30)</option><option value="H:i:s">24-hour with seconds (14:30:00)</option><option value="h:i A">12-hour (02:30 PM)</option>
                            </select>
                        </Field>
                    </div>
                </AdminPanel>
                <AdminPanel title="Configuration boundaries" description="Security-sensitive deployment settings remain managed outside this screen.">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex gap-3 rounded-lg border p-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock3 className="size-4" /></span><div><p className="text-sm font-medium">Regional display defaults</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Timezone, locale, currency, and format preferences are stored in the database and audited when saved.</p></div></div>
                        <div className="flex gap-3 rounded-lg border p-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Settings2 className="size-4" /></span><div><p className="text-sm font-medium">Deployment configuration</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Application keys, database connections, mail credentials, and external API secrets are intentionally not editable here.</p></div></div>
                    </div>
                </AdminPanel>
                {canManage && <div className="flex justify-end"><button className={primaryButton} disabled={form.processing}><Save className="size-4" />{form.processing ? 'Saving…' : 'Save system configuration'}</button></div>}
                {!canManage && <p className="text-sm text-muted-foreground">You have read-only access. Contact an administrator with system-settings permission to make changes.</p>}
                {form.hasErrors && <p className="text-sm text-destructive">Some fields need attention. Review the validation messages above.</p>}
            </form>
        </AdminPage>
    </>;
}

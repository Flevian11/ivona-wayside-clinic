import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { AdminPage, AdminPanel, Field, inputClass, primaryButton } from './_shared';

type Identity = {
    name: string; tagline: string; description: string; url: string; phone: string; email: string;
    address: string; opening_hours: string; logo_url: string | null; favicon_url: string | null;
    social_links: Record<string, string | null>; public_links: Record<string, string | null>;
};
type Props = { identity: Identity };
type AuthProps = { auth?: { permissions?: string[] } };

export default function FacilitySettingsPage({ identity }: Props) {
    const { auth } = usePage().props as AuthProps;
    const canManage = (auth?.permissions ?? []).includes('settings.manage');
    const form = useForm({
        name: identity.name ?? '', tagline: identity.tagline ?? '', description: identity.description ?? '',
        url: identity.url ?? '', phone: identity.phone ?? '', email: identity.email ?? '', address: identity.address ?? '',
        opening_hours: identity.opening_hours ?? '', logo_url: identity.logo_url ?? '', favicon_url: identity.favicon_url ?? '',
        social_links: {
            whatsapp: identity.social_links?.whatsapp ?? '', facebook: identity.social_links?.facebook ?? '',
            instagram: identity.social_links?.instagram ?? '', linkedin: identity.social_links?.linkedin ?? '',
            youtube: identity.social_links?.youtube ?? '', x: identity.social_links?.x ?? '',
        },
        public_links: {
            contact: identity.public_links?.contact ?? '/contact', directions: identity.public_links?.directions ?? '',
            appointments: identity.public_links?.appointments ?? '', website: identity.public_links?.website ?? identity.url ?? '',
            whatsapp: identity.public_links?.whatsapp ?? '', google_maps: identity.public_links?.google_maps ?? '',
        },
    });
    const field = (key: 'name' | 'tagline' | 'description' | 'url' | 'phone' | 'email' | 'address' | 'opening_hours' | 'logo_url' | 'favicon_url', label: string, type = 'text') => (
        <Field key={key} label={label} error={form.errors[key]}>
            {key === 'description' || key === 'address' ? <textarea className={`${inputClass} min-h-24`} value={form.data[key]} onChange={event => form.setData(key, event.target.value)} disabled={!canManage} /> :
                <input className={inputClass} type={type} value={form.data[key]} onChange={event => form.setData(key, event.target.value)} disabled={!canManage} />}
        </Field>
    );
    const socialField = (key: keyof typeof form.data.social_links, label: string) => (
        <Field key={key} label={label} error={(form.errors as Record<string, string>)[`social_links.${key}`]}>
            <input className={inputClass} type="url" placeholder="https://" value={form.data.social_links[key] ?? ''} onChange={event => form.setData(data => ({ ...data, social_links: { ...data.social_links, [key]: event.target.value } }))} disabled={!canManage} />
        </Field>
    );
    const publicLinkField = (key: keyof typeof form.data.public_links, label: string, type: 'url' | 'text' = 'url') => (
        <Field key={key} label={label} error={(form.errors as Record<string, string>)[`public_links.${key}`]}>
            <input className={inputClass} type={type} value={form.data.public_links[key] ?? ''} onChange={event => form.setData(data => ({ ...data, public_links: { ...data.public_links, [key]: event.target.value } }))} disabled={!canManage} />
        </Field>
    );
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/administration/facility-settings', { preserveScroll: true }); };

    return <>
        <Head title="Facility settings · Administration" />
        <AdminPage title="Facility settings" description="Maintain the clinic identity and public contact details used across the website and staff workspace.">
            <form onSubmit={submit} className="space-y-5">
                <AdminPanel title="Facility identity" description="These values feed the shared public site identity. Changes are saved to the existing system settings record.">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {field('name', 'Facility / clinic name')}
                        {field('tagline', 'Tagline')}
                        {field('url', 'Website URL', 'url')}
                        {field('description', 'Public description')}
                        {field('logo_url', 'Logo URL', 'url')}
                        {field('favicon_url', 'Favicon URL', 'url')}
                    </div>
                </AdminPanel>
                <AdminPanel title="Contact & visiting information" description="Keep the public contact details current and consistent.">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {field('phone', 'Main telephone', 'tel')}
                        {field('email', 'Public email address', 'email')}
                        {field('opening_hours', 'Opening hours')}
                        <div className="sm:col-span-2 xl:col-span-3">{field('address', 'Physical address')}</div>
                    </div>
                </AdminPanel>
                <AdminPanel title="Social profiles" description="Leave a field blank when the clinic does not use that platform.">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {socialField('whatsapp', 'WhatsApp URL')}{socialField('facebook', 'Facebook URL')}{socialField('instagram', 'Instagram URL')}{socialField('linkedin', 'LinkedIn URL')}{socialField('youtube', 'YouTube URL')}{socialField('x', 'X profile URL')}
                    </div>
                </AdminPanel>
                <AdminPanel title="Public links" description="Configure the destinations used by public contact and call-to-action links.">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {publicLinkField('contact', 'Contact page path', 'text')}{publicLinkField('website', 'Website URL')}{publicLinkField('whatsapp', 'WhatsApp contact URL')}{publicLinkField('directions', 'Directions URL')}{publicLinkField('appointments', 'Appointments URL')}{publicLinkField('google_maps', 'Google Maps URL')}
                    </div>
                </AdminPanel>
                {canManage && <div className="flex justify-end"><button className={primaryButton} disabled={form.processing}><Save className="size-4" />{form.processing ? 'Saving…' : 'Save facility settings'}</button></div>}
                {!canManage && <p className="text-sm text-muted-foreground">You have read-only access. Contact an administrator with system-settings permission to make changes.</p>}
                {form.hasErrors && <p className="text-sm text-destructive">Some fields need attention. Review the validation messages above.</p>}
            </form>
        </AdminPage>
    </>;
}

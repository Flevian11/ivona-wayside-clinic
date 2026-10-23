import { Head, useForm, usePage } from '@inertiajs/react';
import { ImagePlus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminPage, AdminPanel, Field, inputClass, primaryButton } from './_shared';

type Identity = {
    name: string; tagline: string; description: string; url: string; phone: string; email: string;
    address: string; opening_hours: string; logo_url: string | null; favicon_url: string | null;
    social_links: Record<string, string | null>; public_links: Record<string, string | null>;
};
type Props = { identity: Identity };
type AuthProps = { auth?: { permissions?: string[] } };

const secondaryButton = 'inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50';

function BrandUpload({
    label,
    description,
    currentUrl,
    file,
    error,
    accept,
    preview,
    onChange,
    onRemove,
    onSubmit,
    processing,
    disabled,
}: {
    label: string;
    description: string;
    currentUrl: string | null;
    file: File | null;
    error?: string;
    accept: string;
    preview: string | null;
    onChange: (file: File | null) => void;
    onRemove: () => void;
    onSubmit: () => void;
    processing: boolean;
    disabled: boolean;
}) {
    const shownImage = preview || currentUrl;

    return (
        <Field label={label} error={error}>
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/50 p-2">
                    {shownImage ? (
                        <img src={shownImage} alt={`${label} preview`} className="max-h-full max-w-full object-contain" />
                    ) : (
                        <ImagePlus className="size-8 text-muted-foreground" aria-hidden="true" />
                    )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <input
                        type="file"
                        accept={accept}
                        disabled={disabled}
                        onChange={event => onChange(event.target.files?.[0] ?? null)}
                        className="block w-full cursor-pointer text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:font-medium file:text-primary hover:file:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {file && <p className="break-all text-xs text-muted-foreground">Selected: {file.name}</p>}
                    {currentUrl && !file && <p className="text-xs text-muted-foreground">Current image is in use.</p>}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {shownImage && !disabled && (
                            <button type="button" className={secondaryButton} onClick={onRemove}>
                                <Trash2 className="size-4" /> Remove image
                            </button>
                        )}
                        { !disabled && <button type="button" className={primaryButton} disabled={processing} onClick={onSubmit}><Save className="size-4" />{processing ? 'Saving…' : `Save ${label.toLowerCase()}`}</button> }
                    </div>
                </div>
            </div>
        </Field>
    );
}

export default function FacilitySettingsPage({ identity }: Props) {
    const { auth } = usePage().props as AuthProps;
    const canManage = (auth?.permissions ?? []).includes('settings.manage');
    const form = useForm({
        name: identity.name ?? '', tagline: identity.tagline ?? '', description: identity.description ?? '',
        url: identity.url ?? '', phone: identity.phone ?? '', email: identity.email ?? '', address: identity.address ?? '',
        opening_hours: identity.opening_hours ?? '',
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
    const logoForm = useForm({ logo_file: null as File | null, remove_logo: false });
    const faviconForm = useForm({ favicon_file: null as File | null, remove_favicon: false });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!logoForm.data.logo_file) { setLogoPreview(null); return; }
        const url = URL.createObjectURL(logoForm.data.logo_file);
        setLogoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [logoForm.data.logo_file]);

    useEffect(() => {
        if (!faviconForm.data.favicon_file) { setFaviconPreview(null); return; }
        const url = URL.createObjectURL(faviconForm.data.favicon_file);
        setFaviconPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [faviconForm.data.favicon_file]);

    const field = (key: 'name' | 'tagline' | 'description' | 'url' | 'phone' | 'email' | 'address' | 'opening_hours', label: string, type = 'text') => (
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
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.put('/admin/administration/facility-settings', { preserveScroll: true, forceFormData: true });
    };

    return <>
        <Head title="Facility settings · Administration" />
        <AdminPage title="Facility settings" description="Manage the clinic identity, brand assets, and public contact details used throughout the website and staff workspace.">
            <form onSubmit={submit} className="space-y-5">
                <AdminPanel title="Facility identity" description="These details are shared across the public website and staff workspace.">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {field('name', 'Facility / clinic name')}
                        {field('tagline', 'Tagline')}
                        {field('url', 'Website URL', 'url')}
                        {field('description', 'Public description')}
                    </div>
                </AdminPanel>
                <AdminPanel title="Clinic branding" description="Upload image files directly. External logo and icon URLs are no longer required.">
                    <div className="grid gap-5 xl:grid-cols-2">
                        <BrandUpload
                            label="Clinic logo"
                            description="PNG, JPG, or WebP · maximum 4 MB. A transparent PNG works best for the clinic logo."
                            currentUrl={logoForm.data.remove_logo ? null : identity.logo_url}
                            file={logoForm.data.logo_file}
                            error={logoForm.errors.logo_file}
                            accept="image/png,image/jpeg,image/webp"
                            preview={logoPreview}
                            disabled={!canManage}
                            processing={logoForm.processing}
                            onChange={file => logoForm.setData(data => ({ ...data, logo_file: file, remove_logo: false }))}
                            onRemove={() => { logoForm.setData(data => ({ ...data, logo_file: null, remove_logo: true })); setLogoPreview(null); }}
                            onSubmit={() => logoForm.post('/admin/administration/facility-settings/logo', { preserveScroll: true, forceFormData: true, onSuccess: () => { logoForm.setData({ logo_file: null, remove_logo: false }); setLogoPreview(null); } })}
                        />
                        <BrandUpload
                            label="Site icon / favicon"
                            description="Square PNG, JPG, or WebP · maximum 2 MB. Use a square image for the browser tab icon."
                            currentUrl={faviconForm.data.remove_favicon ? null : identity.favicon_url}
                            file={faviconForm.data.favicon_file}
                            error={faviconForm.errors.favicon_file}
                            accept="image/png,image/jpeg,image/webp"
                            preview={faviconPreview}
                            disabled={!canManage}
                            processing={faviconForm.processing}
                            onChange={file => faviconForm.setData(data => ({ ...data, favicon_file: file, remove_favicon: false }))}
                            onRemove={() => { faviconForm.setData(data => ({ ...data, favicon_file: null, remove_favicon: true })); setFaviconPreview(null); }}
                            onSubmit={() => faviconForm.post('/admin/administration/facility-settings/favicon', { preserveScroll: true, forceFormData: true, onSuccess: () => { faviconForm.setData({ favicon_file: null, remove_favicon: false }); setFaviconPreview(null); } })}
                        />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Images are validated and stored on the configured public storage disk. The current logo or icon remains unchanged when no replacement is selected.</p>
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

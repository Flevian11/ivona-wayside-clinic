import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    Clock,
    Globe,
    Image as ImageIcon,
    Link2,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    Save,
    Share2,
    Upload,
    X,
} from 'lucide-react';
import { AdminPage, AdminPanel, Field, inputClass, primaryButton } from './_shared';

type Identity = {
    name: string;
    tagline: string;
    description: string;
    url: string;
    phone: string;
    email: string;
    address: string;
    opening_hours: string;
    logo_url: string | null;
    favicon_url: string | null;
    social_links: Record<string, string | null>;
    public_links: Record<string, string | null>;
};

type Props = { identity: Identity };
type AuthProps = { auth?: { permissions?: string[] } };

const socialKeys = ['whatsapp', 'facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const;

const publicLinkKeys = [
    'contact',
    'directions',
    'appointments',
    'website',
    'whatsapp',
    'google_maps',
] as const;

const socialMeta: Record<typeof socialKeys[number], { label: string; placeholder: string }> = {
    whatsapp: { label: 'WhatsApp', placeholder: 'https://wa.me/…' },
    facebook: { label: 'Facebook', placeholder: 'https://facebook.com/…' },
    instagram: { label: 'Instagram', placeholder: 'https://instagram.com/…' },
    linkedin: { label: 'LinkedIn', placeholder: 'https://linkedin.com/…' },
    youtube: { label: 'YouTube', placeholder: 'https://youtube.com/…' },
    x: { label: 'X', placeholder: 'https://x.com/…' },
};

const publicLinkMeta: Record<typeof publicLinkKeys[number], { label: string; placeholder: string; type: string }> = {
    contact: { label: 'Contact page path', placeholder: '/contact', type: 'text' },
    website: { label: 'Website URL', placeholder: 'https://', type: 'url' },
    whatsapp: { label: 'WhatsApp contact URL', placeholder: 'https://wa.me/…', type: 'url' },
    directions: { label: 'Directions URL', placeholder: 'https://', type: 'url' },
    appointments: { label: 'Appointments URL', placeholder: 'https://', type: 'url' },
    google_maps: { label: 'Google Maps URL', placeholder: 'https://', type: 'url' },
};

export default function FacilitySettingsPage({ identity }: Props) {
    const { auth } = usePage().props as AuthProps;
    const canManage = (auth?.permissions ?? []).includes('settings.manage');

    const identityForm = useForm({
        name: identity.name ?? '',
        tagline: identity.tagline ?? '',
        description: identity.description ?? '',
        url: identity.url ?? '',
    });

    const contactForm = useForm({
        phone: identity.phone ?? '',
        email: identity.email ?? '',
        address: identity.address ?? '',
        opening_hours: identity.opening_hours ?? '',
    });

    const socialForm = useForm({
        social_links: Object.fromEntries(
            socialKeys.map(key => [key, identity.social_links?.[key] ?? '']),
        ) as Record<typeof socialKeys[number], string>,
    });

    const linksForm = useForm({
        public_links: {
            contact: identity.public_links?.contact ?? '/contact',
            directions: identity.public_links?.directions ?? '',
            appointments: identity.public_links?.appointments ?? '',
            website: identity.public_links?.website ?? identity.url ?? '',
            whatsapp: identity.public_links?.whatsapp ?? '',
            google_maps: identity.public_links?.google_maps ?? '',
        },
    });

    const logoForm = useForm<{
        logo_file: File | null;
        remove_logo: boolean;
    }>({
        logo_file: null,
        remove_logo: false,
    });

    // Live preview URL for the currently selected file (logo + favicon share one asset)
    const logoPreview = useMemo(() => {
        if (logoForm.data.logo_file) return URL.createObjectURL(logoForm.data.logo_file);
        return identity.logo_url ?? null;
    }, [logoForm.data.logo_file, identity.logo_url]);

    const submit = (form: any, endpoint: string) => (event: React.FormEvent) => {
        event.preventDefault();
        form.put(endpoint, { preserveScroll: true });
    };

    const field = (
        label: string,
        value: string,
        onChange: (value: string) => void,
        error?: string,
        type = 'text',
        multiline = false,
    ) => (
        <Field label={label} error={error}>
            {multiline ? (
                <textarea
                    className={`${inputClass} min-h-24`}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    disabled={!canManage}
                />
            ) : (
                <input
                    className={inputClass}
                    type={type}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    disabled={!canManage}
                />
            )}
        </Field>
    );

    const sectionSave = (processing: boolean, label = 'Save changes') => (
        <button
            className={primaryButton}
            type="submit"
            disabled={!canManage || processing}
            aria-busy={processing}
        >
            {processing ? (
                <LoaderCircle className="size-4 animate-spin" />
            ) : (
                <Save className="size-4" />
            )}
            <span>{processing ? 'Saving…' : label}</span>
        </button>
    );

    const submitLogo = (remove = false) => {
        if (remove) {
            logoForm.setData({ logo_file: null, remove_logo: true });
        } else {
            logoForm.setData('remove_logo', false);
        }

        logoForm.transform(data => ({ ...data, _method: 'put' }));

        logoForm.post('/admin/administration/facility-settings/logo', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const hasAnyErrors =
        identityForm.hasErrors ||
        contactForm.hasErrors ||
        socialForm.hasErrors ||
        linksForm.hasErrors ||
        logoForm.hasErrors;

    // Public link live preview state (derived from form data)
    const previewLinks = linksForm.data.public_links;

    return (
        <>
            <Head title="Facility settings · Administration" />

            <AdminPage
                title="Facility settings"
                description="Manage the clinic identity, contact information, branding and public links. Each section saves independently."
            >
                {/* Facility identity */}
                <form onSubmit={submit(identityForm, '/admin/administration/facility-settings/identity')}>
                    <AdminPanel
                        title="Facility identity"
                        description="Clinic name and public-facing description."
                        action={canManage && sectionSave(identityForm.processing)}
                    >
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {field(
                                'Facility / clinic name',
                                identityForm.data.name,
                                value => identityForm.setData('name', value),
                                identityForm.errors.name,
                            )}

                            {field(
                                'Tagline',
                                identityForm.data.tagline,
                                value => identityForm.setData('tagline', value),
                                identityForm.errors.tagline,
                            )}

                            {field(
                                'Website URL',
                                identityForm.data.url,
                                value => identityForm.setData('url', value),
                                identityForm.errors.url,
                                'url',
                            )}

                            <div className="sm:col-span-2 xl:col-span-3">
                                {field(
                                    'Public description',
                                    identityForm.data.description,
                                    value => identityForm.setData('description', value),
                                    identityForm.errors.description,
                                    'text',
                                    true,
                                )}
                            </div>
                        </div>
                    </AdminPanel>
                </form>

                {/* Contact details */}
                <form onSubmit={submit(contactForm, '/admin/administration/facility-settings/contact')}>
                    <AdminPanel
                        title="Contact & visiting information"
                        description="Main telephone, public email and clinic visiting details."
                        action={canManage && sectionSave(contactForm.processing)}
                    >
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {field(
                                'Main telephone',
                                contactForm.data.phone,
                                value => contactForm.setData('phone', value),
                                contactForm.errors.phone,
                                'tel',
                            )}

                            {field(
                                'Public email address',
                                contactForm.data.email,
                                value => contactForm.setData('email', value),
                                contactForm.errors.email,
                                'email',
                            )}

                            {field(
                                'Opening hours',
                                contactForm.data.opening_hours,
                                value => contactForm.setData('opening_hours', value),
                                contactForm.errors.opening_hours,
                            )}

                            <div className="sm:col-span-2 xl:col-span-3">
                                {field(
                                    'Physical address',
                                    contactForm.data.address,
                                    value => contactForm.setData('address', value),
                                    contactForm.errors.address,
                                    'text',
                                    true,
                                )}
                            </div>
                        </div>
                    </AdminPanel>
                </form>

                {/* Social profiles */}
                <form onSubmit={submit(socialForm, '/admin/administration/facility-settings/social-links')}>
                    <AdminPanel
                        title="Social profiles"
                        description="Leave a field blank when the clinic does not use that platform."
                        action={canManage && sectionSave(socialForm.processing)}
                    >
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {socialKeys.map(key => {
                                const value = socialForm.data.social_links[key];
                                const meta = socialMeta[key];
                                return (
                                    <Field
                                        key={key}
                                        label={meta.label}
                                        error={(socialForm.errors as Record<string, string>)[`social_links.${key}`]}
                                    >
                                        <div className="relative">
                                            <Share2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                className={`${inputClass} pl-9`}
                                                type="url"
                                                placeholder={meta.placeholder}
                                                value={value}
                                                onChange={event =>
                                                    socialForm.setData(data => ({
                                                        ...data,
                                                        social_links: {
                                                            ...data.social_links,
                                                            [key]: event.target.value,
                                                        },
                                                    }))
                                                }
                                                disabled={!canManage}
                                            />
                                            {value && (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                                                    title="Open link"
                                                >
                                                    <Link2 className="size-4" />
                                                </a>
                                            )}
                                        </div>
                                    </Field>
                                );
                            })}
                        </div>
                    </AdminPanel>
                </form>

                {/* Public links */}
                <form onSubmit={submit(linksForm, '/admin/administration/facility-settings/public-links')}>
                    <AdminPanel
                        title="Public links"
                        description="Destinations used by public contact and call-to-action links."
                        action={canManage && sectionSave(linksForm.processing)}
                    >
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {publicLinkKeys.map(key => {
                                    const meta = publicLinkMeta[key];
                                    const value = linksForm.data.public_links[key];
                                    return (
                                        <Field
                                            key={key}
                                            label={meta.label}
                                            error={(linksForm.errors as Record<string, string>)[`public_links.${key}`]}
                                        >
                                            <div className="relative">
                                                <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                <input
                                                    className={`${inputClass} pl-9`}
                                                    type={meta.type}
                                                    placeholder={meta.placeholder}
                                                    value={value}
                                                    onChange={event =>
                                                        linksForm.setData(data => ({
                                                            ...data,
                                                            public_links: {
                                                                ...data.public_links,
                                                                [key]: event.target.value,
                                                            },
                                                        }))
                                                    }
                                                    disabled={!canManage}
                                                />
                                            </div>
                                        </Field>
                                    );
                                })}
                            </div>

                            {/* Live preview of public links */}
                            <div className="rounded-xl border border-border bg-muted/20 p-3">
                                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <Globe className="size-3.5" /> Live preview
                                </p>
                                <ul className="space-y-1.5 text-xs">
                                    {publicLinkKeys.map(key => {
                                        const value = previewLinks[key]?.trim();
                                        const meta = publicLinkMeta[key];
                                        return (
                                            <li
                                                key={key}
                                                className="flex items-center justify-between gap-2 rounded-md bg-background/60 px-2 py-1.5"
                                            >
                                                <span className="truncate text-muted-foreground">
                                                    {meta.label.replace(' URL', '').replace(' path', '')}
                                                </span>
                                                {value ? (
                                                    <a
                                                        href={value}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 truncate font-medium text-primary hover:underline"
                                                        title={value}
                                                    >
                                                        <Link2 className="size-3 shrink-0" />
                                                        <span className="truncate max-w-[140px]">{value}</span>
                                                    </a>
                                                ) : (
                                                    <span className="italic text-muted-foreground/60">Not set</span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </AdminPanel>
                </form>

                {/* Logo and favicon with live preview */}
                <form
                    onSubmit={event => {
                        event.preventDefault();
                        submitLogo(false);
                    }}
                >
                    <AdminPanel
                        title="Clinic logo & favicon"
                        description="Upload one image. It is used for the clinic logo and site favicon across the system."
                        action={
                            canManage && (
                                <button
                                    className={primaryButton}
                                    type="submit"
                                    disabled={
                                        !canManage ||
                                        logoForm.processing ||
                                        (!logoForm.data.logo_file && !identity.logo_url)
                                    }
                                    aria-busy={logoForm.processing}
                                >
                                    {logoForm.processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <Upload className="size-4" />
                                    )}
                                    <span>{logoForm.processing ? 'Uploading…' : 'Upload branding'}</span>
                                </button>
                            )
                        }
                    >
                        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_240px] sm:items-start">
                            <div className="space-y-3">
                                <Field label="Upload clinic logo" error={logoForm.errors.logo_file}>
                                    <input
                                        className={inputClass}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={event => {
                                            logoForm.setData({
                                                logo_file: event.target.files?.[0] ?? null,
                                                remove_logo: false,
                                            });
                                        }}
                                        disabled={!canManage || logoForm.processing}
                                    />
                                </Field>

                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG or WebP · up to 4 MB. A transparent PNG is recommended.
                                    This upload also updates the favicon.
                                </p>

                                {identity.logo_url && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 text-sm text-destructive hover:underline"
                                        disabled={!canManage || logoForm.processing}
                                        onClick={() => submitLogo(true)}
                                    >
                                        {logoForm.processing ? (
                                            <LoaderCircle className="size-4 animate-spin" />
                                        ) : (
                                            <X className="size-4" />
                                        )}
                                        {logoForm.processing
                                            ? 'Removing…'
                                            : 'Remove current logo and favicon'}
                                    </button>
                                )}
                            </div>

                            {/* Live preview panel: logo + favicon */}
                            <div className="rounded-xl border border-border bg-muted/20 p-3">
                                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <ImageIcon className="size-3.5" /> Live preview
                                    {logoForm.data.logo_file && (
                                        <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                            new
                                        </span>
                                    )}
                                </p>

                                {logoPreview ? (
                                    <div className="space-y-3">
                                        <div className="grid place-items-center rounded-lg border border-dashed border-border bg-background/60 p-3">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="max-h-24 w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2">
                                            <div className="grid size-8 place-items-center overflow-hidden rounded-md border border-border bg-background">
                                                <img
                                                    src={logoPreview}
                                                    alt="Favicon preview"
                                                    className="size-6 object-contain"
                                                />
                                            </div>
                                            <div className="min-w-0 text-[11px] leading-tight">
                                                <p className="font-medium text-foreground">Favicon</p>
                                                <p className="truncate text-muted-foreground">
                                                    Tab icon preview
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid min-h-24 place-items-center text-sm text-muted-foreground">
                                        <div className="flex flex-col items-center">
                                            <Upload className="mb-1 size-5" />
                                            No logo uploaded
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </AdminPanel>
                </form>

                {!canManage && (
                    <p className="text-sm text-muted-foreground">
                        You have read-only access. Contact an administrator with system-settings permission to make changes.
                    </p>
                )}

                {hasAnyErrors && (
                    <p className="text-sm text-destructive">
                        Some fields need attention. Review the validation messages in the relevant section.
                    </p>
                )}
            </AdminPage>
        </>
    );
}
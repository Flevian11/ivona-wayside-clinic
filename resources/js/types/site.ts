export type SiteIdentity = {
    name: string;
    tagline: string;
    description: string;
    url: string | null;
    logo_url: string | null;
    favicon_url: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    opening_hours: string | null;
    social_links: Record<string, string | null> | string[];
    public_links: Record<string, string | null> & {
        contact?: string | null;
        directions?: string | null;
        appointments?: string | null;
        website?: string | null;
        whatsapp?: string | null;
        google_maps?: string | null;
    };
    updated_at: string | null;
};

export type SharedData = {
    name: string;
    site: SiteIdentity;
    auth: { user: import('./auth').User | null };
    sidebarOpen: boolean;
    [key: string]: unknown;
};

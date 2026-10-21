import { Head, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import SiteFooter from '@/components/public/site-footer';
import SiteHeader from '@/components/public/site-header';
import type { SharedData } from '@/types';

type PublicLayoutProps = PropsWithChildren<{
    title?: string;
    description?: string;
    image?: string | null;
    canonical?: string;
}>;

export default function PublicLayout({ children, title, description, image, canonical }: PublicLayoutProps) {
    const pageProps = usePage<SharedData & { pageTitle?: string; pageDescription?: string }>().props;
    const { site } = pageProps;
    const pageTitle = title || pageProps.pageTitle || site.name;
    const pageDescription = description || pageProps.pageDescription || site.description;
    const shareImage = image || site.logo_url || undefined;

    return (
        <div className="iwc-public-site flex min-h-screen flex-col bg-background text-foreground">
            <Head title={`${pageTitle} | ${site.name}`}>
                <meta head-key="description" name="description" content={pageDescription} />
                <meta head-key="robots" name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
                <meta head-key="og-title" property="og:title" content={`${pageTitle} | ${site.name}`} />
                <meta head-key="og-description" property="og:description" content={pageDescription} />
                <meta head-key="og:type" property="og:type" content="website" />
                <meta head-key="og:site-name" property="og:site_name" content={site.name} />
                {shareImage && <meta head-key="og-image" property="og:image" content={shareImage} />}
                <meta head-key="twitter-card" name="twitter:card" content="summary_large_image" />
                <meta head-key="twitter-title" name="twitter:title" content={`${pageTitle} | ${site.name}`} />
                <meta head-key="twitter-description" name="twitter:description" content={pageDescription} />
                {canonical && <link head-key="canonical" rel="canonical" href={canonical} />}
            </Head>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}

<!DOCTYPE html>
@php
    $site = data_get($page, 'props.site', []);
    $siteName = data_get($site, 'name', config('app.name', 'Hospital'));
    $siteDescription = data_get($site, 'description', 'Hospital information and healthcare services.');
    $pageTitle = data_get($page, 'props.pageTitle', $siteName);
    $pageDescription = data_get($page, 'props.pageDescription', $siteDescription);
    $siteUrl = data_get($site, 'url', config('app.url'));
    $siteLogo = data_get($site, 'logo_url');
    $siteFavicon = data_get($site, 'favicon_url') ?: asset('favicon.svg');
    $brandVersion = data_get($site, 'updated_at');
    if ($brandVersion) {
        $siteFavicon .= (str_contains($siteFavicon, '?') ? '&' : '?').'v='.rawurlencode($brandVersion);
    }
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="application-name" content="{{ $siteName }}">
        <meta name="description" content="{{ $pageDescription }}">
        <meta name="theme-color" content="#18794e">
        <meta name="color-scheme" content="light dark">
        @if ($siteUrl)
            <link rel="canonical" href="{{ rtrim($siteUrl, '/') }}{{ request()->getPathInfo() === '/' ? '/' : request()->getPathInfo() }}">
        @endif
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $pageTitle }} | {{ $siteName }}">
        <meta property="og:description" content="{{ $pageDescription }}">
        @if ($siteUrl)
            <meta property="og:url" content="{{ rtrim($siteUrl, '/') }}{{ request()->getPathInfo() }}">
        @endif
        @if ($siteLogo)
            <meta property="og:image" content="{{ $siteLogo }}">
        @endif
        @php
            $structuredData = array_filter([
                '@context' => 'https://schema.org',
                '@type' => 'MedicalClinic',
                'name' => $siteName,
                'url' => $siteUrl,
                'description' => $pageDescription,
                'telephone' => data_get($site, 'phone'),
                'email' => data_get($site, 'email'),
                'address' => data_get($site, 'address') ? [
                    '@type' => 'PostalAddress',
                    'streetAddress' => data_get($site, 'address'),
                ] : null,
                'image' => $siteLogo,
            ], fn ($value) => $value !== null && $value !== '');
        @endphp
        <script type="application/ld+json">@json($structuredData)</script>
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $pageTitle }} | {{ $siteName }}">
        <meta name="twitter:description" content="{{ $pageDescription }}">
        <link rel="icon" href="{{ $siteFavicon }}">
        <link rel="apple-touch-icon" href="{{ data_get($site, 'apple_touch_icon_url') ?: asset('apple-touch-icon.png') }}">
        @if ($siteLogo)
            <link rel="preload" as="image" href="{{ $siteLogo }}">
        @endif

        <script>
            (function () {
                const appearance = @json($appearance ?? 'system');
                if (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        <style>
            html { background-color: oklch(0.99 0.012 155); }
            html.dark { background-color: oklch(0.17 0.025 160); }
        </style>
        @fonts
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $pageTitle }} | {{ $siteName }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>

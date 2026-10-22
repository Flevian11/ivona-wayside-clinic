<?php

namespace App\Http\Middleware;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Throwable;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'site' => fn () => $this->publicSiteData(),
            'siteIdentity' => fn () => $this->publicSiteData(),
            'auth' => [
                'user' => $request->user(),
                'roles' => fn () => $this->activeRoleSummaries($request),
                'permissions' => fn () => $this->activePermissions($request),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
    /**
     * Share only active role labels needed to personalize the authenticated workspace.
     *
     * @return array<int, array{name: string, slug: string}>
     */
    protected function activeRoleSummaries(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [];
        }

        return $user->roles()
            ->where('roles.is_active', true)
            ->get(['roles.id', 'roles.name', 'roles.slug'])
            ->map(fn ($role): array => [
                'name' => $role->name,
                'slug' => $role->slug,
            ])
            ->values()
            ->all();
    }

    /**
     * Share the effective permission names for UI navigation only.
     * Backend routes and policies remain the actual security boundary.
     *
     * @return array<int, string>
     */
    protected function activePermissions(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [];
        }

        return $user->roles()
            ->where('roles.is_active', true)
            ->with('permissions:id,name')
            ->get(['roles.id'])
            ->flatMap(fn ($role) => $role->permissions->pluck('name'))
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Return only explicitly public site settings for public layouts and SEO.
     * Missing settings or an unavailable settings table must never break rendering.
     *
     * @return array<string, mixed>
     */
    protected function publicSiteData(): array
    {
        $defaults = [
            'name' => config('app.name', 'Hospital'),
            'tagline' => 'Care, compassion, and better health.',
            'description' => 'Learn about our hospital, services, and healthcare team.',
            'url' => config('app.url'),
            'logo_url' => null,
            'favicon_url' => null,
            'phone' => null,
            'email' => null,
            'address' => null,
            'opening_hours' => null,
            'social_links' => [],
            'public_links' => [
                'contact' => '/contact',
                'directions' => null,
                'appointments' => null,
                'website' => config('app.url'),
                'whatsapp' => null,
                'google_maps' => null,
            ],
            'updated_at' => null,
        ];

        try {
            $setting = SystemSetting::query()
                ->where('key', 'site.identity')
                ->where('is_public', true)
                ->first();

            if (! $setting) {
                return $defaults;
            }

            $value = is_array($setting->value) ? $setting->value : [];
            $allowed = array_intersect_key($value, $defaults);

            return array_merge($defaults, $allowed, [
                'updated_at' => $setting->updated_at?->toISOString(),
            ]);
        } catch (Throwable) {
            return $defaults;
        }
    }

}

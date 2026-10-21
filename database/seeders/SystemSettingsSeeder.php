<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    /**
     * Seed clinic identity and confirmed public contact information.
     * Existing non-empty values remain authoritative; confirmed defaults only
     * fill missing or empty fields, so this seeder is safe to run repeatedly.
     */
    public function run(): void
    {
        $identityDefaults = [
            'name' => 'Ivona Wayside Clinic',
            'tagline' => 'Care, compassion, and better health.',
            'description' => 'Learn about Ivona Wayside Clinic, its services, and how to get in touch with the care team.',
            'url' => config('app.url'),
            'logo_url' => null,
            'favicon_url' => null,
            'phone' => '+254 721 215036',
            'email' => 'info@ivonawaysideclinic.co.ke',
            'address' => 'Ivona, Mautuma Lugari, Kakamega',
            'opening_hours' => 'Open 24 hours',
            'social_links' => [
                'whatsapp' => 'https://wa.me/254721215036',
                'facebook' => 'https://facebook.com/ivonawaysideclinic',
                'instagram' => null,
                'linkedin' => null,
                'youtube' => null,
                'x' => null,
            ],
            'public_links' => [
                'contact' => '/contact',
                'directions' => null,
                'appointments' => null,
                'website' => config('app.url'),
                'whatsapp' => 'https://wa.me/254721215036',
                'google_maps' => null,
            ],
        ];

        $identity = SystemSetting::query()->firstOrNew(['key' => 'site.identity']);
        $currentIdentity = is_array($identity->value) ? $identity->value : [];
        $identity->group = $identity->group ?: 'site';
        $identity->is_public = true;
        $identity->value = $this->fillMissingValues($identityDefaults, $currentIdentity);
        $identity->save();

        SystemSetting::query()->firstOrCreate(
            ['key' => 'system.general'],
            [
                'group' => 'system',
                'is_public' => false,
                'value' => [
                    'timezone' => 'Africa/Nairobi',
                    'locale' => 'en',
                    'currency' => 'KES',
                    'date_format' => 'd M Y',
                    'time_format' => 'H:i',
                ],
            ],
        );
    }

    /**
     * Recursively add missing defaults without overwriting existing non-empty values.
     * An existing null/empty field is considered unconfigured and may be filled.
     *
     * @param array<string, mixed> $defaults
     * @param array<string, mixed> $current
     * @return array<string, mixed>
     */
    private function fillMissingValues(array $defaults, array $current): array
    {
        foreach ($defaults as $key => $default) {
            if (is_array($default)) {
                $existing = isset($current[$key]) && is_array($current[$key]) ? $current[$key] : [];
                $current[$key] = $this->fillMissingValues($default, $existing);
                continue;
            }

            if (! array_key_exists($key, $current) || $current[$key] === null || (is_string($current[$key]) && trim($current[$key]) === '')) {
                $current[$key] = $default;
            }
        }

        return $current;
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemAuditLog;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClinicSettingsController extends Controller
{
    public function facility(): Response
    {
        return Inertia::render('admin/administration/facility-settings', [
            'identity' => $this->settingValue('site.identity', $this->facilityDefaults()),
        ]);
    }

    public function updateFacility(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'tagline' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:2000'],
            'url' => ['nullable', 'url', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'favicon_url' => ['nullable', 'url', 'max:2048'],
            'social_links' => ['nullable', 'array'],
            'social_links.whatsapp' => ['nullable', 'url', 'max:255'],
            'social_links.facebook' => ['nullable', 'url', 'max:255'],
            'social_links.instagram' => ['nullable', 'url', 'max:255'],
            'social_links.linkedin' => ['nullable', 'url', 'max:255'],
            'social_links.youtube' => ['nullable', 'url', 'max:255'],
            'social_links.x' => ['nullable', 'url', 'max:255'],
            'public_links' => ['nullable', 'array'],
            'public_links.contact' => ['nullable', 'string', 'max:255'],
            'public_links.directions' => ['nullable', 'url', 'max:2048'],
            'public_links.appointments' => ['nullable', 'url', 'max:2048'],
            'public_links.website' => ['nullable', 'url', 'max:255'],
            'public_links.whatsapp' => ['nullable', 'url', 'max:255'],
            'public_links.google_maps' => ['nullable', 'url', 'max:2048'],
        ]);

        $this->saveSetting($request, 'site.identity', 'site', true, $data, 'settings.facility.updated');

        return back()->with('success', 'Facility identity and contact information saved.');
    }

    public function system(): Response
    {
        $timezones = \DateTimeZone::listIdentifiers();

        return Inertia::render('admin/administration/system-configuration', [
            'configuration' => $this->settingValue('system.general', [
                'timezone' => 'Africa/Nairobi',
                'locale' => 'en',
                'currency' => 'KES',
                'date_format' => 'd M Y',
                'time_format' => 'H:i',
            ]),
            'timezones' => $timezones,
        ]);
    }

    public function updateSystem(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'timezone' => ['required', 'string', Rule::in(\DateTimeZone::listIdentifiers())],
            'locale' => ['required', 'string', 'regex:/^[a-z]{2}(?:-[A-Z]{2})?$/', 'max:10'],
            'currency' => ['required', 'string', 'regex:/^[A-Z]{3}$/'],
            'date_format' => ['required', Rule::in(['d M Y', 'd/m/Y', 'Y-m-d', 'm/d/Y', 'd F Y'])],
            'time_format' => ['required', Rule::in(['H:i', 'H:i:s', 'h:i A'])],
        ]);

        $this->saveSetting($request, 'system.general', 'system', false, $data, 'settings.system.updated');

        return back()->with('success', 'System configuration saved.');
    }

    /** @return array<string, mixed> */
    private function settingValue(string $key, array $defaults): array
    {
        $setting = SystemSetting::query()->where('key', $key)->first();
        $value = $setting?->value;

        return array_replace_recursive($defaults, is_array($value) ? $value : []);
    }

    /** @param array<string, mixed> $data */
    private function saveSetting(Request $request, string $key, string $group, bool $isPublic, array $data, string $action): void
    {
        DB::transaction(function () use ($request, $key, $group, $isPublic, $data, $action): void {
            $setting = SystemSetting::query()->where('key', $key)->lockForUpdate()->first();
            $before = is_array($setting?->value) ? $setting->value : [];
            $setting ??= new SystemSetting(['key' => $key]);
            $setting->group = $group;
            $setting->is_public = $isPublic;
            $setting->value = $data;
            $setting->updated_by = $request->user()->id;
            $setting->save();

            SystemAuditLog::query()->create([
                'user_id' => $request->user()->id,
                'action' => $action,
                'subject_type' => 'SystemSetting',
                'subject_id' => (string) $setting->getKey(),
                'before_values' => $before,
                'after_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 2000),
                'occurred_at' => now(),
            ]);
        });
    }

    /** @return array<string, mixed> */
    private function facilityDefaults(): array
    {
        return [
            'name' => 'Ivona Wayside Clinic',
            'tagline' => '',
            'description' => '',
            'url' => config('app.url'),
            'phone' => '',
            'email' => '',
            'address' => '',
            'opening_hours' => '',
            'logo_url' => null,
            'favicon_url' => null,
            'social_links' => ['whatsapp' => '', 'facebook' => '', 'instagram' => '', 'linkedin' => '', 'youtube' => '', 'x' => ''],
            'public_links' => ['contact' => '/contact', 'directions' => '', 'appointments' => '', 'website' => config('app.url'), 'whatsapp' => '', 'google_maps' => ''],
        ];
    }
}

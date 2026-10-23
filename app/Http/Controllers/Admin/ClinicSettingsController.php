<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemAuditLog;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;
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
            'logo_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'favicon_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'dimensions:ratio=1/1', 'max:2048'],
            'remove_logo' => ['sometimes', 'boolean'],
            'remove_favicon' => ['sometimes', 'boolean'],
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

        $current = $this->settingValue('site.identity', $this->facilityDefaults());
        $data['logo_url'] = $current['logo_url'] ?? null;
        $data['favicon_url'] = $current['favicon_url'] ?? null;
        $newPaths = [];

        try {
            if ($request->boolean('remove_logo')) {
                $data['logo_url'] = null;
            } elseif ($request->hasFile('logo_file')) {
                $path = $request->file('logo_file')->storePublicly('site/branding', 'public');
                $newPaths[] = $path;
                $data['logo_url'] = '/storage/'.$path;
            }

            if ($request->boolean('remove_favicon')) {
                $data['favicon_url'] = null;
            } elseif ($request->hasFile('favicon_file')) {
                $path = $request->file('favicon_file')->storePublicly('site/branding', 'public');
                $newPaths[] = $path;
                $data['favicon_url'] = '/storage/'.$path;
            }

            unset($data['logo_file'], $data['favicon_file'], $data['remove_logo'], $data['remove_favicon']);
            $this->saveSetting($request, 'site.identity', 'site', true, $data, 'settings.facility.updated');
        } catch (Throwable $exception) {
            foreach ($newPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $exception;
        }

        foreach (['logo_url', 'favicon_url'] as $assetKey) {
            $oldUrl = $current[$assetKey] ?? null;
            $newUrl = $data[$assetKey] ?? null;

            if ($oldUrl && $oldUrl !== $newUrl) {
                $this->deleteManagedBrandingAsset($oldUrl);
            }
        }

        return back()->with('success', 'Facility identity and contact information saved.');
    }

    public function updateLogo(Request $request): RedirectResponse
    {
        return $this->updateBrandingAsset($request, 'logo_file', 'remove_logo', 'logo_url', ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'], 'settings.facility.logo.updated');
    }

    public function updateFavicon(Request $request): RedirectResponse
    {
        return $this->updateBrandingAsset($request, 'favicon_file', 'remove_favicon', 'favicon_url', ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'dimensions:ratio=1/1', 'max:2048'], 'settings.facility.favicon.updated');
    }

    /** Save one branding asset without requiring unrelated facility fields such as the clinic name. */
    private function updateBrandingAsset(Request $request, string $fileKey, string $removeKey, string $assetKey, array $fileRules, string $auditAction): RedirectResponse
    {
        $data = $request->validate([
            $fileKey => $fileRules,
            $removeKey => ['sometimes', 'boolean'],
        ]);

        $remove = $request->boolean($removeKey);
        if (!$request->hasFile($fileKey) && !$remove) {
            return back()->withErrors([$fileKey => 'Choose an image or select Remove image before saving.']);
        }

        $current = $this->settingValue('site.identity', $this->facilityDefaults());
        $oldUrl = $current[$assetKey] ?? null;
        $newPath = null;

        try {
            if ($remove) {
                $current[$assetKey] = null;
            } elseif ($request->hasFile($fileKey)) {
                $newPath = $request->file($fileKey)->storePublicly('site/branding', 'public');
                $current[$assetKey] = '/storage/'.$newPath;
            }

            $this->saveSetting($request, 'site.identity', 'site', true, $current, $auditAction);
        } catch (Throwable $exception) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            throw $exception;
        }

        $newUrl = $current[$assetKey] ?? null;
        if ($oldUrl && $oldUrl !== $newUrl) {
            $this->deleteManagedBrandingAsset($oldUrl);
        }

        return back()->with('success', $assetKey === 'logo_url' ? 'Clinic logo updated.' : 'Site favicon updated.');
    }

    private function deleteManagedBrandingAsset(string $url): void
    {
        $path = parse_url($url, PHP_URL_PATH);

        if (is_string($path) && str_starts_with($path, '/storage/site/branding/')) {
            Storage::disk('public')->delete(substr($path, strlen('/storage/')));
        }
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

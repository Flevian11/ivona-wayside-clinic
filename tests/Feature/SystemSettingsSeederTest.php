<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemSettingsSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_publishes_confirmed_clinic_contact_details_and_keeps_system_defaults_private(): void
    {
        $this->seed(\Database\Seeders\SystemSettingsSeeder::class);

        $identity = SystemSetting::query()->where('key', 'site.identity')->firstOrFail();
        $general = SystemSetting::query()->where('key', 'system.general')->firstOrFail();
        $value = $identity->value;

        $this->assertTrue($identity->is_public);
        $this->assertSame('Ivona Wayside Clinic', $value['name']);
        $this->assertSame('+254 721 215036', $value['phone']);
        $this->assertSame('info@ivonawaysideclinic.co.ke', $value['email']);
        $this->assertSame('Ivona, Mautuma Lugari, Kakamega', $value['address']);
        $this->assertSame('Open 24 hours', $value['opening_hours']);
        $this->assertSame('https://wa.me/254721215036', $value['social_links']['whatsapp']);
        $this->assertSame('https://facebook.com/ivonawaysideclinic', $value['social_links']['facebook']);
        $this->assertSame('https://wa.me/254721215036', $value['public_links']['whatsapp']);
        $this->assertSame('/contact', $value['public_links']['contact']);
        $this->assertFalse($general->is_public);
        $this->assertSame('Africa/Nairobi', $general->value['timezone']);
        $this->assertSame('KES', $general->value['currency']);
    }

    public function test_rerunning_seeder_fills_missing_details_without_overwriting_configured_values(): void
    {
        $this->seed(\Database\Seeders\SystemSettingsSeeder::class);

        $setting = SystemSetting::query()->where('key', 'site.identity')->firstOrFail();
        $value = $setting->value;
        $value['phone'] = '+254 700 000000';
        $value['email'] = 'custom@example.test';
        $value['social_links']['facebook'] = 'https://facebook.com/custom-page';
        $value['social_links']['instagram'] = null;
        unset($value['public_links']['google_maps']);
        $setting->update(['value' => $value]);

        $this->seed(\Database\Seeders\SystemSettingsSeeder::class);

        $updated = SystemSetting::query()->where('key', 'site.identity')->firstOrFail()->value;
        $this->assertSame('+254 700 000000', $updated['phone']);
        $this->assertSame('custom@example.test', $updated['email']);
        $this->assertSame('https://facebook.com/custom-page', $updated['social_links']['facebook']);
        $this->assertSame('https://wa.me/254721215036', $updated['social_links']['whatsapp']);
        $this->assertArrayHasKey('google_maps', $updated['public_links']);
    }
}

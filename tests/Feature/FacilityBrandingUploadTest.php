<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FacilityBrandingUploadTest extends TestCase
{
    use RefreshDatabase;

    private function settingsAdmin(): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $role = Role::query()->create([
            'name' => 'Facility Settings Administrator',
            'slug' => 'facility-settings-administrator',
            'is_active' => true,
        ]);
        $permission = Permission::query()->create([
            'name' => 'settings.manage',
            'module' => 'settings',
            'description' => 'Manage facility settings',
        ]);
        $role->permissions()->attach($permission->id);
        $user->roles()->attach($role->id);

        return $user;
    }

    public function test_facility_settings_accept_logo_and_square_favicon_uploads_without_url_fields(): void
    {
        Storage::fake('public');
        $admin = $this->settingsAdmin();

        $this->actingAs($admin)->put(route('admin.administration.facility-settings.update'), [
            'name' => 'Ivona Wayside Clinic',
            'tagline' => 'Care close to home',
            'description' => 'Clinic description',
            'phone' => '+254700000000',
            'email' => 'info@example.test',
            'address' => 'Clinic address',
            'opening_hours' => 'Open 24 hours',
            'logo_file' => UploadedFile::fake()->image('clinic-logo.png', 360, 120),
            'favicon_file' => UploadedFile::fake()->image('clinic-icon.png', 64, 64),
            'social_links' => [],
            'public_links' => ['contact' => '/contact'],
        ])->assertRedirect();

        $identity = SystemSetting::query()->where('key', 'site.identity')->firstOrFail()->value;
        $this->assertStringStartsWith('/storage/site/branding/', $identity['logo_url']);
        $this->assertStringStartsWith('/storage/site/branding/', $identity['favicon_url']);
        Storage::disk('public')->assertExists(substr($identity['logo_url'], strlen('/storage/')));
        Storage::disk('public')->assertExists(substr($identity['favicon_url'], strlen('/storage/')));
        $this->assertDatabaseHas('system_audit_logs', ['action' => 'settings.facility.updated']);
    }

    public function test_facility_settings_rejects_non_square_favicon_uploads(): void
    {
        Storage::fake('public');
        $admin = $this->settingsAdmin();

        $this->actingAs($admin)->from('/admin/administration/facility-settings')
            ->put(route('admin.administration.facility-settings.update'), [
                'name' => 'Ivona Wayside Clinic',
                'favicon_file' => UploadedFile::fake()->image('not-square.png', 120, 64),
            ])
            ->assertSessionHasErrors('favicon_file');

        Storage::disk('public')->assertDirectoryEmpty('site/branding');
    }
    public function test_logo_can_be_saved_independently_without_requiring_facility_name(): void
    {
        Storage::fake('public');
        $admin = $this->settingsAdmin();

        $this->actingAs($admin)->put(route('admin.administration.facility-settings.logo'), [
            'logo_file' => UploadedFile::fake()->image('clinic-logo.png', 360, 120),
        ])->assertRedirect()->assertSessionHasNoErrors();

        $identity = SystemSetting::query()->where('key', 'site.identity')->firstOrFail()->value;
        $this->assertSame('Ivona Wayside Clinic', $identity['name']);
        $this->assertStringStartsWith('/storage/site/branding/', $identity['logo_url']);
        $this->assertSame($identity['logo_url'], $identity['favicon_url'], 'Logo upload should also update the favicon.');
        $this->assertDatabaseHas('system_audit_logs', ['action' => 'settings.facility.logo.updated']);
    }

    public function test_favicon_can_be_saved_independently_without_requiring_facility_name(): void
    {
        Storage::fake('public');
        $admin = $this->settingsAdmin();

        $this->actingAs($admin)->put(route('admin.administration.facility-settings.favicon'), [
            'favicon_file' => UploadedFile::fake()->image('clinic-icon.png', 64, 64),
        ])->assertRedirect()->assertSessionHasNoErrors();

        $identity = SystemSetting::query()->where('key', 'site.identity')->firstOrFail()->value;
        $this->assertStringStartsWith('/storage/site/branding/', $identity['favicon_url']);
        $this->assertDatabaseHas('system_audit_logs', ['action' => 'settings.facility.favicon.updated']);
    }



    public function test_facility_sections_save_independently_and_preserve_other_sections(): void
    {
        Storage::fake('public');
        $admin = $this->settingsAdmin();

        SystemSetting::query()->create([
            'key' => 'site.identity',
            'group' => 'site',
            'is_public' => true,
            'value' => [
                'name' => 'Existing Clinic',
                'phone' => '0700000000',
                'social_links' => ['facebook' => 'https://facebook.com/existing'],
                'public_links' => ['contact' => '/contact'],
            ],
        ]);

        $this->actingAs($admin)->put(route('admin.administration.facility-settings.identity'), [
            'name' => 'Updated Clinic',
            'tagline' => 'Test tagline',
            'description' => 'Clinic details',
            'url' => 'https://clinic.example.test',
        ])->assertRedirect()->assertSessionHasNoErrors();

        $identity = SystemSetting::query()->where('key', 'site.identity')->firstOrFail()->value;
        $this->assertSame('Updated Clinic', $identity['name']);
        $this->assertSame('0700000000', $identity['phone']);
        $this->assertSame('https://facebook.com/existing', $identity['social_links']['facebook']);
        $this->assertSame('/contact', $identity['public_links']['contact']);

        $this->actingAs($admin)->put(route('admin.administration.facility-settings.contact'), [
            'phone' => '0711111111',
            'email' => 'contact@example.test',
            'address' => 'Clinic address',
            'opening_hours' => 'Weekdays',
        ])->assertRedirect()->assertSessionHasNoErrors();

        $identity = SystemSetting::query()->where('key', 'site.identity')->firstOrFail()->value;
        $this->assertSame('Updated Clinic', $identity['name']);
        $this->assertSame('0711111111', $identity['phone']);
        $this->assertSame('https://facebook.com/existing', $identity['social_links']['facebook']);
    }

}

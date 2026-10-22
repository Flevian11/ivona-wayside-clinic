<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\SystemRelease;
use App\Models\SystemReleaseAcknowledgement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardRbacTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shares_only_permissions_from_active_roles(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $activeRole = Role::query()->create([
            'name' => 'Release Viewer',
            'slug' => 'release-viewer',
            'is_active' => true,
        ]);
        $inactiveRole = Role::query()->create([
            'name' => 'Inactive Administrator',
            'slug' => 'inactive-administrator',
            'is_active' => false,
        ]);

        $releasePermission = Permission::query()->create([
            'name' => 'releases.view',
            'module' => 'releases',
        ]);
        $settingsPermission = Permission::query()->create([
            'name' => 'settings.manage',
            'module' => 'settings',
        ]);

        $activeRole->permissions()->attach($releasePermission->id);
        $inactiveRole->permissions()->attach($settingsPermission->id);
        $user->roles()->attach($activeRole->id);
        $user->roles()->attach($inactiveRole->id);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('auth.permissions', ['releases.view'])
                ->where('auth.roles', [
                    ['name' => 'Release Viewer', 'slug' => 'release-viewer'],
                ])
                ->where('dashboard.announcement', null)
            );
    }

    public function test_release_announcement_is_acknowledged_once_per_user_and_release(): void
    {
        config(['system.installed_version' => '0.1.0']);

        $release = SystemRelease::query()->forceCreate([
            'version' => '1.1.0',
            'title' => 'Clinical workspace foundation',
            'release_type' => 'minor',
            'summary' => 'Introduces the first staff workspace.',
            'features' => ['Permission-aware navigation'],
            'status' => 'published',
            'published_at' => now(),
        ]);

        $firstUser = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $secondUser = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($firstUser)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('dashboard.announcement.version', '1.1.0')
                ->where('dashboard.announcement.title', 'Clinical workspace foundation')
            );

        $this->post(route('dashboard.releases.acknowledge', $release))
            ->assertRedirect();

        $this->assertDatabaseHas('system_release_acknowledgements', [
            'user_id' => $firstUser->id,
            'system_release_id' => $release->id,
        ]);

        $this->actingAs($firstUser)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('dashboard.announcement', null)
            );

        $this->actingAs($secondUser)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('dashboard.announcement.version', '1.1.0')
            );

        $this->assertSame(
            1,
            SystemReleaseAcknowledgement::query()
                ->where('user_id', $firstUser->id)
                ->where('system_release_id', $release->id)
                ->count(),
        );
    }

    public function test_changelog_only_displays_published_releases(): void
    {
        foreach ([
            ['version' => '1.0.0', 'status' => 'published', 'published_at' => now()],
            ['version' => '1.1.0', 'status' => 'draft', 'published_at' => null],
            ['version' => '1.2.0', 'status' => 'withdrawn', 'published_at' => now()->subDay()],
        ] as $data) {
            SystemRelease::query()->forceCreate([
                'version' => $data['version'],
                'title' => 'Release '.$data['version'],
                'release_type' => 'patch',
                'summary' => 'Release summary.',
                ...$data,
            ]);
        }

        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)
            ->get(route('releases.changelog'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('releases/changelog')
                ->has('releases', 1)
                ->where('releases.0.version', '1.0.0')
            );
    }
}

<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\SystemAuditLog;
use App\Models\SystemRelease;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemReleaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_version_endpoint_reports_installed_version_when_no_release_is_published(): void
    {
        $response = $this->getJson('/api/system/version');

        $response
            ->assertOk()
            ->assertJsonPath('installed_version', config('system.installed_version'))
            ->assertJsonPath('latest_published_release', null)
            ->assertJsonPath('update_available', false);
    }

    public function test_user_without_release_permissions_cannot_access_release_management(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/admin/system/releases')
            ->assertForbidden();
    }

    public function test_authorized_user_can_create_and_publish_a_release_with_audit_records(): void
    {
        $user = User::factory()->create();
        $this->grantPermissions($user, [
            'releases.view',
            'releases.create',
            'releases.publish',
        ]);

        $this->actingAs($user);

        $this->postJson('/admin/system/releases', [
            'version' => '1.2.0',
            'title' => 'Release 1.2.0',
            'release_type' => 'minor',
            'summary' => 'Adds system release management.',
            'release_notes' => 'Initial release-management functionality.',
            'features' => ['Version history'],
            'improvements' => ['Administrative release workflow'],
            'bug_fixes' => [],
            'security_notes' => [],
            'known_issues' => [],
            'minimum_php_version' => '8.3',
            'minimum_database_version' => '18',
        ])->assertCreated();

        $release = SystemRelease::query()
            ->where('version', '1.2.0')
            ->firstOrFail();

        $this->assertSame('draft', $release->status);
        $this->assertSame($user->id, $release->created_by);

        $this->postJson("/admin/system/releases/{$release->id}/publish")
            ->assertOk();

        $release->refresh();

        $this->assertSame('published', $release->status);
        $this->assertSame($user->id, $release->published_by);
        $this->assertNotNull($release->published_at);
        $this->assertSame(2, SystemAuditLog::query()->count());

        $this->getJson('/api/system/version')
            ->assertOk()
            ->assertJsonPath('latest_published_release.version', '1.2.0');
    }

    public function test_user_without_publish_permission_cannot_publish_a_release(): void
    {
        $user = User::factory()->create();

        $this->grantPermissions($user, [
            'releases.view',
            'releases.create',
        ]);

        $this->actingAs($user);

        $this->postJson('/admin/system/releases', [
            'version' => '1.3.0',
            'title' => 'Release 1.3.0',
            'release_type' => 'patch',
            'summary' => 'A test release.',
        ])->assertCreated();

        $release = SystemRelease::query()
            ->where('version', '1.3.0')
            ->firstOrFail();

        $this->postJson("/admin/system/releases/{$release->id}/publish")
            ->assertForbidden();

        $this->assertSame('draft', $release->fresh()->status);
        $this->assertSame(1, SystemAuditLog::query()->count());
    }


    public function test_public_version_endpoint_selects_highest_semantic_version_not_latest_timestamp(): void
    {
        SystemRelease::query()->forceCreate([
            'version' => '2.0.0',
            'title' => 'Major release',
            'release_type' => 'major',
            'summary' => 'Major release published earlier.',
            'status' => 'published',
            'published_at' => now()->subDays(10),
        ]);

        SystemRelease::query()->forceCreate([
            'version' => '1.9.0',
            'title' => 'Minor release',
            'release_type' => 'minor',
            'summary' => 'Older version published more recently.',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);

        $this->getJson('/api/system/version')
            ->assertOk()
            ->assertJsonPath('latest_published_release.version', '2.0.0');
    }
    private function grantPermissions(User $user, array $permissionNames): void
    {
        $role = Role::query()->create([
            'name' => 'Test Release Administrator',
            'slug' => 'test-release-administrator',
            'is_active' => true,
        ]);

        foreach ($permissionNames as $name) {
            $permission = Permission::query()->create([
                'name' => $name,
                'module' => 'releases',
            ]);

            $role->permissions()->attach($permission->id);
        }

        $user->roles()->attach($role->id);
    }
}
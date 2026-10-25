<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DynamicPermissionGateTest extends TestCase
{
    use RefreshDatabase;

    public function test_registered_permission_is_granted_from_active_database_role_assignment(): void
    {
        $user = User::factory()->create();
        $role = Role::query()->create([
            'name' => 'Patient Registrar',
            'slug' => 'patient-registrar-test',
            'is_active' => true,
        ]);
        $permission = Permission::query()->create([
            'name' => 'patients.create',
            'module' => 'patients',
            'description' => 'Register patients',
        ]);

        $role->permissions()->attach($permission);
        $user->roles()->attach($role);

        $this->assertTrue($user->can('patients.create'));
    }

    public function test_registered_permission_is_denied_without_an_active_grant(): void
    {
        $user = User::factory()->create();
        Permission::query()->create([
            'name' => 'patients.view',
            'module' => 'patients',
            'description' => 'View patient records',
        ]);

        $this->assertFalse($user->can('patients.view'));
    }

    public function test_inactive_role_does_not_grant_a_registered_permission(): void
    {
        $user = User::factory()->create();
        $role = Role::query()->create([
            'name' => 'Inactive Patient Registrar',
            'slug' => 'inactive-patient-registrar-test',
            'is_active' => false,
        ]);
        $permission = Permission::query()->create([
            'name' => 'patients.create',
            'module' => 'patients',
            'description' => 'Register patients',
        ]);

        $role->permissions()->attach($permission);
        $user->roles()->attach($role);

        $this->assertFalse($user->can('patients.create'));
    }

    public function test_role_name_does_not_bypass_database_permissions(): void
    {
        $user = User::factory()->create();
        $role = Role::query()->create([
            'name' => 'Super Administrator',
            'slug' => 'super-administrator',
            'is_active' => true,
        ]);
        $permission = Permission::query()->create([
            'name' => 'patients.view',
            'module' => 'patients',
            'description' => 'View patient records',
        ]);

        $user->roles()->attach($role);

        $this->assertFalse($user->can('patients.view'));

        $role->permissions()->attach($permission);

        $this->assertTrue($user->fresh()->can('patients.view'));
    }
}

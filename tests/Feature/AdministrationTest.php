<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdministrationTest extends TestCase
{
    use RefreshDatabase;

    private function authorizedUser(string $permission = 'users.manage'): User
    {
        $user=User::factory()->create(['email_verified_at'=>now()]);
        $role=Role::query()->create(['name'=>'Administration Test','slug'=>'administration-test','is_active'=>true]);
        $grant=Permission::query()->create(['name'=>$permission,'module'=>str_contains($permission,'.')?explode('.',$permission)[0]:'administration','description'=>'Test grant']);
        $role->permissions()->attach($grant->id); $user->roles()->attach($role->id);
        return $user;
    }

    public function test_creating_a_user_assigns_the_explicitly_selected_dynamic_role(): void
    {
        $admin=$this->authorizedUser();
        $selectedRole = $admin->roles()->firstOrFail();
        $this->actingAs($admin)->post(route('admin.administration.users.store'),[
            'name'=>'New Staff User','email'=>'new.staff@example.test','password'=>'A-Strong-Test-Password-2026','password_confirmation'=>'A-Strong-Test-Password-2026',
            'role_ids'=>[$selectedRole->id],
        ])->assertRedirect();
        $newUser=User::query()->where('email','new.staff@example.test')->firstOrFail();
        $this->assertCount(1,$newUser->roles);
        $this->assertTrue($newUser->roles()->whereKey($selectedRole->id)->exists());
        $this->assertDatabaseHas('system_audit_logs',['action'=>'administration.user.created','subject_id'=>(string)$newUser->id]);
    }

    public function test_user_administration_is_server_side_permission_protected(): void
    {
        $user=User::factory()->create(['email_verified_at'=>now()]);
        $this->actingAs($user)->get(route('admin.administration.users'))->assertForbidden();
    }


    public function test_role_permissions_have_a_dedicated_page(): void
    {
        $admin = $this->authorizedUser('roles.manage');
        $role = Role::query()->create(['name' => 'Ward Clerk', 'slug' => 'ward-clerk', 'is_active' => true]);
        $this->actingAs($admin)
            ->get(route('admin.administration.roles.permissions.edit', $role))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/administration/role-permissions')
                ->where('role.id', $role->id));
    }

    public function test_role_permission_updates_are_audited(): void
    {
        $admin=$this->authorizedUser('roles.manage');
        $role=Role::query()->create(['name'=>'Cashier','slug'=>'cashier','is_active'=>true]);
        $permission=Permission::query()->create(['name'=>'billing.view','module'=>'billing','description'=>'View billing']);
        $this->actingAs($admin)->put(route('admin.administration.roles.permissions',$role),['permission_ids'=>[$permission->id]])->assertRedirect();
        $this->assertTrue($role->fresh()->permissions()->whereKey($permission->id)->exists());
        $this->assertDatabaseHas('system_audit_logs',['action'=>'administration.role.permissions_changed','subject_id'=>(string)$role->id]);
    }
}

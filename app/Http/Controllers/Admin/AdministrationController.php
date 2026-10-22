<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\StaffMember;
use App\Models\SystemAuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdministrationController extends Controller
{
    public function users(Request $request): Response
    {
        $users = User::query()
            ->with(['roles:id,name,slug'])
            ->withCount('roles')
            ->when($request->filled('q'), fn ($query) => $query->where(fn ($where) => $where
                ->where('name', 'ilike', '%'.$request->string('q')->trim().'%')
                ->orWhere('email', 'ilike', '%'.$request->string('q')->trim().'%')))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/administration/users', [
            'users' => $users,
            'roles' => Role::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'description']),
            'filters' => ['q' => $request->string('q')->toString()],
        ]);
    }

    public function storeUser(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:12', 'confirmed'],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['required', 'integer', 'distinct', 'exists:roles,id'],
        ]);

        DB::transaction(function () use ($request, $data): void {
            $roles = Role::query()->whereIn('id', $data['role_ids'])->lockForUpdate()->get();
            abort_if($roles->count() !== count($data['role_ids']), 422, 'One or more selected roles do not exist.');
            abort_if($roles->contains(fn (Role $role) => ! $role->is_active), 422, 'Inactive roles cannot be assigned.');

            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $sync = [];
            foreach ($roles as $role) {
                $sync[$role->id] = ['assigned_by' => $request->user()->id, 'assigned_at' => now()];
            }
            $user->roles()->sync($sync);

            $this->audit($request, 'administration.user.created', $user, null, [
                'name' => $user->name,
                'email' => $user->email,
                'role_ids' => $roles->modelKeys(),
                'roles' => $roles->pluck('name')->all(),
            ]);
        });

        return back()->with('success', 'User account created with the selected role assignment.');
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:12', 'confirmed'],
        ]);

        $before = ['name' => $user->name, 'email' => $user->email];
        $user->name = $data['name'];
        $user->email = $data['email'];
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        $this->audit($request, 'administration.user.updated', $user, $before, [
            'name' => $user->name,
            'email' => $user->email,
            'password_changed' => ! empty($data['password']),
        ]);

        return back()->with('success', 'User account updated.');
    }

    public function staff(Request $request): Response
    {
        $staff = StaffMember::query()->with('user:id,name,email')
            ->when($request->filled('q'), fn ($query) => $query->where(fn ($where) => $where
                ->where('first_name', 'ilike', '%'.$request->string('q')->trim().'%')
                ->orWhere('last_name', 'ilike', '%'.$request->string('q')->trim().'%')
                ->orWhere('staff_number', 'ilike', '%'.$request->string('q')->trim().'%')))
            ->orderBy('last_name')->orderBy('first_name')->paginate(15)->withQueryString();

        return Inertia::render('admin/administration/staff', [
            'staff' => $staff,
            'users' => User::query()->orderBy('name')->get(['id', 'name', 'email']),
            'filters' => ['q' => $request->string('q')->toString()],
        ]);
    }

    public function storeStaff(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'staff_number' => ['required', 'string', 'max:60', 'unique:staff_members,staff_number'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'other_names' => ['nullable', 'string', 'max:150'],
            'work_email' => ['nullable', 'email', 'max:255', 'unique:staff_members,work_email'],
            'phone' => ['nullable', 'string', 'max:40'],
            'department' => ['nullable', 'string', 'max:120'],
            'job_title' => ['nullable', 'string', 'max:120'],
            'employment_status' => ['required', Rule::in(['active', 'on_leave', 'suspended', 'terminated'])],
            'user_id' => ['nullable', 'integer', 'exists:users,id', Rule::unique('staff_members', 'user_id')],
        ]);

        $staff = StaffMember::query()->create($data);
        $this->audit($request, 'administration.staff.created', $staff, null, $staff->only([
            'staff_number', 'first_name', 'last_name', 'department', 'job_title', 'employment_status', 'user_id',
        ]));

        return back()->with('success', 'Staff profile created.');
    }

    public function updateStaff(Request $request, StaffMember $staffMember): RedirectResponse
    {
        $data = $request->validate([
            'staff_number' => ['required', 'string', 'max:60', Rule::unique('staff_members', 'staff_number')->ignore($staffMember->id)],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'other_names' => ['nullable', 'string', 'max:150'],
            'work_email' => ['nullable', 'email', 'max:255', Rule::unique('staff_members', 'work_email')->ignore($staffMember->id)],
            'phone' => ['nullable', 'string', 'max:40'],
            'department' => ['nullable', 'string', 'max:120'],
            'job_title' => ['nullable', 'string', 'max:120'],
            'employment_status' => ['required', Rule::in(['active', 'on_leave', 'suspended', 'terminated'])],
            'user_id' => ['nullable', 'integer', 'exists:users,id', Rule::unique('staff_members', 'user_id')->ignore($staffMember->id)],
        ]);

        $before = $staffMember->only(array_keys($data));
        $staffMember->update($data);
        $this->audit($request, 'administration.staff.updated', $staffMember, $before, $staffMember->only(array_keys($data)));

        return back()->with('success', 'Staff profile updated.');
    }

    public function roles(): Response
    {
        return Inertia::render('admin/administration/roles', [
            'roles' => Role::query()->withCount(['users', 'permissions'])->orderBy('name')->get(),
        ]);
    }

    public function rolePermissions(Role $role): Response
    {
        return Inertia::render('admin/administration/role-permissions', [
            'role' => $role->load('permissions:id,name,description,module'),
            'permissions' => Permission::query()->orderBy('module')->orderBy('name')->get(['id', 'name', 'description', 'module']),
        ]);
    }

    public function storeRole(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
            'slug' => ['required', 'alpha_dash', 'max:100', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);
        $role = Role::query()->create([...$data, 'is_system' => false, 'is_active' => true]);
        $this->audit($request, 'administration.role.created', $role, null, $role->only(['name', 'slug', 'description', 'is_active']));

        return back()->with('success', 'Role created. Assign permissions to enable its access.');
    }

    public function updateRole(Request $request, Role $role): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('roles', 'name')->ignore($role->id)],
            'slug' => ['required', 'alpha_dash', 'max:100', Rule::unique('roles', 'slug')->ignore($role->id)],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['required', 'boolean'],
        ]);

        if ($role->is_system && ! $data['is_active']) {
            abort_if($role->users()->exists(), 422, 'A system role assigned to a user cannot be deactivated. Reassign those users first.');
        }

        $before = $role->only(['name', 'slug', 'description', 'is_active']);
        $role->update($data);
        $this->audit($request, 'administration.role.updated', $role, $before, $role->only(['name', 'slug', 'description', 'is_active']));

        return back()->with('success', 'Role updated.');
    }

    public function syncRolePermissions(Request $request, Role $role): RedirectResponse
    {
        $data = $request->validate([
            'permission_ids' => ['present', 'array'],
            'permission_ids.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ]);

        DB::transaction(function () use ($request, $role, $data): void {
            $before = $role->permissions()->pluck('permissions.id')->sort()->values()->all();
            $sync = [];
            foreach ($data['permission_ids'] as $id) {
                $sync[$id] = ['assigned_by' => $request->user()->id, 'assigned_at' => now()];
            }
            $role->permissions()->sync($sync);
            $this->audit($request, 'administration.role.permissions_changed', $role,
                ['permission_ids' => $before],
                ['permission_ids' => collect($data['permission_ids'])->sort()->values()->all()]);
        });

        return back()->with('success', 'Role permissions saved.');
    }

    public function assignments(): Response
    {
        return Inertia::render('admin/administration/assignments', [
            'users' => User::query()->with('roles:id,name,slug')->orderBy('name')->get(['id', 'name', 'email']),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name', 'slug', 'is_system', 'is_active']),
        ]);
    }

    public function syncUserRoles(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'role_ids' => ['present', 'array'],
            'role_ids.*' => ['integer', 'distinct', 'exists:roles,id'],
        ]);

        $superAdminId = Role::query()->where('slug', 'super-administrator')->value('id');
        if ($user->is($request->user()) && $superAdminId !== null
            && ! in_array((int) $superAdminId, array_map('intval', $data['role_ids']), true)) {
            abort(422, 'You cannot remove your own Super Administrator assignment. Ask another authorized administrator to review it.');
        }

        DB::transaction(function () use ($request, $user, $data): void {
            $roles = Role::query()->whereIn('id', $data['role_ids'])->lockForUpdate()->get();
            abort_if($roles->count() !== count($data['role_ids']), 422, 'One or more selected roles do not exist.');
            $before = $user->roles()->pluck('roles.id')->map(fn ($id) => (int) $id)->all();
            $beforeIds = array_map('intval', $before);
            foreach ($roles as $role) {
                abort_if(! $role->is_active && ! in_array((int) $role->id, $beforeIds, true), 422, 'Inactive roles cannot be newly assigned.');
            }
            $sync = [];
            foreach ($roles as $role) {
                $sync[$role->id] = ['assigned_by' => $request->user()->id, 'assigned_at' => now()];
            }
            $user->roles()->sync($sync);
            $this->audit($request, 'administration.user.roles_changed', $user,
                ['role_ids' => $before],
                ['role_ids' => $roles->modelKeys()]);
        });

        return back()->with('success', 'Role assignments updated and audited.');
    }

    public function permissions(): Response
    {
        return Inertia::render('admin/administration/permissions', [
            'permissions' => Permission::query()->withCount('roles')->orderBy('module')->orderBy('name')->get(),
        ]);
    }

    public function accessHistory(Request $request): Response
    {
        $logs = SystemAuditLog::query()->with('user:id,name,email')
            ->when($request->filled('q'), fn ($query) => $query->where(fn ($where) => $where
                ->where('action', 'ilike', '%'.$request->string('q').'%')
                ->orWhere('subject_type', 'ilike', '%'.$request->string('q').'%')
                ->orWhere('subject_id', 'ilike', '%'.$request->string('q').'%')))
            ->latest('occurred_at')->paginate(30)->withQueryString();

        return Inertia::render('admin/administration/access-history', [
            'logs' => $logs,
            'filters' => ['q' => $request->string('q')->toString()],
        ]);
    }

    private function audit(Request $request, string $action, object $subject, ?array $before, ?array $after): void
    {
        SystemAuditLog::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'subject_type' => class_basename($subject),
            'subject_id' => (string) $subject->getKey(),
            'before_values' => $before,
            'after_values' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 2000),
            'occurred_at' => now(),
        ]);
    }
}

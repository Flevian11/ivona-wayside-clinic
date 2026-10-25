<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SystemRoleSeeder extends Seeder
{
    /**
     * Seed the five default roles without replacing the dynamic role/permission
     * management model. Custom (non-system) roles are intentionally preserved.
     */
    public function run(): void
    {
        DB::transaction(function (): void {
            $catalogue = Permission::query()->pluck('id', 'name');

            if ($catalogue->isEmpty()) {
                throw new RuntimeException(
                    'The permission catalogue is empty. Run PermissionCatalogueSeeder first.'
                );
            }

            $allPermissionNames = $catalogue->keys()->all();
            $developerPermissionNames = array_values(array_filter(
                $allPermissionNames,
                static fn (string $name): bool => str_starts_with($name, 'developer-tools.')
            ));
            $hospitalAdminPermissions = array_values(array_diff(
                $allPermissionNames,
                $developerPermissionNames,
            ));

            $clinical = [
                'patients.view',
                'patients.update',
                'appointments.view',
                'consultations.view',
                'consultations.manage',
                'diagnoses.record',
                'treatment_plans.manage',
                'prescriptions.create',
                'clinical_notes.view',
                'clinical_notes.manage',
                'clinical_records.correct',
                'lab.orders.view',
                'lab.orders.manage',
                'lab.results.record',
                'lab.results.verify',
                'radiology.manage',
                'medical_records.view',
                'medical_records.manage',
                'reports.clinical.view',
            ];

            $roles = [
                'super-administrator' => [
                    'name' => 'Super Administrator',
                    'description' => 'Unrestricted access to all current and future catalogue permissions, including developer tools.',
                    'permissions' => $allPermissionNames,
                ],
                'hospital-administrator' => [
                    'name' => 'Hospital Administrator',
                    'description' => 'Full hospital operations and system administration, excluding developer tools.',
                    'permissions' => $hospitalAdminPermissions,
                ],
                'receptionist' => [
                    'name' => 'Receptionist',
                    'description' => 'Patient registration, appointments, check-in, queues, referrals, and permitted medical-record access.',
                    'permissions' => [
                        'patients.view', 'patients.create', 'patients.update',
                        'appointments.view', 'appointments.manage',
                        'queues.manage', 'referrals.manage',
                        'medical_records.view',
                    ],
                ],
                'doctor' => [
                    'name' => 'Doctor / Clinician',
                    'description' => 'Clinical assessment, diagnosis, treatment, consultations, prescriptions, and assigned clinical workflows.',
                    'permissions' => $clinical,
                ],
                'nurse' => [
                    'name' => 'Nurse',
                    'description' => 'Triage, vital signs, nursing notes, and assigned patient-care workflows.',
                    'permissions' => [
                        'patients.view', 'appointments.view',
                        'triage.manage', 'vitals.record',
                        'nursing_notes.manage', 'nursing_care.manage',
                        'consultations.view', 'clinical_notes.view',
                        'medical_records.view', 'lab.orders.view',
                    ],
                ],
            ];

            // Refuse to silently discard a user's assigned system role. This is
            // safer than unexpectedly promoting an account to a broader role.
            $keepSlugs = array_keys($roles);
            $obsoleteRoles = Role::query()
                ->where('is_system', true)
                ->whereNotIn('slug', $keepSlugs)
                ->withCount('users')
                ->get();

            $assignedObsoleteRoles = $obsoleteRoles->filter(
                static fn (Role $role): bool => $role->users_count > 0
            );

            if ($assignedObsoleteRoles->isNotEmpty()) {
                $details = $assignedObsoleteRoles
                    ->map(static fn (Role $role): string => $role->slug . ' (' . $role->users_count . ' assigned user(s))')
                    ->implode(', ');

                throw new RuntimeException(
                    'Cannot remove obsolete system roles while users are assigned to them. Reassign these users to one of the five supported roles, then rerun this seeder: ' . $details
                );
            }

            foreach ($roles as $slug => $definition) {
                $permissionNames = array_values(array_unique($definition['permissions']));
                $missing = array_values(array_diff($permissionNames, $allPermissionNames));

                if ($missing !== []) {
                    throw new RuntimeException(
                        'Permission catalogue is incomplete for role ' . $slug . ': ' . implode(', ', $missing)
                    );
                }

                /** @var Role $role */
                $role = Role::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $definition['name'],
                        'description' => $definition['description'],
                        'is_system' => true,
                        'is_active' => true,
                    ],
                );

                $permissionIds = collect($permissionNames)
                    ->map(static fn (string $name): int => (int) $catalogue->get($name))
                    ->all();

                // Sync removes stale mappings while leaving user assignments alone.
                $role->permissions()->sync($permissionIds);
            }

            // Remove obsolete built-in roles only. Custom roles remain untouched.
            Role::query()
                ->where('is_system', true)
                ->whereNotIn('slug', $keepSlugs)
                ->delete();
        });
    }
}

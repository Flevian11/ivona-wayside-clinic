<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SystemRoleSeeder extends Seeder
{
    public function run(): void
    {
        $clinical = [
            'patients.view',
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
            'medical_records.view',
        ];

        // Platform administration does not automatically grant clinical access.
        // Add clinical permissions to a role only through an explicit access policy.
        $clinicalPermissions = [
            'consultations.view',
            'consultations.manage',
            'diagnoses.record',
            'treatment_plans.manage',
            'prescriptions.create',
            'clinical_notes.view',
            'clinical_notes.manage',
            'clinical_records.correct',
            'triage.manage',
            'vitals.record',
            'nursing_notes.manage',
            'nursing_care.manage',
            'lab.orders.view',
            'lab.orders.manage',
            'lab.results.record',
            'lab.results.verify',
            'radiology.manage',
            'medical_records.view',
            'medical_records.manage',
            'medical_records.release',
        ];

        $allPermissions = Permission::query()
            ->whereNotIn('name', $clinicalPermissions)
            ->pluck('name')
            ->all();

        $roles = [
            'super-administrator' => [
                'name' => 'Super Administrator',
                'description' => 'Platform-wide administration. Clinical access remains subject to policy and auditing.',
                'permissions' => $allPermissions,
            ],
            'system-administrator' => [
                'name' => 'System Administrator',
                'description' => 'Manage system configuration, users, releases, integrations, and audit visibility.',
                'permissions' => [
                    'users.view', 'users.manage',
                    'roles.view',
                    'settings.view', 'settings.manage',
                    'audit.view', 'security.manage',
                    'releases.view', 'releases.create', 'releases.update',
                    'releases.publish', 'releases.withdraw',
                    'integrations.view', 'integrations.manage',
                    'it.diagnostics.view', 'it.backups.manage',
                ],
            ],
            'it-technician' => [
                'name' => 'IT Technician',
                'description' => 'Technical support, devices, diagnostics, and authorized backup operations.',
                'permissions' => [
                    'users.view',
                    'it.support.manage',
                    'it.devices.manage',
                    'it.diagnostics.view',
                    'integrations.view',
                ],
            ],
            'receptionist' => [
                'name' => 'Receptionist',
                'description' => 'Patient registration, appointments, check-in, queues, and referrals.',
                'permissions' => [
                    'patients.view', 'patients.create', 'patients.update',
                    'appointments.view', 'appointments.manage',
                    'queues.manage', 'referrals.manage',
                    'medical_records.view',
                ],
            ],
            'doctor' => [
                'name' => 'Doctor / Clinician',
                'description' => 'Clinical assessment, diagnosis, treatment, consultations, and prescriptions.',
                'permissions' => array_merge($clinical, [
                    'patients.update',
                    'appointments.view',
                    'medical_records.manage',
                    'lab.results.record',
                    'radiology.manage',
                    'reports.clinical.view',
                ]),
            ],
            'nurse' => [
                'name' => 'Nurse',
                'description' => 'Triage, vital signs, nursing notes, and assigned patient care.',
                'permissions' => [
                    'patients.view',
                    'appointments.view',
                    'triage.manage',
                    'vitals.record',
                    'nursing_notes.manage',
                    'nursing_care.manage',
                    'consultations.view',
                    'clinical_notes.view',
                    'medical_records.view',
                    'lab.orders.view',
                ],
            ],
            'cashier' => [
                'name' => 'Cashier / Billing Officer',
                'description' => 'Patient billing, invoices, payment recording, and refund requests.',
                'permissions' => [
                    'patients.view',
                    'billing.invoices.view',
                    'billing.invoices.manage',
                    'billing.payments.view',
                    'billing.payments.record',
                    'billing.refunds.request',
                ],
            ],
            'sha-claims-officer' => [
                'name' => 'SHA / Claims Officer',
                'description' => 'Eligibility, service verification, claims processing, and reconciliation.',
                'permissions' => [
                    'patients.view',
                    'billing.invoices.view',
                    'sha.eligibility.verify',
                    'sha.services.verify',
                    'sha.claims.view',
                    'sha.claims.prepare',
                    'sha.claims.submit',
                    'sha.claims.reconcile',
                    'integrations.view',
                ],
            ],
            'medical-records-officer' => [
                'name' => 'Medical Records Officer',
                'description' => 'Medical record administration, document handling, and authorized record release.',
                'permissions' => [
                    'patients.view',
                    'patients.update',
                    'medical_records.view',
                    'medical_records.manage',
                    'medical_records.release',
                    'clinical_notes.view',
                ],
            ],
            'laboratory-technician' => [
                'name' => 'Laboratory Technician',
                'description' => 'Laboratory orders, results, and authorized result verification.',
                'permissions' => [
                    'patients.view',
                    'lab.orders.view',
                    'lab.orders.manage',
                    'lab.results.record',
                    'lab.results.verify',
                ],
            ],
            'pharmacist' => [
                'name' => 'Pharmacist / Pharmacy Technician',
                'description' => 'Prescription processing, dispensing, and pharmacy inventory.',
                'permissions' => [
                    'patients.view',
                    'pharmacy.prescriptions.view',
                    'pharmacy.dispense',
                    'pharmacy.stock.view',
                    'pharmacy.stock.manage',
                    'inventory.view',
                ],
            ],
            'facility-manager' => [
                'name' => 'Hospital Administrator / Facility Manager',
                'description' => 'Facility operations, staff coordination, and operational reporting.',
                'permissions' => [
                    'reports.operational.view',
                    'staff.view',
                    'staff.manage',
                    'facility.manage',
                    'inventory.view',
                    'procurement.manage',
                ],
            ],
            'accountant' => [
                'name' => 'Accountant',
                'description' => 'Financial reporting, reconciliation, and controlled financial oversight.',
                'permissions' => [
                    'billing.invoices.view',
                    'billing.payments.view',
                    'billing.refunds.request',
                    'finance.reports.view',
                    'finance.reconciliation.manage',
                    'reports.financial.view',
                ],
            ],
            'auditor' => [
                'name' => 'Auditor',
                'description' => 'Read-only audit and approved financial or operational reporting.',
                'permissions' => [
                    'audit.view',
                    'reports.operational.view',
                    'reports.financial.view',
                    'finance.reports.view',
                    'billing.invoices.view',
                    'billing.payments.view',
                    'releases.view',
                    'settings.view',
                ],
            ],
            'release-manager' => [
                'name' => 'Release Manager',
                'description' => 'Manage the system release lifecycle.',
                'permissions' => [
                    'releases.view',
                    'releases.create',
                    'releases.update',
                    'releases.publish',
                    'releases.withdraw',
                ],
            ],
        ];

        DB::transaction(function () use ($roles): void {
            foreach ($roles as $slug => $definition) {
                $role = Role::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $definition['name'],
                        'description' => $definition['description'],
                        'is_system' => true,
                        'is_active' => true,
                    ],
                );

                $permissionNames = array_values(array_unique($definition['permissions']));

                $permissionIds = Permission::query()
                    ->whereIn('name', $permissionNames)
                    ->pluck('id')
                    ->all();

                if (count($permissionIds) !== count($permissionNames)) {
                    throw new RuntimeException(
                        "Permission catalogue is incomplete for role: {$slug}."
                    );
                }

                // Synchronize seeded system-role mappings; never assign roles to users here.
                $role->permissions()->sync($permissionIds);
            }
        });
    }
}
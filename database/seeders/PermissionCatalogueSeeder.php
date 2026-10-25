<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionCatalogueSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Patient administration
            'patients.view' => ['View patient records', 'patients'],
            'patients.create' => ['Register patients', 'patients'],
            'patients.update' => ['Update patient demographics', 'patients'],
            'patients.archive' => ['Archive patient records under policy', 'patients'],

            // Appointments and front desk
            'appointments.view' => ['View appointments', 'appointments'],
            'appointments.manage' => ['Create and manage appointments', 'appointments'],
            'queues.manage' => ['Manage patient queues and check-in', 'appointments'],
            'referrals.manage' => ['Manage referrals', 'appointments'],

            // Clinical care
            'consultations.view' => ['View clinical consultations', 'clinical'],
            'consultations.manage' => ['Record and manage consultations', 'clinical'],
            'diagnoses.record' => ['Record clinical diagnoses', 'clinical'],
            'treatment_plans.manage' => ['Manage treatment plans', 'clinical'],
            'prescriptions.create' => ['Create prescriptions', 'clinical'],
            'clinical_notes.view' => ['View permitted clinical notes', 'clinical'],
            'clinical_notes.manage' => ['Create and update permitted clinical notes', 'clinical'],
            'clinical_records.correct' => ['Correct clinical records through audited workflows', 'clinical'],

            // Nursing and triage
            'triage.manage' => ['Manage patient triage', 'nursing'],
            'vitals.record' => ['Record patient vital signs', 'nursing'],
            'nursing_notes.manage' => ['Manage nursing notes', 'nursing'],
            'nursing_care.manage' => ['Manage assigned nursing care activities', 'nursing'],

            // Laboratory and diagnostics
            'lab.orders.view' => ['View laboratory orders', 'laboratory'],
            'lab.orders.manage' => ['Manage laboratory orders', 'laboratory'],
            'lab.results.record' => ['Record laboratory results', 'laboratory'],
            'lab.results.verify' => ['Verify laboratory results', 'laboratory'],
            'radiology.manage' => ['Manage permitted radiology workflows', 'diagnostics'],

            // Pharmacy and inventory
            'pharmacy.prescriptions.view' => ['View prescriptions for pharmacy workflows', 'pharmacy'],
            'pharmacy.dispense' => ['Dispense prescribed medicines', 'pharmacy'],
            'pharmacy.stock.view' => ['View pharmacy stock', 'pharmacy'],
            'pharmacy.stock.manage' => ['Manage pharmacy stock', 'pharmacy'],
            'inventory.view' => ['View facility inventory', 'inventory'],
            'inventory.manage' => ['Manage inventory and stock movements', 'inventory'],
            'procurement.manage' => ['Manage procurement workflows', 'inventory'],

            // Billing and finance
            'billing.invoices.view' => ['View billing invoices', 'billing'],
            'billing.invoices.manage' => ['Create and manage billing invoices', 'billing'],
            'billing.payments.view' => ['View payment transactions', 'billing'],
            'billing.payments.record' => ['Record patient payments', 'billing'],
            'billing.refunds.request' => ['Request billing refunds', 'billing'],
            'billing.refunds.approve' => ['Approve authorized billing refunds', 'billing'],
            'finance.reports.view' => ['View financial reports', 'finance'],
            'finance.reconciliation.manage' => ['Manage financial reconciliation', 'finance'],

            // SHA and insurance claims
            'sha.eligibility.verify' => ['Verify SHA eligibility', 'sha'],
            'sha.services.verify' => ['Verify services through authorized SHA workflows', 'sha'],
            'sha.claims.view' => ['View SHA claims', 'sha'],
            'sha.claims.prepare' => ['Prepare SHA claims', 'sha'],
            'sha.claims.submit' => ['Submit SHA claims', 'sha'],
            'sha.claims.reconcile' => ['Reconcile SHA claims and responses', 'sha'],
            'integrations.view' => ['View integration status', 'integrations'],
            'integrations.manage' => ['Manage authorized integration configuration', 'integrations'],

            // Restricted developer tooling (separate from ordinary integration access)
            'developer-tools.view' => ['Access developer tools and technical integration workspaces', 'developer-tools'],
            'developer-tools.manage' => ['Manage developer tools, API keys, environments, and integration tests', 'developer-tools'],

            // Medical records
            'medical_records.view' => ['View permitted medical records', 'medical-records'],
            'medical_records.manage' => ['Manage medical records and documents', 'medical-records'],
            'medical_records.release' => ['Authorize release of medical records', 'medical-records'],

            // Reporting and hospital operations
            'reports.operational.view' => ['View operational reports', 'reports'],
            'reports.clinical.view' => ['View authorized clinical reports', 'reports'],
            'reports.financial.view' => ['View authorized financial reports', 'reports'],
            'facility.manage' => ['Manage facility operational settings', 'facility'],
            'staff.view' => ['View staff directory and assignments', 'staff'],
            'staff.manage' => ['Manage staff accounts and assignments', 'staff'],

            // Users, roles and security
            'users.view' => ['View user accounts', 'access-control'],
            'users.manage' => ['Manage user accounts', 'access-control'],
            'roles.view' => ['View roles and permissions', 'access-control'],
            'roles.manage' => ['Manage roles and permission assignments', 'access-control'],
            'audit.view' => ['View system audit logs', 'security'],
            'security.manage' => ['Manage authorized security configuration', 'security'],

            // IT operations
            'it.support.manage' => ['Provide authorized technical support', 'it'],
            'it.devices.manage' => ['Manage registered devices and peripherals', 'it'],
            'it.backups.manage' => ['Manage and verify system backups', 'it'],
            'it.diagnostics.view' => ['View technical diagnostics and service health', 'it'],

            // System configuration and release management
            'settings.view' => ['View system settings', 'system'],
            'settings.manage' => ['Manage system settings', 'system'],
            'releases.view' => ['View system releases', 'system'],
            'releases.create' => ['Create system releases', 'system'],
            'releases.update' => ['Update draft system releases', 'system'],
            'releases.publish' => ['Publish system releases', 'system'],
            'releases.withdraw' => ['Withdraw published releases', 'system'],
        ];

        foreach ($permissions as $name => [$description, $module]) {
            Permission::query()->updateOrCreate(
                ['name' => $name],
                [
                    'description' => $description,
                    'module' => $module,
                ],
            );
        }
    }
}
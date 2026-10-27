<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoClinicDataSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        /*
         * DEMONSTRATION DATA ONLY.
         * All people, records, claims, stock and requests are fictional.
         * This seeder does not delete existing data.
         */

        DB::transaction(function () use ($now): void {
            $patients = [
                ['Amina', 'Wanjiku', 'Female', '1994-04-12'],
                ['Brian', 'Otieno', 'Male', '1988-09-23'],
                ['Faith', 'Njeri', 'Female', '2001-02-17'],
                ['Kevin', 'Mwangi', 'Male', '1997-07-08'],
                ['Grace', 'Atieno', 'Female', '1976-11-30'],
                ['Daniel', 'Kiptoo', 'Male', '1985-03-19'],
                ['Mary', 'Achieng', 'Female', '1990-06-25'],
                ['Peter', 'Kamau', 'Male', '1968-12-04'],
                ['Esther', 'Wambui', 'Female', '2004-01-16'],
                ['Samuel', 'Maina', 'Male', '1992-08-14'],
                ['Lucy', 'Muthoni', 'Female', '1981-05-21'],
                ['Joseph', 'Omondi', 'Male', '1972-10-09'],
                ['Janet', 'Chebet', 'Female', '1999-03-11'],
                ['David', 'Karanja', 'Male', '1986-01-29'],
                ['Mercy', 'Nyambura', 'Female', '1995-12-18'],
                ['Patrick', 'Mutua', 'Male', '1979-06-03'],
                ['Ruth', 'Adhiambo', 'Female', '2002-04-27'],
                ['Michael', 'Kibet', 'Male', '1991-09-05'],
                ['Anne', 'Wairimu', 'Female', '1965-07-22'],
                ['Francis', 'Barasa', 'Male', '1983-02-13'],
                ['Irene', 'Naliaka', 'Female', '1998-10-01'],
                ['George', 'Muli', 'Male', '1975-08-16'],
                ['Susan', 'Awino', 'Female', '1989-11-07'],
                ['Mark', 'Kipchoge', 'Male', '2000-05-14'],
                ['Beatrice', 'Wekesa', 'Female', '1970-03-28'],
                ['John', 'Mbugua', 'Male', '1993-12-09'],
                ['Caroline', 'Jebet', 'Female', '1987-06-17'],
                ['Anthony', 'Owino', 'Male', '1969-04-06'],
                ['Rose', 'Wanjiru', 'Female', '1996-01-24'],
                ['Elijah', 'Musyoka', 'Male', '1980-09-12'],
            ];

            $patientIds = [];

            foreach ($patients as $index => [$first, $last, $sex, $dob]) {
                $mrn = sprintf('DEMO-MRN-%04d', $index + 1);

                DB::table('patients')->updateOrInsert(
                    ['medical_record_number' => $mrn],
                    [
                        'public_id' => DB::table('patients')
                            ->where('medical_record_number', $mrn)
                            ->value('public_id') ?? (string) Str::uuid(),
                        'registration_source' => 'local',
                        'first_name' => $first,
                        'middle_name' => null,
                        'last_name' => $last,
                        'full_name' => "{$first} {$last}",
                        'date_of_birth' => $dob,
                        'sex' => $sex,
                        'gender' => $sex,
                        'phone' => sprintf('+254700%06d', $index + 100001),
                        'email' => strtolower($first . '.' . $last) . '.demo@example.test',
                        'preferred_language' => 'English',
                        'nationality' => 'Kenyan',
                        'county' => 'Nairobi',
                        'sub_county' => 'Embakasi',
                        'ward' => 'Demo Ward',
                        'address' => 'Fictional demonstration address',
                        'emergency_contact_name' => 'Demo Emergency Contact',
                        'emergency_contact_relationship' => 'Relative',
                        'emergency_contact_phone' => sprintf('+254711%06d', $index + 100001),
                        'status' => 'active',
                        'is_deceased' => false,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );

                $patientIds[] = DB::table('patients')
                    ->where('medical_record_number', $mrn)
                    ->value('id');
            }

            /*
             * Encounters: 45 linked records with varied dates,
             * visit types, statuses, coverage and workflow states.
             */
            $encounterIds = [];

            $statuses = [
                'registered', 'triaged', 'in_progress', 'completed',
                'completed', 'cancelled',
            ];

            $departments = [
                'General Outpatient',
                'Maternity',
                'Paediatrics',
                'Laboratory',
                'Medical Ward',
                'Emergency',
            ];

            $complaints = [
                'Routine clinical assessment',
                'Fever and headache',
                'Abdominal discomfort',
                'Antenatal review',
                'Cough and fatigue',
                'Follow-up consultation',
                'Blood pressure review',
                'General wellness assessment',
            ];

            for ($i = 1; $i <= 45; $i++) {
                $patientId = $patientIds[($i - 1) % count($patientIds)];
                $status = $statuses[($i - 1) % count($statuses)];
                $visitType = $i % 7 === 0 ? 'inpatient' : 'outpatient';
                $coverage = $i % 3 === 0 ? 'sha' : ($i % 3 === 1 ? 'cash' : 'private');
                $arrivedAt = $now->copy()->subDays(($i - 1) % 35)
                    ->setTime(8 + ($i % 9), ($i * 7) % 60);

                $claimStatus = $coverage === 'sha'
                    ? ['draft', 'pending', 'submitted', 'rejected'][($i - 1) % 4]
                    : null;

                $invoiceStatus = $status === 'completed'
                    ? ($coverage === 'sha' ? 'issued' : 'issued')
                    : 'draft';

                $number = sprintf('DEMO-ENC-%05d', $i);

                DB::table('encounters')->updateOrInsert(
                    ['encounter_number' => $number],
                    [
                        'public_id' => DB::table('encounters')
                            ->where('encounter_number', $number)
                            ->value('public_id') ?? (string) Str::uuid(),
                        'patient_id' => $patientId,
                        'visit_type' => $visitType,
                        'status' => $status,
                        'priority' => $i % 9 === 0 ? 'urgent' : 'routine',
                        'arrived_at' => $arrivedAt,
                        'triaged_at' => in_array($status, ['triaged', 'in_progress', 'completed'], true)
                            ? $arrivedAt->copy()->addMinutes(15)
                            : null,
                        'started_at' => in_array($status, ['in_progress', 'completed'], true)
                            ? $arrivedAt->copy()->addMinutes(30)
                            : null,
                        'completed_at' => $status === 'completed'
                            ? $arrivedAt->copy()->addHours(2)
                            : null,
                        'department' => $departments[($i - 1) % count($departments)],
                        'chief_complaint' => $complaints[($i - 1) % count($complaints)],
                        'notes' => 'DEMO DATA — fictional encounter; not a clinical record.',
                        'clinical_assessment' => $status === 'completed'
                            ? 'DEMO DATA — fictional assessment for interface testing.'
                            : null,
                        'icd11_code' => null,
                        'icd11_display' => null,
                        'payment_type' => $coverage,
                        'coverage_type' => $coverage,
                        'sha_eligibility_status' => $coverage === 'sha' ? 'demo_unverified' : null,
                        'claim_status' => $claimStatus,
                        'claim_reference' => $claimStatus === 'submitted'
                            ? sprintf('DEMO-CLAIM-%05d', $i)
                            : null,
                        'claim_submitted_at' => $claimStatus === 'submitted'
                            ? $arrivedAt->copy()->addHours(3)
                            : null,
                        'invoice_status' => $invoiceStatus,
                        'invoice_total' => $status === 'completed'
                            ? number_format(500 + (($i * 275) % 8500), 2, '.', '')
                            : null,
                        'billing_items' => json_encode([
                            [
                                'description' => 'DEMO consultation item',
                                'quantity' => 1,
                                'unit_price' => 500 + (($i * 275) % 8500),
                                'demo' => true,
                            ],
                        ]),
                        'finished_at' => $status === 'completed'
                            ? $arrivedAt->copy()->addHours(2)
                            : null,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );

                $encounterIds[] = DB::table('encounters')
                    ->where('encounter_number', $number)
                    ->value('id');
            }

            /*
             * Appointments. Requires the appointments migration
             * from the appointment feature to have been run.
             */
            if (DB::getSchemaBuilder()->hasTable('appointments')) {
                $appointmentStatuses = [
                    'scheduled', 'scheduled', 'checked_in',
                    'completed', 'cancelled',
                ];

                for ($i = 1; $i <= 30; $i++) {
                    $patientId = $patientIds[($i * 3 - 1) % count($patientIds)];
                    $scheduledAt = $now->copy()->addDays(($i % 11) - 5)
                        ->setTime(9 + ($i % 8), ($i * 10) % 60);
                    $number = sprintf('DEMO-APT-%05d', $i);

                    DB::table('appointments')->updateOrInsert(
                        ['appointment_number' => $number],
                        [
                            'patient_id' => $patientId,
                            'scheduled_at' => $scheduledAt,
                            'visit_type' => $i % 8 === 0 ? 'inpatient' : 'outpatient',
                            'department' => $departments[($i - 1) % count($departments)],
                            'priority' => $i % 10 === 0 ? 'urgent' : 'routine',
                            'status' => $appointmentStatuses[($i - 1) % count($appointmentStatuses)],
                            'reason' => 'DEMO DATA — fictional appointment reason.',
                            'notes' => 'Synthetic appointment for interface testing only.',
                            'assigned_to' => null,
                            'created_by' => null,
                            'updated_at' => $now,
                            'created_at' => $now,
                        ]
                    );
                }
            }

            /*
             * Inventory catalogue and balances.
             */
            $items = [
                ['DEMO-MED-001', 'Paracetamol 500mg tablets', 'Medicines', 'tablet', 1200, 200, 2.50, 'Main Pharmacy'],
                ['DEMO-MED-002', 'Amoxicillin 500mg capsules', 'Medicines', 'capsule', 350, 100, 8.00, 'Main Pharmacy'],
                ['DEMO-MED-003', 'Oral rehydration salts', 'Medicines', 'sachet', 180, 50, 18.00, 'Main Pharmacy'],
                ['DEMO-MED-004', 'Normal saline 0.9%', 'IV Fluids', 'bottle', 65, 20, 150.00, 'Treatment Store'],
                ['DEMO-LAB-001', 'Examination gloves', 'Laboratory supplies', 'box', 45, 15, 650.00, 'Laboratory Store'],
                ['DEMO-LAB-002', 'Blood collection tubes', 'Laboratory supplies', 'pack', 22, 10, 420.00, 'Laboratory Store'],
                ['DEMO-LAB-003', 'Rapid test kits', 'Laboratory supplies', 'kit', 12, 15, 900.00, 'Laboratory Store'],
                ['DEMO-CONS-001', 'Surgical masks', 'Consumables', 'box', 80, 20, 300.00, 'General Store'],
                ['DEMO-CONS-002', 'Syringes 5ml', 'Consumables', 'piece', 400, 100, 12.00, 'Treatment Store'],
                ['DEMO-CONS-003', 'Cotton wool', 'Consumables', 'roll', 28, 10, 180.00, 'General Store'],
                ['DEMO-EQ-001', 'Digital thermometer', 'Equipment', 'piece', 8, 3, 850.00, 'Triage'],
                ['DEMO-EQ-002', 'Blood pressure cuff', 'Equipment', 'piece', 4, 2, 2400.00, 'Triage'],
            ];

            foreach ($items as [$sku, $name, $category, $unit, $qty, $reorder, $cost, $location]) {
                DB::table('inventory_items')->updateOrInsert(
                    ['sku' => $sku],
                    [
                        'name' => $name,
                        'category' => $category,
                        'unit' => $unit,
                        'quantity_on_hand' => $qty,
                        'reorder_level' => $reorder,
                        'unit_cost' => $cost,
                        'location' => $location,
                        'supplier_name' => 'DEMO Supplier Ltd',
                        'is_active' => true,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );
            }

            /*
             * Seed movements only if a demo reference is not present.
             * Quantity change is positive for demo opening stock.
             */
            $inventoryItems = DB::table('inventory_items')
                ->where('sku', 'like', 'DEMO-%')
                ->get();

            foreach ($inventoryItems as $item) {
                $reference = 'DEMO-OPENING-' . $item->sku;

                $exists = DB::table('inventory_movements')
                    ->where('reference', $reference)
                    ->exists();

                if (! $exists) {
                    DB::table('inventory_movements')->insert([
                        'inventory_item_id' => $item->id,
                        'movement_type' => 'opening',
                        'quantity_change' => $item->quantity_on_hand,
                        'balance_after' => $item->quantity_on_hand,
                        'reference' => $reference,
                        'notes' => 'DEMO DATA — synthetic opening balance.',
                        'performed_by' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }

            /*
             * Procurement pipeline with varied statuses.
             */
            $requests = [
                ['DEMO-PR-001', 'Paracetamol 500mg tablets', 'Medicines', 500, 'tablet', 2.50, 'pending', 'normal'],
                ['DEMO-PR-002', 'Examination gloves', 'Laboratory supplies', 30, 'box', 650, 'approved', 'high'],
                ['DEMO-PR-003', 'Rapid test kits', 'Laboratory supplies', 20, 'kit', 900, 'pending', 'urgent'],
                ['DEMO-PR-004', 'Surgical masks', 'Consumables', 50, 'box', 300, 'ordered', 'normal'],
                ['DEMO-PR-005', 'Blood collection tubes', 'Laboratory supplies', 25, 'pack', 420, 'received', 'high'],
                ['DEMO-PR-006', 'Digital thermometers', 'Equipment', 5, 'piece', 850, 'rejected', 'normal'],
                ['DEMO-PR-007', 'Normal saline 0.9%', 'IV Fluids', 100, 'bottle', 150, 'pending', 'high'],
                ['DEMO-PR-008', 'Cotton wool', 'Consumables', 40, 'roll', 180, 'approved', 'normal'],
            ];

            foreach ($requests as [$number, $description, $category, $qty, $unit, $cost, $status, $priority]) {
                DB::table('procurement_requests')->updateOrInsert(
                    ['request_number' => $number],
                    [
                        'item_description' => $description,
                        'category' => $category,
                        'quantity' => $qty,
                        'unit' => $unit,
                        'estimated_unit_cost' => $cost,
                        'supplier_name' => 'DEMO Supplier Ltd',
                        'priority' => $priority,
                        'status' => $status,
                        'justification' => 'DEMO DATA — fictional procurement request for workflow testing.',
                        'review_notes' => in_array($status, ['approved', 'ordered', 'received'], true)
                            ? 'Demo approval only; no real purchase was made.'
                            : null,
                        'requested_by' => null,
                        'reviewed_by' => null,
                        'reviewed_at' => in_array($status, ['approved', 'ordered', 'received', 'rejected'], true)
                            ? $now
                            : null,
                        'received_at' => $status === 'received' ? $now : null,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );
            }
        });

        $this->command?->info('Demo clinic data seeded successfully. All inserted records are fictional.');
        $this->command?->warn('Demo SHA claim states are local examples only; no claims were submitted to SHA.');
    }
}

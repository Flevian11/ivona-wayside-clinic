<?php

/*
 | Synthetic-only development fixtures. Never use as real SHA/DHA records.
 | National-ID fields below are fictional test tokens, not valid Kenyan ID numbers.
 | OTP/consent/biometric entries are local workflow simulations, not provider API contract fixtures.
 */
return [
    'patients' => [
        'DEV-NID-1001' => [
            'id' => 'DEV-CR-001', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1001', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'AMANI', 'middle_name' => 'SAMPLE', 'last_name' => 'TESTER',
            'date_of_birth' => '1979-02-02', 'gender' => 'male',
            'phone' => '0700000001', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 4, 'result' => [
                    ['id' => 'DEV-DEP-01-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF AMANI', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-01-02', 'first_name' => 'CHILD2', 'middle_name' => null, 'last_name' => 'OF AMANI', 'date_of_birth' => '2014-02-03', 'gender' => 'female', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-01-03', 'first_name' => 'CHILD3', 'middle_name' => null, 'last_name' => 'OF AMANI', 'date_of_birth' => '2015-03-04', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-01-04', 'first_name' => 'CHILD4', 'middle_name' => null, 'last_name' => 'OF AMANI', 'date_of_birth' => '2016-04-05', 'gender' => 'female', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-01',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1002' => [
            'id' => 'DEV-CR-002', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1002', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'BARAKA', 'middle_name' => 'SAMPLE', 'last_name' => 'SAMPLE',
            'date_of_birth' => '1980-03-03', 'gender' => 'unknown',
            'phone' => '0700000002', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 1, 'result' => [
                    ['id' => 'DEV-DEP-02-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF BARAKA', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-02',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1003' => [
            'id' => 'DEV-CR-003', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1003', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'CHERONO', 'middle_name' => 'SAMPLE', 'last_name' => 'DEMO',
            'date_of_birth' => '1981-04-04', 'gender' => 'female',
            'phone' => '0700000003', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 2, 'result' => [
                    ['id' => 'DEV-DEP-03-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF CHERONO', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-03-02', 'first_name' => 'CHILD2', 'middle_name' => null, 'last_name' => 'OF CHERONO', 'date_of_birth' => '2014-02-03', 'gender' => 'female', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-03',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1004' => [
            'id' => 'DEV-CR-004', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1004', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'DANIEL', 'middle_name' => 'SAMPLE', 'last_name' => 'MOCK',
            'date_of_birth' => '1982-05-05', 'gender' => 'male',
            'phone' => '0700000004', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-04',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1005' => [
            'id' => 'DEV-CR-005', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1005', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'ESHA', 'middle_name' => 'SAMPLE', 'last_name' => 'FIXTURE',
            'date_of_birth' => '1983-06-06', 'gender' => 'unknown',
            'phone' => '0700000005', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-05',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1006' => [
            'id' => 'DEV-CR-006', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1006', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'FARIDA', 'middle_name' => 'SAMPLE', 'last_name' => 'SYNTHETIC',
            'date_of_birth' => '1984-07-07', 'gender' => 'female',
            'phone' => '0700000006', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 3, 'result' => [
                    ['id' => 'DEV-DEP-06-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF FARIDA', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-06-02', 'first_name' => 'CHILD2', 'middle_name' => null, 'last_name' => 'OF FARIDA', 'date_of_birth' => '2014-02-03', 'gender' => 'female', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-06-03', 'first_name' => 'CHILD3', 'middle_name' => null, 'last_name' => 'OF FARIDA', 'date_of_birth' => '2015-03-04', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-06',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1007' => [
            'id' => 'DEV-CR-007', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1007', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'GIDEON', 'middle_name' => 'SAMPLE', 'last_name' => 'SANDBOX',
            'date_of_birth' => '1985-08-08', 'gender' => 'male',
            'phone' => '0700000007', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-07',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1008' => [
            'id' => 'DEV-CR-008', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1008', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'HALIMA', 'middle_name' => 'SAMPLE', 'last_name' => 'EXAMPLE',
            'date_of_birth' => '1986-09-09', 'gender' => 'unknown',
            'phone' => '0700000008', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 1, 'result' => [
                    ['id' => 'DEV-DEP-08-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF HALIMA', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-08',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1009' => [
            'id' => 'DEV-CR-009', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1009', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'IMANI', 'middle_name' => 'SAMPLE', 'last_name' => 'TRAINING',
            'date_of_birth' => '1987-10-10', 'gender' => 'female',
            'phone' => '0700000009', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-09',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1010' => [
            'id' => 'DEV-CR-010', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1010', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'JABALI', 'middle_name' => 'SAMPLE', 'last_name' => 'QA',
            'date_of_birth' => '1988-11-11', 'gender' => 'male',
            'phone' => '0700000010', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-10',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1011' => [
            'id' => 'DEV-CR-011', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1011', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'KENDI', 'middle_name' => 'SAMPLE', 'last_name' => 'UAT',
            'date_of_birth' => '1989-12-12', 'gender' => 'unknown',
            'phone' => '0700000011', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 2, 'result' => [
                    ['id' => 'DEV-DEP-11-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF KENDI', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                    ['id' => 'DEV-DEP-11-02', 'first_name' => 'CHILD2', 'middle_name' => null, 'last_name' => 'OF KENDI', 'date_of_birth' => '2014-02-03', 'gender' => 'female', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-11',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1012' => [
            'id' => 'DEV-CR-012', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1012', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'LEAH', 'middle_name' => 'SAMPLE', 'last_name' => 'DEV',
            'date_of_birth' => '1990-01-13', 'gender' => 'female',
            'phone' => '0700000012', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-12',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1013' => [
            'id' => 'DEV-CR-013', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1013', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'MALIK', 'middle_name' => 'SAMPLE', 'last_name' => 'CLINIC',
            'date_of_birth' => '1991-02-14', 'gender' => 'male',
            'phone' => '0700000013', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-13',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1014' => [
            'id' => 'DEV-CR-014', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1014', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'NIA', 'middle_name' => 'SAMPLE', 'last_name' => 'PATIENT',
            'date_of_birth' => '1992-03-15', 'gender' => 'unknown',
            'phone' => '0700000014', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
                ['relationship' => 'child', 'date_added' => '2026-01-01', 'total' => 1, 'result' => [
                    ['id' => 'DEV-DEP-14-01', 'first_name' => 'CHILD1', 'middle_name' => null, 'last_name' => 'OF NIA', 'date_of_birth' => '2013-01-02', 'gender' => 'male', 'relationship' => 'child', 'relationship_status' => 'confirmed'],
                ]],
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-14',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
        'DEV-NID-1015' => [
            'id' => 'DEV-CR-015', 'resourceType' => 'Patient',
            'identifier' => [['type' => 'National ID', 'value' => 'DEV-NID-1015', 'system' => 'urn:ivona:development-test-id']],
            'first_name' => 'OMARI', 'middle_name' => 'SAMPLE', 'last_name' => 'RECORD',
            'date_of_birth' => '1993-04-16', 'gender' => 'female',
            'phone' => '0700000015', 'county' => 'DEVELOPMENT ONLY', 'sub_county' => 'SYNTHETIC TEST AREA',
            'meta' => ['versionId' => 'DEV-1', 'source' => 'synthetic-development-fixture'],
            'dependants' => [
            ], 'unconfirmed_dependants' => [],
            'mock' => true, 'fixture_id' => 'FIXTURE-15',
            'note' => 'Synthetic fixture only. No SHA/DHA provider was contacted.',
        ],
    ],
    'otp' => [
        'valid_test_code' => '246810',
        'note' => 'Synthetic local OTP for development tests only; never a real provider OTP.',
    ],
    'consent_scenarios' => [
        'granted' => ['status' => 'granted', 'method' => 'electronic', 'mock' => true],
        'pending' => ['status' => 'pending', 'method' => 'electronic', 'mock' => true],
        'denied' => ['status' => 'denied', 'method' => 'electronic', 'mock' => true],
    ],
    'biometric_scenarios' => [
        'not_enrolled' => ['status' => 'not_enrolled', 'match' => null, 'biometric_template_stored' => false, 'mock' => true],
        'match' => ['status' => 'simulated_match', 'match' => true, 'biometric_template_stored' => false, 'mock' => true],
        'no_match' => ['status' => 'simulated_no_match', 'match' => false, 'biometric_template_stored' => false, 'mock' => true],
    ],
];

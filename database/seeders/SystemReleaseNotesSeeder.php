<?php

namespace Database\Seeders;

use App\Models\SystemRelease;
use Illuminate\Database\Seeder;

class SystemReleaseNotesSeeder extends Seeder
{
    public function run(): void
    {
        $releases = [
            [
                'version' => '0.1.0',
                'title' => 'Ivona Wayside Clinic HMIS — Platform Foundation',
                'release_type' => 'minor',
                'summary' => 'The initial platform foundation establishes the core application structure, facility identity, access control foundations, and connected patient, encounter, and billing workflows.',
                'release_notes' => implode("\n\n", [
                    'This release establishes the application foundation and the first connected workflows for the Ivona Wayside Clinic HMIS. It provides a structured starting point for organizing clinic operations while keeping security, auditability, and future interoperability in view.',
                    'The application uses Laravel and PHP for server-side request handling and business rules, Inertia.js with React and TypeScript for the user experience, and PostgreSQL as the intended operational database.',
                    'This release is a platform foundation, not a declaration that every hospital workflow or external certification requirement is complete.',
                ]),
                'features' => [
                    'Facility identity and public-facing information can be maintained through administration settings.',
                    'Facility branding supports separate logo and favicon management through image uploads.',
                    'Initial patient registration and patient record foundations support a consistent patient identity workflow.',
                    'Encounter workflow foundations connect patient records to clinical visits.',
                    'Initial invoice workflow foundations establish the relationship between clinical activity and billing records.',
                    'Versioned release notes provide a structured changelog for communicating system updates.',
                    'Public website routes provide entry points for clinic information, services, contact information, terms, privacy, and data-protection information.',
                ],
                'improvements' => [
                    'Application responsibilities are separated across Laravel controllers, models, routes, and Inertia/TSX pages.',
                    'Role and permission infrastructure provides a foundation for server-side authorization.',
                    'Development-only simulated integrations are distinguished from live external service boundaries.',
                ],
                'bug_fixes' => [
                    'Logo and favicon management are designed as independent actions.',
                ],
                'security_notes' => [
                    'Production deployment requires secure environment secrets, HTTPS, appropriate access controls, and protected storage.',
                    'This release does not certify the system as DHA-accredited or SHA production-integrated.',
                ],
                'known_issues' => [
                    'Clinical, nursing, laboratory, pharmacy, inventory, financial reconciliation, and external integration workflows require further verification before production readiness can be established.',
                ],
                'minimum_php_version' => '8.3',
                'minimum_database_version' => 'PostgreSQL 18',
            ],
            [
                'version' => '0.2.0',
                'title' => 'Administration and Facility Configuration',
                'release_type' => 'minor',
                'summary' => 'An administration-focused release emphasizing facility configuration, branding management, and clearer system administration workflows.',
                'release_notes' => implode("\n\n", [
                    'This release groups the facility administration and configuration improvements into a distinct milestone in the application history.',
                    'The objective is to make the clinic’s identity and operational configuration easier to manage centrally, reducing the need to modify application code for routine facility information changes.',
                    'The release history records these improvements separately from the initial platform foundation so administrators can review the evolution of configuration capabilities.',
                ]),
                'features' => [
                    'Central facility settings for maintaining clinic identity and public-facing information.',
                    'Separate controls for facility logo and favicon management.',
                    'A dedicated administration area for accessing facility configuration.',
                ],
                'improvements' => [
                    'Administration forms are organized around facility configuration tasks.',
                    'Branding changes can be managed without requiring externally hosted image URLs when the upload workflow is configured.',
                    'The release history distinguishes administration improvements from the original platform foundation.',
                ],
                'bug_fixes' => [
                    'Independent branding actions reduce the risk of unintentionally changing one asset while updating another.',
                ],
                'security_notes' => [
                    'Access to facility settings and branding uploads must be restricted through server-side authorization.',
                    'Uploaded files must be validated and stored using the application’s configured storage controls.',
                ],
                'known_issues' => [
                    'Deployment-specific configuration, permissions, and upload behavior must be verified in the target environment.',
                ],
                'minimum_php_version' => '8.3',
                'minimum_database_version' => 'PostgreSQL 18',
            ],
            [
                'version' => '0.3.0',
                'title' => 'Release History and Workflow Refinements',
                'release_type' => 'minor',
                'summary' => 'A release focused on version history, clearer release communication, and refinements to the foundations of patient, encounter, and billing workflows.',
                'release_notes' => implode("\n\n", [
                    'This release provides a separate milestone for the system’s release communication and workflow refinement efforts.',
                    'The changelog is intended to help administrators and users understand what changed between versions, including newly introduced capabilities, improvements, fixes, security considerations, and known limitations.',
                    'Patient, encounter, and billing foundations remain subject to clinical workflow validation, integration testing, and operational acceptance before being considered production-ready.',
                ]),
                'features' => [
                    'Version-specific release records provide a history of published application updates.',
                    'Release notes are organized into features, improvements, bug fixes, security notes, and known issues.',
                    'Previous release records can be reviewed independently when they are published and available.',
                ],
                'improvements' => [
                    'Release communication separates the initial platform foundation from later administration and workflow refinements.',
                    'Release summaries provide a concise overview while detailed notes preserve additional context.',
                    'Semantic version values provide a consistent way to identify application releases.',
                ],
                'bug_fixes' => [
                    'Release records are keyed by version during seeding to avoid duplicate records when the same seeder is run again.',
                ],
                'security_notes' => [
                    'Only authorized users should be able to create, edit, publish, or withdraw release records.',
                    'Release notes must accurately represent delivered changes and must not imply unverified external integrations or certifications.',
                ],
                'known_issues' => [
                    'The completeness of release history depends on the release records actually entered and published.',
                    'All clinical workflows and SHA/DHA integration behavior require independent testing and verification.',
                ],
                'minimum_php_version' => '8.3',
                'minimum_database_version' => 'PostgreSQL 18',
            ],
        ];

        foreach ($releases as $data) {
            $version = $data['version'];
            unset($data['version']);

            $release = SystemRelease::query()->updateOrCreate(
                ['version' => $version],
                $data,
            );

            $release->forceFill([
                'status' => 'published',
                'published_at' => $release->published_at ?? now(),
                'withdrawn_at' => null,
            ])->save();
        }
    }
}

# Ivona Wayside Clinic — Developer Tools UI & Environment Architecture Patch v5

This patch replaces the single crowded Developer Tools page with separate Inertia pages and a dedicated sidebar dropdown. It includes the environment-aware integration foundation from v4 and fixes the existing controller/routes mismatch.

## Files and pages
- `/developer-tools` — Integration overview
- `/developer-tools/inbound-keys` — Partner API access and human-readable scopes
- `/developer-tools/integrations` — Provider profiles
- `/developer-tools/integrations/{id}/environments` — Development/UAT/Production settings for one provider
- `/developer-tools/hie` — official SHA/DHA/HIE references
- `/developer-tools/testing` — read-only API testing console
- `/developer-tools/activity` — safe integration activity history

## Apply on Windows PowerShell
1. Back up `D:\ivona-wayside-clinic`.
2. Save the patch ZIP to your Downloads folder.
3. Extract and overlay using the PowerShell script in the accompanying response. It backs up overwritten files and excludes `.env` and `.git`.
4. Run `php artisan migrate` (never `migrate:fresh`). The included migrations are timestamped after the v4 migrations.
5. Ensure `IWC_INTEGRATION_ENVIRONMENT` is set per deployment to `development`, `uat`, or `production`. Development uses deterministic mock responses. UAT and Production use configured real endpoints and never silently fall back to mock.

## Important operational details
- The environment being edited in the UI is not the running application environment. Runtime mode comes from server configuration.
- Production TLS verification is mandatory. Do not enable a live profile until provider onboarding and approvals are complete.
- Secrets are write-only in the UI; blank secret fields preserve existing values.
- API testing only allows documented read-only operations. Never use real patient data in the testing console.
- Future clinical, billing and claims workflows must call `EnvironmentAwareIntegrationService`; they must not embed provider credentials or ad-hoc HTTP calls.
- Official documentation links are in the HIE page and `INTEGRATION-ENVIRONMENTS.md`. Do not invent provider-issued scopes, token endpoints or production URLs.

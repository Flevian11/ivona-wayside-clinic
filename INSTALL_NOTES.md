Ivona Wayside Clinic — Visit Runtime Fix

Apply from the Laravel project root. Archive paths are project-relative (app/, routes/, resources/), with no wrapper directory and no database migration.

Fixes:
- Guards all visit page collection rendering against undefined/non-array values, including billing items, wizard steps, diagnosis results, benefits, sub-benefits, and documents. This prevents the React .map crash when moving from ICD-11 selection to the next wizard stage.
- Adds/retains PatientOperationsController::refreshVisitBenefits and the POST /visits/{encounter}/benefits/refresh route. The action is SHA-only, checks the patient's Client Registry ID and identifier, calls the existing environment-aware DHA HIE gateway, uses the configured development mock, and fails explicitly in UAT/production rather than falling back to mock.
- Keeps invoice download and existing visit controls in the controller/page.

After extraction:
  php artisan optimize:clear
  php -l app/Http/Controllers/PatientOperationsController.php
  php artisan route:list --path=visits
  npm run build

If refresh returns 403, the logged-in user needs the appropriate appointments.manage or sha.eligibility.verify permission. Do not remove authorization middleware to bypass that check.

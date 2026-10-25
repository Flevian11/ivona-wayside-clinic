<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\Patient;
use App\Models\PatientIdentifier;
use App\Models\PatientIntegrationTransaction;
use App\Services\Integrations\EnvironmentAwareIntegrationService;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PatientController extends Controller
{
    public function index(Request $request): Response
    {
        $term = trim((string) $request->query('q', ''));
        $identifierHash = $term !== '' ? hash('sha256', strtoupper(preg_replace('/\s+/', '', $term))) : null;
        $patients = Patient::query()->withCount('encounters')
            ->when($term !== '', function ($q) use ($term, $identifierHash): void {
                $q->where(function ($nested) use ($term, $identifierHash): void {
                    $nested->search($term)->orWhereHas('identifiers', fn ($ids) => $ids->where('value_hash', $identifierHash));
                });
            })
            ->latest('updated_at')->paginate(15)->withQueryString()
            ->through(fn (Patient $patient) => [
                'id' => $patient->id, 'medical_record_number' => $patient->medical_record_number,
                'full_name' => $patient->full_name ?: trim(implode(' ', array_filter([$patient->first_name, $patient->middle_name, $patient->last_name]))),
                'date_of_birth' => $patient->date_of_birth?->toDateString(), 'phone' => $patient->phone,
                'registration_source' => $patient->registration_source, 'status' => $patient->status,
                'encounters_count' => $patient->encounters_count,
            ]);
        return Inertia::render('patients/index', ['patients' => $patients, 'filters' => ['q' => $term], 'can' => ['register' => $request->user()->can('patients.create')]]);
    }

    public function duplicateCheck(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'query' => ['nullable', 'string', 'max:120'],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'phone' => ['nullable', 'string', 'max:40'],
            'identifier_type' => ['nullable', 'string', 'max:40'],
            'identifier_number' => ['nullable', 'string', 'max:100'],
        ]);
        $term = trim((string) ($data['query'] ?? ''));
        $query = Patient::query()->withCount('encounters')->where(function ($outer) use ($term, $data): void {
            $hasCondition = false;
            if ($term !== '') {
                $hash = hash('sha256', strtoupper(preg_replace('/\s+/', '', $term)));
                $outer->where(function ($q) use ($term, $hash): void {
                    $q->search($term)->orWhereHas('identifiers', fn ($ids) => $ids->where('value_hash', $hash));
                });
                $hasCondition = true;
            }
            if (! empty($data['date_of_birth'])) { $hasCondition ? $outer->orWhereDate('date_of_birth', $data['date_of_birth']) : $outer->whereDate('date_of_birth', $data['date_of_birth']); $hasCondition = true; }
            if (! empty($data['phone'])) { $hasCondition ? $outer->orWhere('phone', trim($data['phone'])) : $outer->where('phone', trim($data['phone'])); $hasCondition = true; }
            if (! empty($data['identifier_number']) && ! empty($data['identifier_type'])) {
                $hash = hash('sha256', strtoupper(preg_replace('/\s+/', '', trim($data['identifier_number']))));
                $hasCondition ? $outer->orWhereHas('identifiers', fn ($ids) => $ids->where('type', $data['identifier_type'])->where('value_hash', $hash)) : $outer->whereHas('identifiers', fn ($ids) => $ids->where('type', $data['identifier_type'])->where('value_hash', $hash));
                $hasCondition = true;
            }
            if (! $hasCondition) $outer->whereRaw('1 = 0');
        });
        $matches = $query->latest('updated_at')->limit(8)->get()->map(fn (Patient $patient) => [
            'id' => $patient->id,
            'medical_record_number' => $patient->medical_record_number,
            'full_name' => $patient->full_name ?: trim(implode(' ', array_filter([$patient->first_name, $patient->middle_name, $patient->last_name]))),
            'date_of_birth' => $patient->date_of_birth?->toDateString(),
            'phone' => $patient->phone,
            'registration_source' => $patient->registration_source,
            'status' => $patient->status,
            'encounters_count' => $patient->encounters_count,
        ]);
        return response()->json(['matches' => $matches, 'count' => $matches->count()]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('patients/create', [
            'can' => ['register' => $request->user()->can('patients.create'), 'shaLookup' => $request->user()->can('patients.create')],
            'integrationMode' => app(EnvironmentAwareIntegrationService::class)->environment(),
        ]);
    }

    public function store(Request $request, EnvironmentAwareIntegrationService $gateway): RedirectResponse
    {
        $validated = $request->validate([
            'registration_source' => ['required', Rule::in(['local', 'sha'])],
            'identifier_type' => ['nullable', 'required_if:registration_source,sha', Rule::in(['National ID', 'ClientRegistry ID', 'Birth Certificate', 'Birth Notification', 'Alien ID', 'Passport', 'Medical Record Number'])],
            'identifier_number' => ['nullable', 'required_if:registration_source,sha', 'string', 'max:100'],
            'client_registry_id' => ['nullable', 'string', 'max:100'],
            'first_name' => ['nullable', 'string', 'max:100'], 'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'], 'full_name' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'], 'sex' => ['nullable', 'string', 'max:24'],
            'gender' => ['nullable', 'string', 'max:32'], 'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:255'], 'preferred_language' => ['nullable', 'string', 'max:40'],
            'nationality' => ['nullable', 'string', 'max:80'], 'county' => ['nullable', 'string', 'max:100'],
            'sub_county' => ['nullable', 'string', 'max:100'], 'ward' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:2000'], 'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:80'], 'emergency_contact_phone' => ['nullable', 'string', 'max:40'],
            'principal_member_patient_id' => ['nullable', 'integer', 'exists:patients,id'],
            'principal_member_client_registry_id' => ['nullable', 'string', 'max:100'],
            'relationship_type' => ['nullable', 'string', 'max:40'],
            'authorization_challenge_id' => ['nullable', 'string', 'uuid'],
            'create_visit' => ['sometimes', 'boolean'], 'visit_type' => ['nullable', Rule::in(['outpatient', 'inpatient', 'emergency', 'follow_up', 'procedure'])],
            'chief_complaint' => ['nullable', 'string', 'max:255'], 'department' => ['nullable', 'string', 'max:100'],
            'sha_benefit_code' => ['nullable', 'string', 'max:100'], 'sha_benefit_name' => ['nullable', 'string', 'max:255'],
            'sha_preauthorization_status' => ['nullable', 'string', 'max:40'],
            'payment_type' => ['nullable', Rule::in(['cash','sha','private_insurance','corporate','exempt','other'])],
            'coverage_type' => ['nullable', Rule::in(['sha','private_insurance','corporate','self_pay','other'])],
            'consent_type' => ['nullable','string','max:48'], 'consent_status' => ['nullable', Rule::in(['granted','denied','pending'])],
            'consent_method' => ['nullable', Rule::in(['written','verbal','electronic','guardian'])],
        ]);

        // Any SHA visit must have completed one server-side authorization method (OTP OR biometric).
        // A browser flag alone is never sufficient to authorize encounter creation.
        if (($validated['registration_source'] ?? null) === 'sha' && ! empty($validated['create_visit'])) {
            $challengeId = (string) ($validated['authorization_challenge_id'] ?? '');
            $authorization = $request->session()->get('patient_principal_authorization');
            $expectedDependent = (string) ($validated['client_registry_id'] ?? '');
            $expectedPrincipal = filled($validated['principal_member_client_registry_id'] ?? null)
                ? (string) $validated['principal_member_client_registry_id']
                : $expectedDependent;
            if (! is_array($authorization)
                || ! hash_equals((string) ($authorization['challenge_id'] ?? ''), $challengeId)
                || ! hash_equals((string) ($authorization['dependent_registry_id'] ?? ''), $expectedDependent)
                || ! hash_equals((string) ($authorization['principal_registry_id'] ?? ''), $expectedPrincipal)
                || (int) ($authorization['expires_at'] ?? 0) < now()->timestamp
                || empty($authorization['verified'])
                || ! in_array(($authorization['method'] ?? null), ['otp', 'biometric'], true)) {
                return back()->withErrors(['authorization_challenge_id' => 'Complete either OTP or biometric verification before starting this SHA visit.'])->withInput();
            }
            if (blank($validated['sha_benefit_code'] ?? null) || blank($validated['sha_benefit_name'] ?? null)) {
                return back()->withErrors(['sha_benefit_code' => 'Select a benefit returned by the configured provider before starting a SHA visit.'])->withInput();
            }
        }

        if (blank($validated['full_name'] ?? null)) {
            $validated['full_name'] = trim(implode(' ', array_filter([$validated['first_name'] ?? null, $validated['middle_name'] ?? null, $validated['last_name'] ?? null]))) ?: null;
        }
        if (blank($validated['full_name'] ?? null) && blank($validated['identifier_number'] ?? null)) {
            return back()->withErrors(['full_name' => 'Enter a patient name or a valid identifier so the record can be found again.'])->withInput();
        }
        if (filled($validated['full_name'] ?? null) && filled($validated['date_of_birth'] ?? null)) {
            $possibleDuplicate = Patient::query()
                ->whereRaw('LOWER(full_name) = ?', [mb_strtolower(trim($validated['full_name']))])
                ->whereDate('date_of_birth', $validated['date_of_birth'])
                ->first();

            if ($possibleDuplicate) {
                $submittedIdentifierBelongsToCandidate = false;
                if (! empty($validated['identifier_number']) && ! empty($validated['identifier_type'])) {
                    $normalizedIdentifier = strtoupper(preg_replace('/\\s+/', '', trim($validated['identifier_number'])));
                    $submittedIdentifierBelongsToCandidate = $possibleDuplicate->identifiers()
                        ->where('type', $validated['identifier_type'])
                        ->where('value_hash', hash('sha256', $normalizedIdentifier))
                        ->exists();
                }
                if (! $submittedIdentifierBelongsToCandidate &&
                    ($possibleDuplicate->client_registry_id !== ($validated['client_registry_id'] ?? null))) {
                    return back()->withErrors([
                        'full_name' => 'A patient with the same name and date of birth already exists (MRN ' . $possibleDuplicate->medical_record_number . '). The system stopped registration to prevent a duplicate. Open the existing record and start a visit there if this is the same patient.',
                    ])->withInput();
                }
            }
        }

        $registryPatientRecord = null;
        $principalRegistryRecord = null;
        $principalRelationshipStatus = null;
        if (($validated['registration_source'] ?? null) === 'sha') {
            try {
                $patientLookup = $gateway->request('dha-afyalink', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client', [
                    'dynamic_id_search' => 1,
                    'id' => $validated['identifier_number'],
                ]);
                $registryPatientRecord = is_array($patientLookup['body'] ?? null) ? $patientLookup['body'] : null;
                if (($patientLookup['status'] ?? 500) < 200 || ($patientLookup['status'] ?? 500) >= 300 || empty($registryPatientRecord['id'])) {
                    return back()->withErrors(['identifier_number' => 'The Client Registry did not verify this identifier. Register as local/non-SHA or retry the provider lookup; no SHA identity was saved.'])->withInput();
                }
                $validated['client_registry_id'] = (string) $registryPatientRecord['id'];
            } catch (Throwable $exception) {
                report($exception);
                return back()->withErrors(['identifier_number' => 'Client Registry verification is unavailable. No SHA identity was saved. Retry or use the approved manual-review process.'])->withInput();
            }
        }
        if (filled($validated['principal_member_client_registry_id'] ?? null)) {
            if (($validated['registration_source'] ?? null) !== 'sha' || blank($validated['client_registry_id'] ?? null)) {
                return back()->withErrors(['principal_member_client_registry_id' => 'A SHA dependant must have a Client Registry ID before the principal-member relationship can be verified.'])->withInput();
            }
            try {
                $principalResponse = $gateway->request('dha-afyalink', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client', [
                    'dynamic_id_search' => 1,
                    'id' => $validated['principal_member_client_registry_id'],
                ]);
                $principalRegistryRecord = is_array($principalResponse['body'] ?? null) ? $principalResponse['body'] : null;
                if (($principalResponse['status'] ?? 500) < 200 || ($principalResponse['status'] ?? 500) >= 300 || empty($principalRegistryRecord['id'])) {
                    return back()->withErrors(['principal_member_client_registry_id' => 'The principal member could not be verified against the configured Client Registry. No dependent relationship was created.'])->withInput();
                }
                $dependants = $this->safeRegistryDependants($principalRegistryRecord['dependants'] ?? []);
                $unconfirmed = $this->safeRegistryDependants($principalRegistryRecord['unconfirmed_dependants'] ?? []);
                $childCrId = strtoupper(trim((string) $validated['client_registry_id']));
                $confirmedMatch = collect($dependants)->contains(fn ($dependent) => strtoupper(trim((string) ($dependent['id'] ?? ''))) === $childCrId);
                $unconfirmedMatch = collect($unconfirmed)->contains(fn ($dependent) => strtoupper(trim((string) ($dependent['id'] ?? ''))) === $childCrId);
                if (! $confirmedMatch && ! $unconfirmedMatch) {
                    return back()->withErrors(['principal_member_client_registry_id' => 'The Client Registry response did not list this patient as a dependant of the selected principal member. The relationship was not saved.'])->withInput();
                }
                $principalRelationshipStatus = $confirmedMatch ? 'sha_verified' : 'sha_unconfirmed';
            } catch (Throwable $exception) {
                report($exception);
                return back()->withErrors(['principal_member_client_registry_id' => 'Principal-member verification is unavailable. Retry or complete manual review; the relationship was not saved.'])->withInput();
            }
        }

        if (($validated['registration_source'] ?? null) === 'sha' && ! empty($validated['create_visit'])) {
            try {
                $benefitResponse = $gateway->request('dha-hie', 'patient.benefits', 'GET', '', [
                    'patient_id' => (string) ($validated['client_registry_id'] ?? ''),
                    'id' => (string) ($validated['identifier_number'] ?? ''),
                    'identification_type' => (string) ($validated['identifier_type'] ?? ''),
                ]);
                $benefitBody = is_array($benefitResponse['body'] ?? null) ? $benefitResponse['body'] : [];
                $benefitList = $benefitBody['benefits'] ?? $benefitBody['data'] ?? $benefitBody['result'] ?? [];
                if (($benefitResponse['status'] ?? 500) < 200 || ($benefitResponse['status'] ?? 500) >= 300 || ! is_array($benefitList)) {
                    return back()->withErrors(['sha_benefit_code' => 'The configured provider did not return a usable benefits list. No SHA visit was created.'])->withInput();
                }
                $benefitFound = collect($benefitList)->contains(function ($benefit) use ($validated): bool {
                    if (! is_array($benefit)) return false;
                    $code = (string) ($benefit['code'] ?? $benefit['id'] ?? $benefit['benefit_code'] ?? '');
                    return $code !== '' && hash_equals($code, (string) ($validated['sha_benefit_code'] ?? ''));
                });
                if (! $benefitFound) {
                    return back()->withErrors(['sha_benefit_code' => 'The selected benefit was not present in the server-side provider response. Refresh benefits and select a returned item.'])->withInput();
                }
                if (! $gateway->isMockMode()) {
                    $preauthResponse = $gateway->request('sha-edi', 'preauthorization.check', 'GET', '', [
                        'patient_id' => (string) ($validated['client_registry_id'] ?? ''),
                        'benefit_code' => (string) ($validated['sha_benefit_code'] ?? ''),
                    ]);
                    $preauthBody = is_array($preauthResponse['body'] ?? null) ? $preauthResponse['body'] : [];
                    $preauthStatus = strtolower(str_replace([' ', '-'], '_', (string) ($preauthBody['status'] ?? $preauthBody['preauthorization_status'] ?? 'unknown')));
                    if (($preauthResponse['status'] ?? 500) < 200 || ($preauthResponse['status'] ?? 500) >= 300 || ! in_array($preauthStatus, ['approved', 'not_required', 'not_required_by_rules'], true)) {
                        return back()->withErrors(['sha_benefit_code' => 'Preauthorization is required, pending, unavailable, or returned an unknown status. Resolve it using the approved provider workflow before creating the SHA visit.'])->withInput();
                    }
                    $validated['sha_preauthorization_status'] = $preauthStatus;
                }
            } catch (Throwable $exception) {
                report($exception);
                return back()->withErrors(['sha_benefit_code' => 'The provider benefit or preauthorization check could not be completed. No SHA visit was created.'])->withInput();
            }
        }

        try {
            $result = DB::transaction(function () use ($request, $validated, $registryPatientRecord, $principalRegistryRecord, $principalRelationshipStatus): array {
                $patient = null;
                if (! empty($validated['identifier_number']) && ! empty($validated['identifier_type'])) {
                    $normalized = strtoupper(preg_replace('/\s+/', '', trim($validated['identifier_number'])));
                    $hash = hash('sha256', $normalized);
                    $identifier = PatientIdentifier::query()->where('type', $validated['identifier_type'])->where('value_hash', $hash)->first();
                    if ($identifier) $patient = Patient::query()->whereKey($identifier->patient_id)->lockForUpdate()->first();
                }
                if (! $patient && ! empty($validated['client_registry_id'])) {
                    $patient = Patient::query()->where('client_registry_id', $validated['client_registry_id'])->lockForUpdate()->first();
                }

                $created = ! $patient;
                if ($created) {
                    $patient = new Patient();
                    $patient->public_id = (string) Str::uuid();
                    $patient->medical_record_number = $this->newMrn();
                    $patient->registration_source = $validated['registration_source'];
                    $patient->created_by = $request->user()->id;
                }
                foreach (['client_registry_id','first_name','middle_name','last_name','full_name','date_of_birth','sex','gender','phone','email','preferred_language','nationality','county','sub_county','ward','address','emergency_contact_name','emergency_contact_relationship','emergency_contact_phone'] as $field) {
                    if (array_key_exists($field, $validated) && filled($validated[$field])) $patient->{$field} = $validated[$field];
                }
                if ($validated['registration_source'] === 'sha' && $registryPatientRecord) {
                    $patient->client_registry_id = (string) $registryPatientRecord['id'];
                    foreach (['first_name','middle_name','last_name','date_of_birth','phone','county','sub_county','ward'] as $field) {
                        if (array_key_exists($field, $registryPatientRecord) && filled($registryPatientRecord[$field])) $patient->{$field} = $registryPatientRecord[$field];
                    }
                    $patient->gender = $registryPatientRecord['gender'] ?? $patient->gender;
                    $patient->full_name = trim(implode(' ', array_filter([$patient->first_name, $patient->middle_name, $patient->last_name]))) ?: $patient->full_name;
                    $patient->identity_verification_source = 'dha_client_registry';
                    $patient->last_identity_verified_at = now();
                }
                if ($validated['registration_source'] === 'sha') $patient->registration_source = 'sha';
                $patient->updated_by = $request->user()->id;
                $patient->save();

                if (! empty($validated['identifier_number']) && ! empty($validated['identifier_type'])) {
                    $normalized = strtoupper(preg_replace('/\s+/', '', trim($validated['identifier_number'])));
                    $identifier = PatientIdentifier::query()->where('type', $validated['identifier_type'])->where('value_hash', hash('sha256', $normalized))->first() ?? new PatientIdentifier();
                    $identifier->type = $validated['identifier_type'];
                    if ($identifier->exists && $identifier->patient_id !== $patient->id) throw new \RuntimeException('This identifier is already linked to another patient record. Review the existing record instead of creating a duplicate.');
                    $identifier->patient_id = $patient->id;
                    $identifier->setIdentifierValue($validated['identifier_number']);
                    $identifier->is_primary = true;
                    $identifier->verification_source = $validated['registration_source'] === 'sha' ? 'dha_client_registry' : 'local_entry';
                    $identifier->verified_at = $validated['registration_source'] === 'sha' ? now() : null;
                    $identifier->save();
                }

                $principalPatientId = $validated['principal_member_patient_id'] ?? null;
                if ($principalRegistryRecord && filled($validated['principal_member_client_registry_id'] ?? null)) {
                    $principal = Patient::query()->where('client_registry_id', $validated['principal_member_client_registry_id'])->lockForUpdate()->first();
                    if (! $principal) {
                        $principal = new Patient();
                        $principal->public_id = (string) Str::uuid();
                        $principal->medical_record_number = $this->newMrn();
                        $principal->registration_source = 'sha';
                        $principal->client_registry_id = (string) $principalRegistryRecord['id'];
                        $principal->first_name = $principalRegistryRecord['first_name'] ?? null;
                        $principal->middle_name = $principalRegistryRecord['middle_name'] ?? null;
                        $principal->last_name = $principalRegistryRecord['last_name'] ?? null;
                        $principal->full_name = trim(implode(' ', array_filter([$principal->first_name, $principal->middle_name, $principal->last_name]))) ?: null;
                        $principal->date_of_birth = $principalRegistryRecord['date_of_birth'] ?? null;
                        $principal->gender = $principalRegistryRecord['gender'] ?? null;
                        $principal->phone = $principalRegistryRecord['phone'] ?? null;
                        $principal->county = $principalRegistryRecord['county'] ?? null;
                        $principal->sub_county = $principalRegistryRecord['sub_county'] ?? null;
                        $principal->ward = $principalRegistryRecord['ward'] ?? null;
                        $principal->identity_verification_source = 'dha_client_registry';
                        $principal->last_identity_verified_at = now();
                        $principal->created_by = $request->user()->id;
                        $principal->updated_by = $request->user()->id;
                        $principal->save();
                    }
                    $principalPatientId = $principal->id;
                }
                if ($principalPatientId && (int) $principalPatientId !== $patient->id) {
                    $patient->relationships()->updateOrCreate(
                        ['related_patient_id' => $principalPatientId, 'relationship_type' => $validated['relationship_type'] ?: 'dependent'],
                        ['is_principal_member' => true, 'source' => $principalRelationshipStatus ?? 'local', 'verified_at' => $principalRelationshipStatus === 'sha_verified' ? now() : null, 'verified_by' => $request->user()->id, 'external_relationship_reference' => $validated['principal_member_client_registry_id'] ?? null],
                    );
                }

                if (! empty($validated['consent_type']) && ! empty($validated['consent_status'])) {
                    \App\Models\PatientConsent::query()->create([
                        'patient_id' => $patient->id, 'consent_type' => $validated['consent_type'],
                        'status' => $validated['consent_status'], 'method' => $validated['consent_method'] ?? 'written',
                        'provider' => 'local', 'requested_at' => now(),
                        'granted_at' => $validated['consent_status'] === 'granted' ? now() : null,
                        'captured_by' => $request->user()->id,
                        'provider_metadata' => ['source' => 'registration'],
                    ]);
                }

                $encounter = null;
                if (! empty($validated['create_visit'])) {
                    $encounter = Encounter::query()->create([
                        'public_id' => (string) Str::uuid(), 'encounter_number' => $this->newEncounterNumber(),
                        'patient_id' => $patient->id, 'visit_type' => $validated['visit_type'] ?: 'outpatient',
                        'status' => 'started', 'priority' => 'routine', 'arrived_at' => now(), 'started_at' => now(),
                        'chief_complaint' => $validated['chief_complaint'] ?? null, 'department' => $validated['department'] ?? null,
                        'principal_member_patient_id' => $principalPatientId ?? null,
                        'payment_type' => $validated['payment_type'] ?? null, 'coverage_type' => $validated['coverage_type'] ?? null,
                        'sha_benefit_code' => $validated['sha_benefit_code'] ?? null, 'sha_benefit_name' => $validated['sha_benefit_name'] ?? null,
                        'sha_preauthorization_status' => $validated['sha_preauthorization_status'] ?? null,
                        'registered_by' => $request->user()->id,
                    ]);
                }
                return compact('patient', 'encounter', 'created');
            });
        } catch (QueryException $exception) {
            report($exception);
            return back()->withErrors(['identifier_number' => 'The patient identifier conflicts with an existing record. Search the patient registry before retrying.'])->withInput();
        } catch (Throwable $exception) {
            report($exception);
            return back()->withErrors(['patient' => $exception->getMessage()])->withInput();
        }

        $request->session()->forget('patient_principal_authorization');
        $message = $result['created'] ? 'Patient record created.' : 'Existing patient record found and reused.';
        if ($result['encounter']) {
            return redirect()->route('visits.show', $result['encounter'])->with('success', 'Visit started: ' . $result['encounter']->encounter_number . '.');
        }
        return redirect()->route('patients.show', $result['patient'])->with('success', $message);
    }

    public function show(Patient $patient): Response
    {
        $patient->load([
            'encounters' => fn ($q) => $q->latest('arrived_at')->limit(50),
            'relationships.relatedPatient',
            'identifiers',
            'consents' => fn ($q) => $q->latest(),
        ]);
        $transactions = PatientIntegrationTransaction::query()->where('patient_id', $patient->id)
            ->latest()->limit(20)->get(['id','correlation_id','provider','operation','environment','status','http_status','provider_reference','error_code','completed_at','created_at']);
        return Inertia::render('patients/show', [
            'can' => [
                'update' => request()->user()->can('patients.update'),
                'createVisit' => request()->user()->can('appointments.manage'),
                'checkEligibility' => request()->user()->can('sha.eligibility.verify'),
            ],
            'patient' => [
                'id' => $patient->id, 'public_id' => $patient->public_id,
                'medical_record_number' => $patient->medical_record_number,
                'registration_source' => $patient->registration_source, 'client_registry_id' => $patient->client_registry_id,
                'first_name' => $patient->first_name, 'middle_name' => $patient->middle_name, 'last_name' => $patient->last_name,
                'full_name' => $patient->full_name ?: trim(implode(' ', array_filter([$patient->first_name, $patient->middle_name, $patient->last_name]))),
                'date_of_birth' => $patient->date_of_birth?->toDateString(), 'sex' => $patient->sex, 'gender' => $patient->gender,
                'phone' => $patient->phone, 'email' => $patient->email, 'preferred_language' => $patient->preferred_language,
                'nationality' => $patient->nationality, 'county' => $patient->county, 'sub_county' => $patient->sub_county,
                'ward' => $patient->ward, 'address' => $patient->address,
                'emergency_contact_name' => $patient->emergency_contact_name,
                'emergency_contact_relationship' => $patient->emergency_contact_relationship,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'status' => $patient->status, 'is_deceased' => $patient->is_deceased,
                'last_identity_verified_at' => $patient->last_identity_verified_at?->toIso8601String(),
                'identity_verification_source' => $patient->identity_verification_source,
                'created_at' => $patient->created_at?->toIso8601String(), 'updated_at' => $patient->updated_at?->toIso8601String(),
                'encounters' => $patient->encounters->map(fn ($e) => [
                    'id' => $e->id, 'encounter_number' => $e->encounter_number, 'visit_type' => $e->visit_type,
                    'status' => $e->status, 'priority' => $e->priority, 'arrived_at' => $e->arrived_at?->toIso8601String(),
                    'department' => $e->department, 'chief_complaint' => $e->chief_complaint,
                    'payment_type' => $e->payment_type, 'coverage_type' => $e->coverage_type,
                    'sha_eligibility_status' => $e->sha_eligibility_status,
                ]),
                'identifiers' => $patient->identifiers->map(fn ($i) => [
                    'id' => $i->id, 'type' => $i->type, 'value' => $i->identifierValue(), 'issuer' => $i->issuer,
                    'is_primary' => $i->is_primary, 'verified_at' => $i->verified_at?->toIso8601String(),
                    'verification_source' => $i->verification_source,
                ]),
                'consents' => $patient->consents->map(fn ($c) => [
                    'id' => $c->id, 'consent_type' => $c->consent_type, 'status' => $c->status,
                    'method' => $c->method, 'provider' => $c->provider, 'provider_reference' => $c->provider_reference,
                    'requested_at' => $c->requested_at?->toIso8601String(), 'granted_at' => $c->granted_at?->toIso8601String(),
                    'expires_at' => $c->expires_at?->toIso8601String(), 'revoked_at' => $c->revoked_at?->toIso8601String(),
                ]),
                'relationships' => $patient->relationships->map(fn ($r) => [
                    'type' => $r->relationship_type, 'is_principal_member' => $r->is_principal_member,
                    'related_patient_name' => $r->relatedPatient?->full_name, 'related_mrn' => $r->relatedPatient?->medical_record_number,
                    'source' => $r->source, 'verified_at' => $r->verified_at?->toIso8601String(),
                ]),
            ],
            'integrationTransactions' => $transactions->map(fn ($t) => [
                'id' => $t->id, 'correlation_id' => $t->correlation_id, 'provider' => $t->provider,
                'operation' => $t->operation, 'environment' => $t->environment, 'status' => $t->status,
                'http_status' => $t->http_status, 'provider_reference' => $t->provider_reference,
                'error_code' => $t->error_code, 'completed_at' => $t->completed_at?->toIso8601String(),
                'created_at' => $t->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function update(Request $request, Patient $patient): RedirectResponse
    {
        abort_unless($request->user()->can('patients.update'), 403);
        $data = $request->validate([
            'first_name' => ['nullable','string','max:100'], 'middle_name' => ['nullable','string','max:100'],
            'last_name' => ['nullable','string','max:100'], 'full_name' => ['nullable','string','max:255'],
            'date_of_birth' => ['nullable','date','before_or_equal:today'],
            'sex' => ['nullable', Rule::in(['female','male','intersex','unknown'])], 'gender' => ['nullable','string','max:32'],
            'phone' => ['nullable','string','max:40'], 'email' => ['nullable','email','max:255'],
            'preferred_language' => ['nullable','string','max:40'], 'nationality' => ['nullable','string','max:80'],
            'county' => ['nullable','string','max:100'], 'sub_county' => ['nullable','string','max:100'],
            'ward' => ['nullable','string','max:100'], 'address' => ['nullable','string','max:2000'],
            'emergency_contact_name' => ['nullable','string','max:255'],
            'emergency_contact_relationship' => ['nullable','string','max:80'],
            'emergency_contact_phone' => ['nullable','string','max:40'],
        ]);
        $data['full_name'] = filled($data['full_name'] ?? null) ? trim($data['full_name']) : (trim(implode(' ', array_filter([$data['first_name'] ?? $patient->first_name, $data['middle_name'] ?? $patient->middle_name, $data['last_name'] ?? $patient->last_name]))) ?: null);
        $patient->fill($data);
        $patient->updated_by = $request->user()->id;
        $patient->save();
        return redirect()->route('patients.show', $patient)->with('success', 'Patient demographics updated.');
    }

    public function recordConsent(Request $request, Patient $patient): RedirectResponse
    {
        abort_unless($request->user()->can('patients.update'), 403);
        $data = $request->validate([
            'consent_type' => ['required','string','max:48'],
            'status' => ['required', Rule::in(['granted','denied','revoked','pending'])],
            'method' => ['required', Rule::in(['written','verbal','electronic','guardian'])],
            'notes' => ['nullable','string','max:500'],
        ]);
        $now = now();
        \App\Models\PatientConsent::query()->create([
            'patient_id' => $patient->id, 'consent_type' => $data['consent_type'], 'status' => $data['status'],
            'method' => $data['method'], 'provider' => 'local', 'requested_at' => $now,
            'granted_at' => $data['status'] === 'granted' ? $now : null,
            'revoked_at' => $data['status'] === 'revoked' ? $now : null,
            'captured_by' => $request->user()->id,
            'provider_metadata' => ['source' => 'local_capture', 'notes' => $data['notes'] ?? null],
        ]);
        return redirect()->route('patients.show', $patient)->with('success', 'Consent record added to the patient record.');
    }

    public function createVisit(Request $request, Patient $patient): RedirectResponse
    {
        $data = $request->validate(['visit_type' => ['required', Rule::in(['outpatient','inpatient','emergency','follow_up','procedure'])], 'department' => ['nullable','string','max:100'], 'chief_complaint' => ['nullable','string','max:255'], 'priority' => ['nullable', Rule::in(['routine','urgent','emergency'])], 'payment_type' => ['nullable', Rule::in(['cash','sha','private_insurance','corporate','exempt','other'])], 'coverage_type' => ['nullable', Rule::in(['sha','private_insurance','corporate','self_pay','other'])]]);
        if ($patient->is_deceased || $patient->status !== 'active') return back()->withErrors(['patient' => 'A new encounter cannot be opened for an inactive or deceased patient.']);
        $encounter = Encounter::query()->create([
            'public_id' => (string) Str::uuid(), 'encounter_number' => $this->newEncounterNumber(), 'patient_id' => $patient->id,
            'visit_type' => $data['visit_type'], 'department' => $data['department'] ?? null, 'chief_complaint' => $data['chief_complaint'] ?? null,
            'priority' => $data['priority'] ?? 'routine', 'status' => 'started', 'arrived_at' => now(), 'started_at' => now(), 'payment_type' => $data['payment_type'] ?? null, 'coverage_type' => $data['coverage_type'] ?? null, 'registered_by' => $request->user()->id,
        ]);
        return redirect()->route('visits.show', $encounter)->with('success', 'Visit started: ' . $encounter->encounter_number . '.');
    }

    public function startPrincipalAuthorization(Request $request, EnvironmentAwareIntegrationService $gateway): \Illuminate\Http\JsonResponse
    {
        abort_unless($request->user()->can('patients.create'), 403);
        $data = $request->validate([
            'method' => ['required', Rule::in(['otp', 'biometric'])],
            'principal_registry_id' => ['required', 'string', 'max:100'],
            'dependent_registry_id' => ['required', 'string', 'max:100'],
            'selected_contact' => ['nullable', 'string', 'max:255', 'required_if:method,otp'],
        ]);

        // Provider OTP and production scanner contracts are not present in the supplied API catalogue.
        // Never simulate a successful live authorization or pretend a message was delivered.
        if (! $gateway->isMockMode()) {
            return response()->json([
                'message' => $data['method'] === 'biometric'
                    ? 'The live fingerprint scanner bridge is not configured. Connect the approved scanner SDK/device bridge before accepting a biometric match.'
                    : 'The approved live OTP delivery/verification adapter is not configured. No OTP was sent.',
                'environment' => $gateway->environment(), 'mock' => false,
            ], 503);
        }

        try {
            $principalResponse = $gateway->request('dha-afyalink', 'patient.lookup_by_identifier', 'GET',
                '/v3/client-registry/fetch-client', ['dynamic_id_search' => 1, 'id' => $data['principal_registry_id']]);
            $principal = is_array($principalResponse['body'] ?? null) ? $principalResponse['body'] : [];
            if (($principalResponse['status'] ?? 500) < 200 || ($principalResponse['status'] ?? 500) >= 300 || empty($principal['id'])) {
                return response()->json(['message' => 'The principal could not be re-verified. No authorization challenge was issued.'], 422);
            }

            if (strtoupper(trim($data['principal_registry_id'])) !== strtoupper(trim($data['dependent_registry_id']))) {
                $dependants = $this->safeRegistryDependants($principal['dependants'] ?? []);
                $unconfirmed = $this->safeRegistryDependants($principal['unconfirmed_dependants'] ?? []);
                $dependentListed = collect(array_merge($dependants, $unconfirmed))->contains(
                    fn ($dependent) => strtoupper(trim((string) ($dependent['id'] ?? ''))) === strtoupper(trim($data['dependent_registry_id'])));
                if (! $dependentListed) {
                    return response()->json(['message' => 'The selected dependant is not listed under this principal in the registry response. No authorization challenge was issued.'], 422);
                }
            }

            $selected = null;
            if ($data['method'] === 'otp') {
                $contacts = [];
                foreach ([['type' => 'phone', 'value' => $principal['phone'] ?? null], ['type' => 'email', 'value' => $principal['email'] ?? null]] as $item) {
                    if (is_string($item['value']) && trim($item['value']) !== '') $contacts[] = ['type' => $item['type'], 'value' => trim($item['value'])];
                }
                foreach ((array) ($principal['telecom'] ?? []) as $item) {
                    if (! is_array($item)) continue;
                    $value = trim((string) ($item['value'] ?? ''));
                    $type = strtolower((string) ($item['system'] ?? ''));
                    if ($value !== '' && in_array($type, ['phone', 'email'], true)) $contacts[] = ['type' => $type, 'value' => $value];
                }
                $contacts = collect($contacts)->unique(fn ($item) => strtolower($item['type'].'|'.$item['value']))->values();
                $selected = $contacts->first(fn ($item) => hash_equals($item['value'], trim((string) $data['selected_contact'])));
                if (! $selected) return response()->json(['message' => 'Select a contact returned by the Client Registry. No OTP was generated.'], 422);
            }

            $challengeId = (string) Str::uuid();
            $challenge = [
                'challenge_id' => $challengeId, 'method' => $data['method'],
                'principal_registry_id' => $data['principal_registry_id'],
                'dependent_registry_id' => $data['dependent_registry_id'],
                'expires_at' => now()->addMinutes(5)->timestamp, 'attempts' => 0,
                'otp_verified' => false, 'biometric_verified' => false, 'verified' => false,
            ];
            $response = ['challenge_id' => $challengeId, 'method' => $data['method'], 'environment' => $gateway->environment(), 'mock' => true, 'expires_in_seconds' => 300];
            if ($data['method'] === 'otp') {
                $otp = (string) random_int(100000, 999999);
                $challenge['selected_contact_hash'] = hash('sha256', strtolower($selected['type'].'|'.$selected['value']));
                $challenge['otp_hash'] = hash('sha256', $otp);
                Log::info('IWC development principal authorization OTP (synthetic; not sent externally)', [
                    'challenge_id' => $challengeId, 'principal_registry_id' => $data['principal_registry_id'],
                    'dependent_registry_id' => $data['dependent_registry_id'], 'contact_type' => $selected['type'],
                    'contact_masked' => $selected['type'] === 'email' ? preg_replace('/(^.).*(@.*$)/', '$1***$2', $selected['value']) : (strlen($selected['value']) > 5 ? substr($selected['value'], 0, 3).'****'.substr($selected['value'], -2) : '***'),
                    'expires_at' => now()->addMinutes(5)->toIso8601String(), 'environment' => 'development',
                ]);
                $response += ['development_otp' => $otp, 'contact_type' => $selected['type'], 'contact' => $selected['value'], 'message' => 'Development OTP generated. No SMS/email provider was contacted.'];
            } else {
                $response['message'] = 'Development biometric challenge ready. Use the synthetic fingerprint simulation; no fingerprint data is captured.';
            }
            $request->session()->put('patient_principal_authorization', $challenge);
            return response()->json($response);
        } catch (Throwable $exception) {
            report($exception);
            return response()->json(['message' => 'Could not start the authorization challenge. No visit has been created.'], 502);
        }
    }

    public function verifyPrincipalAuthorization(Request $request, EnvironmentAwareIntegrationService $gateway): \Illuminate\Http\JsonResponse
    {
        abort_unless($request->user()->can('patients.create'), 403);
        $data = $request->validate([
            'challenge_id' => ['required', 'uuid'], 'method' => ['required', Rule::in(['otp', 'biometric'])],
            'otp' => ['required_if:method,otp', 'nullable', 'digits:6'],
            'biometric_scenario' => ['nullable', Rule::in(['match', 'no_match', 'not_enrolled'])],
        ]);
        $challenge = $request->session()->get('patient_principal_authorization');
        if (! is_array($challenge) || ! hash_equals((string) ($challenge['challenge_id'] ?? ''), $data['challenge_id'])
            || ! hash_equals((string) ($challenge['method'] ?? ''), $data['method'])
            || (int) ($challenge['expires_at'] ?? 0) < now()->timestamp) {
            $request->session()->forget('patient_principal_authorization');
            return response()->json(['message' => 'Authorization challenge is missing, expired, or belongs to a different method. Start again.'], 422);
        }
        if (! $gateway->isMockMode()) {
            return response()->json(['message' => 'The live authorization adapter is not configured for this environment. No synthetic verification was accepted.'], 503);
        }

        if ($data['method'] === 'otp') {
            $expectedHash = (string) ($challenge['otp_hash'] ?? '');
            if ($expectedHash === '' || ! hash_equals($expectedHash, hash('sha256', (string) ($data['otp'] ?? '')))) {
                $challenge['attempts'] = (int) ($challenge['attempts'] ?? 0) + 1;
                if ($challenge['attempts'] >= 5) {
                    $request->session()->forget('patient_principal_authorization');
                    return response()->json(['verified' => false, 'mock' => true, 'message' => 'Too many incorrect OTP attempts. Start a new challenge.'], 429);
                }
                $request->session()->put('patient_principal_authorization', $challenge);
                return response()->json(['verified' => false, 'mock' => true, 'message' => 'Incorrect development OTP. Try again or restart the challenge.'], 422);
            }
            $challenge['otp_verified'] = true;
            $challenge['verified'] = true;
        } else {
            $scenario = (string) ($data['biometric_scenario'] ?? 'match');
            if ($scenario !== 'match') {
                return response()->json(['verified' => false, 'mock' => true, 'message' => $scenario === 'not_enrolled' ? 'No enrolled fingerprint was found in the development simulation.' : 'The simulated fingerprint did not match. Try again.'], 422);
            }
            // Development-only simulated match. No external endpoint is called and no biometric template is stored.
            $challenge['biometric_verified'] = true;
            $challenge['verified'] = true;
        }
        $challenge['verified_at'] = now()->timestamp;
        $request->session()->put('patient_principal_authorization', $challenge);
        return response()->json([
            'verified' => true, 'step_verified' => true, 'method' => $challenge['method'],
            'otp_verified' => (bool) ($challenge['otp_verified'] ?? false),
            'biometric_verified' => (bool) ($challenge['biometric_verified'] ?? false),
            'challenge_id' => $challenge['challenge_id'], 'mock' => true, 'environment' => $gateway->environment(),
            'message' => $challenge['method'] === 'otp' ? 'Development OTP verified. This is a synthetic test, not real SHA authorization.' : 'Development fingerprint simulation passed. No biometric data was captured; this is not real SHA authorization.',
        ]);
    }

    public function lookupShaIdentifier(Request $request, EnvironmentAwareIntegrationService $gateway): \Illuminate\Http\JsonResponse
    {
        abort_unless($request->user()->can('sha.eligibility.verify') || $request->user()->can('patients.create'), 403);
        $data = $request->validate([
            'identification_type' => ['required', Rule::in(['National ID', 'ClientRegistry ID', 'Birth Notification', 'Birth Certificate', 'Alien ID', 'Refugee ID', 'Mandate Number'])],
            'identification_number' => ['required', 'string', 'max:100'],
        ]);
        $correlation = (string) Str::uuid();
        try {
            $response = $gateway->request('dha-afyalink', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client', [
                'dynamic_id_search' => 1,
                'id' => $data['identification_number'],
            ], ['X-Correlation-ID' => $correlation]);
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => $correlation, 'provider' => 'dha-afyalink', 'operation' => 'patient.lookup_by_identifier',
                'environment' => $response['environment'], 'status' => $response['status'] >= 200 && $response['status'] < 300 ? 'succeeded' : 'failed',
                'http_status' => $response['status'], 'request_body_redacted' => ['identification_type' => $data['identification_type'], 'identification_number' => '[REDACTED]'],
                'response_body_redacted' => $this->redactProviderBody($response['body']), 'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            $body = is_array($response['body']) ? $response['body'] : [];
            $found = $response['status'] >= 200 && $response['status'] < 300 && ! empty($body['id']);
            return response()->json([
                'environment' => $response['environment'], 'mock' => $response['mock'],
                'status' => $response['status'], 'found' => $found,
                'patient' => $found ? $this->safeRegistryPatient($body) : null,
                'dependants' => $found ? $this->safeRegistryDependants($body['dependants'] ?? []) : [],
                'unconfirmed_dependants' => $found ? $this->safeRegistryDependants($body['unconfirmed_dependants'] ?? []) : [],
                'correlation_id' => $correlation,
            ]);
        } catch (Throwable $exception) {
            report($exception);
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => $correlation, 'provider' => 'dha-afyalink', 'operation' => 'patient.lookup_by_identifier',
                'environment' => $gateway->environment(), 'status' => 'failed', 'request_body_redacted' => ['identification_type' => $data['identification_type'], 'identification_number' => '[REDACTED]'],
                'error_code' => class_basename($exception), 'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            return response()->json(['message' => 'Client Registry lookup failed. Check provider configuration and transaction logs; no patient data was assumed.'], 502);
        }
    }

    public function shaBenefits(Request $request, EnvironmentAwareIntegrationService $gateway): \Illuminate\Http\JsonResponse
    {
        abort_unless($request->user()->can('sha.eligibility.verify') || $request->user()->can('patients.create'), 403);
        $data = $request->validate([
            'client_registry_id' => ['required', 'string', 'max:100'],
            'identification_number' => ['required', 'string', 'max:100'],
            'identification_type' => ['required', 'string', 'max:40'],
        ]);
        try {
            // Live endpoint is intentionally supplied through the provider's environment endpoint map;
            // the project catalogue says the assigned Postman collection is authoritative for this route.
            $response = $gateway->request('dha-hie', 'patient.benefits', 'GET', '', [
                'patient_id' => $data['client_registry_id'],
                'id' => $data['identification_number'],
                'identification_type' => $data['identification_type'],
            ]);
            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => (string) Str::uuid(), 'provider' => 'dha-hie', 'operation' => 'patient.benefits',
                'environment' => $response['environment'], 'status' => ($response['status'] >= 200 && $response['status'] < 300) ? 'succeeded' : 'failed',
                'http_status' => $response['status'],
                'request_body_redacted' => ['client_registry_id' => '[REDACTED]', 'identification_number' => '[REDACTED]'],
                'response_body_redacted' => ['response_received' => true, 'mock' => (bool) ($response['mock'] ?? false), 'benefit_count' => count((array) ($body['benefits'] ?? $body['data'] ?? $body['result'] ?? []))],
                'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            $benefits = $body['benefits'] ?? $body['data'] ?? $body['result'] ?? [];
            if (! is_array($benefits)) $benefits = [];
            return response()->json([
                'environment' => $response['environment'], 'mock' => $response['mock'],
                'status' => $response['status'], 'benefits' => array_values(array_filter($benefits, 'is_array')),
                'body' => $body,
                'note' => $response['mock'] ? 'Synthetic development benefits are UI test scenarios only, not SHA entitlement.' : null,
            ], ($response['status'] >= 200 && $response['status'] < 300) ? 200 : 502);
        } catch (Throwable $exception) {
            report($exception);
            return response()->json(['message' => 'Benefit lookup is unavailable. Verify the assigned API collection and the patient.benefits endpoint map. No benefit was inferred.'], 503);
        }
    }

    public function shaPreauthorizationCheck(Request $request, EnvironmentAwareIntegrationService $gateway): \Illuminate\Http\JsonResponse
    {
        abort_unless($request->user()->can('sha.services.verify') || $request->user()->can('patients.create'), 403);
        $data = $request->validate([
            'client_registry_id' => ['required', 'string', 'max:100'],
            'benefit_code' => ['required', 'string', 'max:100'],
            'benefit_name' => ['required', 'string', 'max:255'],
        ]);
        try {
            $response = $gateway->request('sha-edi', 'preauthorization.check', 'GET', '', [
                'patient_id' => $data['client_registry_id'], 'benefit_code' => $data['benefit_code'],
            ]);
            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            $status = (string) ($body['status'] ?? $body['preauthorization_status'] ?? 'review-required');
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => (string) Str::uuid(), 'provider' => 'sha-edi', 'operation' => 'preauthorization.check',
                'environment' => $response['environment'], 'status' => ($response['status'] >= 200 && $response['status'] < 300) ? 'succeeded' : 'failed',
                'http_status' => $response['status'], 'provider_reference' => isset($body['reference']) ? (string) $body['reference'] : null,
                'request_body_redacted' => ['client_registry_id' => '[REDACTED]', 'benefit_code' => $data['benefit_code']],
                'response_body_redacted' => ['status' => $status, 'mock' => (bool) ($response['mock'] ?? false)],
                'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            return response()->json([
                'environment' => $response['environment'], 'mock' => $response['mock'], 'status' => $status,
                'message' => $response['mock'] ? 'Synthetic preauthorization workflow response; no SHA preauthorization was submitted.' : 'Provider response received; unknown statuses must be reviewed.',
                'body' => $body,
            ], ($response['status'] >= 200 && $response['status'] < 300) ? 200 : 502);
        } catch (Throwable $exception) {
            report($exception);
            return response()->json(['status' => 'unavailable', 'message' => 'Preauthorization cannot be verified in the configured environment. Do not treat this as approved.'], 503);
        }
    }

    public function shaEligibility(Request $request, Patient $patient, EnvironmentAwareIntegrationService $gateway): RedirectResponse
    {
        abort_unless($request->user()->can('sha.eligibility.verify'), 403);
        $data = $request->validate(['identification_type' => ['required', Rule::in(['National ID','ClientRegistry ID','Birth Notification','Birth Certificate','Alien ID'])], 'identification_number' => ['required','string','max:100']]);
        $correlation = (string) Str::uuid();
        $payload = ['identification_type' => $data['identification_type'], 'identification_number' => $data['identification_number']];
        try {
            $response = $gateway->request('dha-hie', 'eligibility.check', 'GET', '/patients/eligibility', $payload);
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => $correlation, 'patient_id' => $patient->id, 'provider' => 'dha-hie', 'operation' => 'eligibility.check',
                'environment' => $response['environment'], 'status' => $response['status'] >= 200 && $response['status'] < 300 ? 'succeeded' : 'failed',
                'http_status' => $response['status'], 'request_body_redacted' => ['identification_type' => $data['identification_type'], 'identification_number' => '[REDACTED]'],
                'response_body_redacted' => $this->redactProviderBody($response['body']), 'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            if (is_array($response['body']) && ($response['body']['isAlive'] ?? true) === false) $patient->forceFill(['is_deceased' => true, 'status' => 'inactive'])->save();
            return back()->with('sha_result', ['environment' => $response['environment'], 'mock' => $response['mock'], 'status' => $response['status'], 'body' => $response['body'], 'correlation_id' => $correlation]);
        } catch (Throwable $exception) {
            report($exception);
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => $correlation, 'patient_id' => $patient->id, 'provider' => 'dha-hie', 'operation' => 'eligibility.check',
                'environment' => $gateway->environment(), 'status' => 'failed', 'request_body_redacted' => ['identification_type' => $data['identification_type'], 'identification_number' => '[REDACTED]'],
                'error_code' => class_basename($exception), 'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            return back()->withErrors(['sha' => 'SHA eligibility check failed. Check integration configuration and transaction logs; no eligibility result was assumed.']);
        }
    }

    private function safeRegistryPatient(array $body): array
    {
        return array_intersect_key($body, array_flip([
            'id', 'resourceType', 'identification_type', 'identification_number', 'first_name', 'middle_name', 'last_name',
            'date_of_birth', 'gender', 'sex', 'phone', 'email', 'county', 'sub_county', 'ward', 'city', 'country',
            'citizenship', 'postal_address', 'village_estate', 'title', 'deceased_datetime', 'other_identifications', 'meta', 'telecom', 'coverage', 'schemes', 'memberCrNumber',
        ]));
    }

    private function safeRegistryDependants(mixed $dependants): array
    {
        if (! is_array($dependants)) return [];
        $safe = [];
        foreach ($dependants as $group) {
            if (! is_array($group)) continue;
            $items = isset($group['result']) && is_array($group['result']) ? $group['result'] : [$group];
            if (! is_array($items)) continue;
            foreach ($items as $item) {
                if (! is_array($item)) continue;
                $safe[] = array_intersect_key($item, array_flip([
                    'id', 'first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender', 'identification_type',
                    'identification_number', 'phone', 'county', 'sub_county', 'relationship', 'related_to', 'date_added',
                ]));
            }
        }
        return $safe;
    }

    private function redactProviderBody(mixed $body): array
    {
        if (! is_array($body)) return ['response_type' => get_debug_type($body)];
        // Do not persist patient names, identifiers, DOB, contact details, OTPs, biometrics, or consent tokens in integration logs.
        if (isset($body['statusCode']) || isset($body['facilityBiometricsEnforced'])) {
            return array_intersect_key($body, array_flip(['statusCode', 'statusDesc', 'facilityBiometricsEnforced', 'whitelistedForOTP', 'mock']));
        }
        if (isset($body['message']['result'])) {
            return ['message' => ['total' => (int) ($body['message']['total'] ?? count($body['message']['result'])), 'result_count' => count((array) $body['message']['result'])], 'mock' => (bool) ($body['mock'] ?? false)];
        }
        return ['response_received' => true, 'mock' => (bool) ($body['mock'] ?? false), 'keys' => array_slice(array_map('strval', array_keys($body)), 0, 30)];
    }

    private function hasExistingIdentifier(array $validated): bool
    {
        if (! empty($validated['identifier_number']) && ! empty($validated['identifier_type'])) {
            $normalized = strtoupper(preg_replace('/\s+/', '', trim($validated['identifier_number'])));
            if (PatientIdentifier::query()->where('type', $validated['identifier_type'])->where('value_hash', hash('sha256', $normalized))->exists()) return true;
        }
        return ! empty($validated['client_registry_id']) && Patient::query()->where('client_registry_id', $validated['client_registry_id'])->exists();
    }

    private function newMrn(): string
    {
        do { $value = 'IWC-' . now()->format('ymd') . '-' . strtoupper(Str::random(6)); } while (Patient::withTrashed()->where('medical_record_number', $value)->exists());
        return $value;
    }
    private function newEncounterNumber(): string
    {
        do { $value = 'ENC-' . now()->format('ymd') . '-' . strtoupper(Str::random(6)); } while (Encounter::where('encounter_number', $value)->exists());
        return $value;
    }
}

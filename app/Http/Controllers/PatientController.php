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
        $patients = Patient::query()->withCount('encounters')->when($term !== '', fn ($q) => $q->search($term))
            ->latest('updated_at')->paginate(15)->withQueryString()
            ->through(fn (Patient $patient) => [
                'id' => $patient->id, 'medical_record_number' => $patient->medical_record_number,
                'full_name' => $patient->full_name ?: trim(implode(' ', array_filter([$patient->first_name, $patient->middle_name, $patient->last_name]))),
                'date_of_birth' => $patient->date_of_birth?->toDateString(), 'phone' => $patient->phone,
                'registration_source' => $patient->registration_source, 'status' => $patient->status,
                'encounters_count' => $patient->encounters_count,
            ]);
        return Inertia::render('patients/index', ['patients' => $patients, 'filters' => ['q' => $term]]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('patients/create', [
            'can' => ['register' => $request->user()->can('patients.create'), 'shaLookup' => $request->user()->can('sha.eligibility.verify')],
            'integrationMode' => app(EnvironmentAwareIntegrationService::class)->environment(),
        ]);
    }

    public function store(Request $request): RedirectResponse
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
            'relationship_type' => ['nullable', 'string', 'max:40'],
            'create_visit' => ['sometimes', 'boolean'], 'visit_type' => ['nullable', Rule::in(['outpatient', 'inpatient', 'emergency', 'follow_up', 'procedure'])],
            'chief_complaint' => ['nullable', 'string', 'max:255'], 'department' => ['nullable', 'string', 'max:100'],
        ]);

        if (blank($validated['full_name'] ?? null)) {
            $validated['full_name'] = trim(implode(' ', array_filter([$validated['first_name'] ?? null, $validated['middle_name'] ?? null, $validated['last_name'] ?? null]))) ?: null;
        }
        if (blank($validated['full_name'] ?? null) && blank($validated['identifier_number'] ?? null)) {
            return back()->withErrors(['full_name' => 'Enter a patient name or a valid identifier so the record can be found again.'])->withInput();
        }

        try {
            $result = DB::transaction(function () use ($request, $validated): array {
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
                    $identifier->verification_source = $validated['registration_source'] === 'sha' ? 'sha_lookup' : 'local_entry';
                    $identifier->save();
                }

                if (! empty($validated['principal_member_patient_id']) && (int) $validated['principal_member_patient_id'] !== $patient->id) {
                    $patient->relationships()->updateOrCreate(
                        ['related_patient_id' => $validated['principal_member_patient_id'], 'relationship_type' => $validated['relationship_type'] ?: 'dependent'],
                        ['is_principal_member' => true, 'source' => 'local', 'verified_by' => $request->user()->id],
                    );
                }

                $encounter = null;
                if (! empty($validated['create_visit'])) {
                    $encounter = Encounter::query()->create([
                        'public_id' => (string) Str::uuid(), 'encounter_number' => $this->newEncounterNumber(),
                        'patient_id' => $patient->id, 'visit_type' => $validated['visit_type'] ?: 'outpatient',
                        'status' => 'registered', 'priority' => 'routine', 'arrived_at' => now(),
                        'chief_complaint' => $validated['chief_complaint'] ?? null, 'department' => $validated['department'] ?? null,
                        'principal_member_patient_id' => $validated['principal_member_patient_id'] ?? null,
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

        $message = $result['created'] ? 'Patient registered successfully.' : 'Existing patient record found and reused.';
        if ($result['encounter']) $message .= ' Visit ' . $result['encounter']->encounter_number . ' created.';
        return redirect()->route('patients.show', $result['patient'])->with('success', $message);
    }

    public function show(Patient $patient): Response
    {
        $patient->load(['encounters' => fn ($q) => $q->latest('arrived_at')->limit(25), 'relationships.relatedPatient']);
        return Inertia::render('patients/show', [
            'patient' => [
                'id' => $patient->id, 'medical_record_number' => $patient->medical_record_number,
                'registration_source' => $patient->registration_source, 'client_registry_id' => $patient->client_registry_id,
                'full_name' => $patient->full_name ?: trim(implode(' ', array_filter([$patient->first_name, $patient->middle_name, $patient->last_name]))),
                'date_of_birth' => $patient->date_of_birth?->toDateString(), 'sex' => $patient->sex, 'gender' => $patient->gender,
                'phone' => $patient->phone, 'email' => $patient->email, 'county' => $patient->county, 'sub_county' => $patient->sub_county,
                'status' => $patient->status, 'encounters' => $patient->encounters->map(fn ($e) => [
                    'id' => $e->id, 'encounter_number' => $e->encounter_number, 'visit_type' => $e->visit_type,
                    'status' => $e->status, 'arrived_at' => $e->arrived_at?->toIso8601String(), 'department' => $e->department,
                    'chief_complaint' => $e->chief_complaint,
                ]),
                'relationships' => $patient->relationships->map(fn ($r) => ['type' => $r->relationship_type, 'is_principal_member' => $r->is_principal_member, 'related_patient_name' => $r->relatedPatient?->full_name, 'related_mrn' => $r->relatedPatient?->medical_record_number]),
            ],
        ]);
    }

    public function createVisit(Request $request, Patient $patient): RedirectResponse
    {
        $data = $request->validate(['visit_type' => ['required', Rule::in(['outpatient','inpatient','emergency','follow_up','procedure'])], 'department' => ['nullable','string','max:100'], 'chief_complaint' => ['nullable','string','max:255'], 'priority' => ['nullable', Rule::in(['routine','urgent','emergency'])]]);
        if ($patient->is_deceased || $patient->status !== 'active') return back()->withErrors(['patient' => 'A new encounter cannot be opened for an inactive or deceased patient.']);
        $encounter = Encounter::query()->create([
            'public_id' => (string) Str::uuid(), 'encounter_number' => $this->newEncounterNumber(), 'patient_id' => $patient->id,
            'visit_type' => $data['visit_type'], 'department' => $data['department'] ?? null, 'chief_complaint' => $data['chief_complaint'] ?? null,
            'priority' => $data['priority'] ?? 'routine', 'status' => 'registered', 'arrived_at' => now(), 'registered_by' => $request->user()->id,
        ]);
        return redirect()->route('patients.show', $patient)->with('success', 'New visit ' . $encounter->encounter_number . ' created for the existing patient.');
    }

    public function lookupShaIdentifier(Request $request, EnvironmentAwareIntegrationService $gateway): \Illuminate\Http\JsonResponse
    {
        abort_unless($request->user()->can('sha.eligibility.verify') || $request->user()->can('patients.create'), 403);
        $data = $request->validate([
            'identification_type' => ['required', Rule::in(['National ID', 'ClientRegistry ID', 'Passport Number', 'Birth Certificate', 'Alien ID', 'Temporary ID', 'KRA PIN'])],
            'identification_number' => ['required', 'string', 'max:100'],
        ]);
        $correlation = (string) Str::uuid();
        try {
            $response = $gateway->request('dha-afyalink', 'patient.lookup_by_identifier', 'GET', '/v3/client-registry/fetch-client', [
                'identification_type' => $data['identification_type'],
                'identification_number' => $data['identification_number'],
            ]);
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => $correlation, 'provider' => 'dha-afyalink', 'operation' => 'patient.lookup_by_identifier',
                'environment' => $response['environment'], 'status' => $response['status'] >= 200 && $response['status'] < 300 ? 'succeeded' : 'failed',
                'http_status' => $response['status'], 'request_body_redacted' => ['identification_type' => $data['identification_type'], 'identification_number' => '[REDACTED]'],
                'response_body_redacted' => $this->redactProviderBody($response['body']), 'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            return response()->json(['environment' => $response['environment'], 'mock' => $response['mock'], 'status' => $response['status'], 'body' => $response['body'], 'correlation_id' => $correlation]);
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

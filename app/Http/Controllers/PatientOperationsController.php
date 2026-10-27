<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\PatientConsent;
use App\Models\SystemSetting;
use App\Models\PatientIntegrationTransaction;
use App\Services\Integrations\EnvironmentAwareIntegrationService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PatientOperationsController extends Controller
{
    public function visits(Request $request): Response
    {
        $term = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));

        $visits = Encounter::query()
            ->with('patient:id,medical_record_number,full_name,first_name,middle_name,last_name,phone')
            ->when($term !== '', function ($query) use ($term): void {
                $query->where(function ($nested) use ($term): void {
                    $nested->where('encounter_number', 'like', "%{$term}%")
                        ->orWhereHas('patient', function ($patient) use ($term): void {
                            $patient->where('full_name', 'like', "%{$term}%")
                                ->orWhere('medical_record_number', 'like', "%{$term}%");
                        });
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest('arrived_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Encounter $encounter) => [
                'id' => $encounter->id,
                'encounter_number' => $encounter->encounter_number,
                'patient_id' => $encounter->patient_id,
                'patient_name' => $encounter->patient?->full_name
                    ?: trim(implode(' ', array_filter([
                        $encounter->patient?->first_name,
                        $encounter->patient?->middle_name,
                        $encounter->patient?->last_name,
                    ]))),
                'medical_record_number' => $encounter->patient?->medical_record_number,
                'visit_type' => $encounter->visit_type,
                'status' => $encounter->status,
                'priority' => $encounter->priority,
                'arrived_at' => $encounter->arrived_at?->toIso8601String(),
                'department' => $encounter->department,
                'coverage_type' => $encounter->coverage_type,
                'sha_benefit_code' => $encounter->sha_benefit_code,
                'sha_benefit_name' => $encounter->sha_benefit_name,
                'sha_sub_benefit_code' => $encounter->sha_sub_benefit_code,
                'sha_sub_benefit_name' => $encounter->sha_sub_benefit_name,
                'sha_preauthorization_status' => $encounter->sha_preauthorization_status,
                'sha_eligibility_status' => $encounter->sha_eligibility_status,
            ]);

        return Inertia::render('visits/index', [
            'visits' => $visits,
            'filters' => ['q' => $term, 'status' => $status],
        ]);
    }

    public function showVisit(Encounter $encounter): Response
    {
        $encounter->load([
            'patient:id,public_id,medical_record_number,full_name,first_name,middle_name,last_name,date_of_birth,sex,gender,phone,email,registration_source,status',
            'principalMember:id,medical_record_number,full_name',
        ]);

        $documents = DB::table('encounter_documents')
            ->where('encounter_id', $encounter->id)
            ->latest('id')
            ->get();

        return Inertia::render('visits/show', [
            'visit' => [
                'id' => $encounter->id,
                'public_id' => $encounter->public_id,
                'encounter_number' => $encounter->encounter_number,
                'visit_type' => $encounter->visit_type,
                'status' => $encounter->status,
                'priority' => $encounter->priority,
                'arrived_at' => $encounter->arrived_at?->toIso8601String(),
                'started_at' => $encounter->started_at?->toIso8601String(),
                'completed_at' => $encounter->completed_at?->toIso8601String(),
                'department' => $encounter->department,
                'chief_complaint' => $encounter->chief_complaint,
                'payment_type' => $encounter->payment_type,
                'coverage_type' => $encounter->coverage_type,
                'sha_eligibility_status' => $encounter->sha_eligibility_status,
                'sha_benefit_code' => $encounter->sha_benefit_code,
                'sha_benefit_name' => $encounter->sha_benefit_name,
                'sha_sub_benefit_code' => $encounter->sha_sub_benefit_code,
                'sha_sub_benefit_name' => $encounter->sha_sub_benefit_name,
                'sha_preauthorization_status' => $encounter->sha_preauthorization_status,
                'clinical_assessment' => $encounter->clinical_assessment ?? null,
                'icd11_code' => $encounter->icd11_code ?? null,
                'icd11_display' => $encounter->icd11_display ?? null,
                'invoice_status' => $encounter->invoice_status ?? 'draft',
                'invoice_total' => $encounter->invoice_total ?? 0,
                'billing_items' => is_array($encounter->billing_items ?? null)
                    ? $encounter->billing_items
                    : (is_string($encounter->billing_items ?? null)
                        ? (json_decode($encounter->billing_items, true) ?: [])
                        : []),
                'claim_status' => $encounter->claim_status ?? null,
                'claim_reference' => $encounter->claim_reference ?? null,
                'claim_submitted_at' => isset($encounter->claim_submitted_at)
                    ? $encounter->claim_submitted_at?->toIso8601String()
                    : null,
                'consent_status' => PatientConsent::query()->where('encounter_id', $encounter->id)->where('consent_type', 'sha_claim')->where('status', 'granted')->whereNull('revoked_at')->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))->latest('id')->value('status'),
                'documents' => $documents->map(fn ($document) => [
                    'id' => $document->id,
                    'name' => $document->original_name,
                    'mime_type' => $document->mime_type,
                    'size_bytes' => (int) $document->size_bytes,
                    'url' => route('visits.documents.download', [
                        'encounter' => $encounter->id,
                        'document' => $document->id,
                    ]),
                ])->values()->all(),
                'patient' => $encounter->patient ? [
                    'id' => $encounter->patient->id,
                    'public_id' => $encounter->patient->public_id,
                    'medical_record_number' => $encounter->patient->medical_record_number,
                    'full_name' => $encounter->patient->full_name
                        ?: trim(implode(' ', array_filter([
                            $encounter->patient->first_name,
                            $encounter->patient->middle_name,
                            $encounter->patient->last_name,
                        ]))),
                    'date_of_birth' => $encounter->patient->date_of_birth?->toDateString(),
                    'sex' => $encounter->patient->sex ?: $encounter->patient->gender,
                    'phone' => $encounter->patient->phone,
                    'email' => $encounter->patient->email,
                    'registration_source' => $encounter->patient->registration_source,
                    'status' => $encounter->patient->status,
                ] : null,
                'principal_member' => $encounter->principalMember ? [
                    'medical_record_number' => $encounter->principalMember->medical_record_number,
                    'full_name' => $encounter->principalMember->full_name,
                ] : null,
            ],
            'can' => [
                'complete' => request()->user()->can('appointments.manage'),
                'manage' => request()->user()->can('appointments.manage'),
                'claim' => request()->user()->can('sha.claims.submit')
                    || request()->user()->can('appointments.manage'),
            ],
            'flash' => ['success' => session('success')],
        ]);
    }

    public function updateVisit(Request $request, Encounter $encounter): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);
        abort_if(
            in_array($encounter->status, ['completed', 'cancelled', 'terminated'], true),
            409,
            'Closed visits cannot be edited.'
        );

        $data = $request->validate([
            'sha_benefit_code' => ['nullable', 'string', 'max:100'],
            'sha_benefit_name' => ['nullable', 'string', 'max:255'],
            'sha_sub_benefit_code' => ['nullable', 'string', 'max:100'],
            'sha_sub_benefit_name' => ['nullable', 'string', 'max:255'],
            'clinical_assessment' => ['nullable', 'string', 'max:20000'],
            'icd11_code' => ['nullable', 'string', 'max:100'],
            'icd11_display' => ['nullable', 'string', 'max:500'],
            'billing_items' => ['nullable', 'array', 'max:100'],
            'billing_items.*.code' => ['nullable', 'string', 'max:100'],
            'billing_items.*.description' => ['nullable', 'string', 'max:255'],
            'billing_items.*.quantity' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'billing_items.*.unit_price' => ['nullable', 'numeric', 'min:0', 'max:100000000'],
        ]);

        if (array_key_exists('billing_items', $data)) {
            $items = collect($data['billing_items'] ?? [])
                ->map(function ($item) {
                    $qty = (float) ($item['quantity'] ?? 0);
                    $unit = (float) ($item['unit_price'] ?? 0);

                    return [
                        'code' => $item['code'] ?? null,
                        'description' => trim((string) ($item['description'] ?? '')),
                        'quantity' => $qty,
                        'unit_price' => $unit,
                        'total' => round($qty * $unit, 2),
                    ];
                })
                ->values()
                ->all();

            $data['billing_items'] = $items;
            $data['invoice_total'] = round(collect($items)->sum('total'), 2);

            if (($encounter->invoice_status ?? null) !== 'issued') {
                $data['invoice_status'] = 'draft';
            }
        }

        $encounter->fill($data)->save();

        return back()->with('success', 'Visit progress saved.');
    }

    public function uploadDocument(Request $request, Encounter $encounter): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);
        abort_if(
            in_array($encounter->status, ['completed', 'cancelled', 'terminated'], true),
            409,
            'Closed visits cannot accept documents.'
        );

        $data = $request->validate([
            'document' => ['required', 'file', 'max:10240', 'mimes:pdf,png,jpg,jpeg'],
            'category' => ['required', 'in:diagnosis_support,lab_result,imaging,referral,other'],
        ]);

        $file = $data['document'];
        $path = $file->store('encounter-documents/' . $encounter->id, 'local');

        DB::table('encounter_documents')->insert([
            'encounter_id' => $encounter->id,
            'uploaded_by' => $request->user()->id,
            'category' => $data['category'],
            'original_name' => mb_substr($file->getClientOriginalName(), 0, 255),
            'storage_path' => $path,
            'mime_type' => (string) $file->getMimeType(),
            'size_bytes' => $file->getSize(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Clinical document uploaded securely.');
    }

    public function deleteDocument(Request $request, Encounter $encounter, int $document): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);
        abort_if(
            in_array($encounter->status, ['completed', 'cancelled', 'terminated'], true),
            409,
            'Closed visits cannot be edited.'
        );

        $row = DB::table('encounter_documents')
            ->where('encounter_id', $encounter->id)
            ->where('id', $document)
            ->first();

        abort_unless($row, 404);

        Storage::disk('local')->delete($row->storage_path);
        DB::table('encounter_documents')->where('id', $row->id)->delete();

        return back()->with('success', 'Clinical document removed.');
    }

    public function downloadDocument(Request $request, Encounter $encounter, int $document)
    {
        abort_unless($request->user()->can('appointments.view'), 403);

        $row = DB::table('encounter_documents')
            ->where('encounter_id', $encounter->id)
            ->where('id', $document)
            ->first();

        abort_unless($row && Storage::disk('local')->exists($row->storage_path), 404);

        return Storage::disk('local')->download(
            $row->storage_path,
            $row->original_name,
            [
                'Content-Type' => $row->mime_type,
                'X-Content-Type-Options' => 'nosniff',
            ]
        );
    }

    public function icd11Search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        if (
            app()->environment('local', 'development', 'testing')
            && !filter_var(env('IWC_FORCE_LIVE_INTEGRATIONS', false), FILTER_VALIDATE_BOOL)
        ) {
            $catalogue = [
                ['code' => '1C1A', 'display' => 'Malaria'],
                ['code' => 'CA40', 'display' => 'Pneumonia'],
                ['code' => '5A11', 'display' => 'Type 2 diabetes mellitus'],
                ['code' => 'BA00', 'display' => 'Essential hypertension'],
                ['code' => '1A00', 'display' => 'Cholera'],
                ['code' => 'MG30', 'display' => 'Low back pain'],
            ];

            $matches = array_values(array_filter(
                $catalogue,
                fn ($item) =>
                    str_contains(mb_strtolower($item['display']), mb_strtolower($q))
                    || str_contains(mb_strtolower($item['code']), mb_strtolower($q))
            ));

            return response()->json([
                'results' => $matches,
                'mock' => true,
                'note' => 'Development terminology suggestions; confirm against the official ICD-11 release before clinical coding.',
            ]);
        }

        $clientId = (string) config('services.who_icd11.client_id', env('WHO_ICD11_CLIENT_ID', ''));
        $clientSecret = (string) config('services.who_icd11.client_secret', env('WHO_ICD11_CLIENT_SECRET', ''));

        abort_if(
            $clientId === '' || $clientSecret === '',
            503,
            'WHO ICD-11 API credentials are not configured for this environment.'
        );

        try {
            $tokenResponse = Http::asForm()
                ->timeout(12)
                ->post('https://icdaccessmanagement.who.int/connect/token', [
                    'grant_type' => 'client_credentials',
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'scope' => 'icdapi_access',
                ]);

            if (!$tokenResponse->successful() || !$tokenResponse->json('access_token')) {
                return response()->json(['message' => 'WHO ICD-11 authentication failed.'], 502);
            }

            $response = Http::withToken($tokenResponse->json('access_token'))
                ->withHeaders(['API-Version' => 'v2', 'Accept-Language' => 'en'])
                ->timeout(15)
                ->get(
                    'https://id.who.int/icd/release/11/' . env('WHO_ICD11_RELEASE', '2025-01') . '/mms/search',
                    [
                        'q' => $q,
                        'useFlexisearch' => 'true',
                        'flatResults' => 'true',
                        'highlightingEnabled' => 'false',
                    ]
                );

            if (!$response->successful()) {
                return response()->json(['message' => 'WHO ICD-11 terminology search failed.'], 502);
            }

            $results = collect($response->json('destinationEntities', []))
                ->map(fn ($item) => [
                    'code' => (string) ($item['theCode'] ?? ''),
                    'display' => (string) ($item['title'] ?? ''),
                    'uri' => $item['id'] ?? null,
                ])
                ->filter(fn ($item) => $item['code'] !== '' && $item['display'] !== '')
                ->take(15)
                ->values();

            return response()->json(['results' => $results, 'mock' => false]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'WHO ICD-11 terminology service is unavailable.'], 502);
        }
    }

    public function refreshVisitBenefits(
        Request $request,
        Encounter $encounter,
        EnvironmentAwareIntegrationService $gateway
    ) {
        abort_unless(
            $request->user()->can('appointments.manage')
            || $request->user()->can('sha.eligibility.verify'),
            403
        );

        abort_unless(
            strtolower((string) ($encounter->coverage_type ?: $encounter->payment_type)) === 'sha'
            || filled($encounter->sha_benefit_code),
            422,
            'Benefit lookup is available only for SHA visits.'
        );

        $patient = $encounter->patient()->with('identifiers')->first();

        abort_unless(
            $patient && filled($patient->client_registry_id),
            422,
            'This patient has no verified Client Registry ID. Complete registry lookup before fetching SHA benefits.'
        );

        $identifier = $patient->identifiers->firstWhere('is_primary', true)
            ?? $patient->identifiers->first();

        if (!$identifier) {
            return response()->json([
                'message' => 'No patient identifier is available for the DHA HIE benefit request.',
            ], 422);
        }

        try {
            $response = $gateway->request(
                'dha-hie',
                'patient.benefits',
                'GET',
                '',
                [
                    'patient_id' => $patient->client_registry_id,
                    'id' => $identifier->identifierValue(),
                    'identification_type' => $identifier->type,
                ]
            );

            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            $benefits = $body['benefits'] ?? $body['data'] ?? $body['result'] ?? [];

            if (!is_array($benefits)) {
                $benefits = [];
            }

            return response()->json([
                'environment' => $response['environment'] ?? $gateway->environment(),
                'mock' => (bool) ($response['mock'] ?? false),
                'benefits' => array_values(array_filter($benefits, 'is_array')),
                'note' => ($response['mock'] ?? false)
                    ? 'Development mock benefits; not an official SHA entitlement.'
                    : 'Benefits returned by the configured DHA HIE provider.',
            ], (($response['status'] ?? 500) >= 200 && ($response['status'] ?? 500) < 300) ? 200 : 502);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'DHA HIE benefit lookup failed. Check the configured environment, credentials and patient.benefits endpoint. No mock fallback was used.',
            ], 502);
        }
    }

    public function issueInvoice(Request $request, Encounter $encounter): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);

        abort_if(
            in_array($encounter->status, ['completed', 'cancelled', 'terminated'], true),
            409,
            'A closed visit cannot have its invoice issued.'
        );

        $coverage = strtolower((string) ($encounter->coverage_type ?: $encounter->payment_type ?: 'local'));

        abort_if(
            $coverage === 'sha',
            422,
            'SHA-covered visits use the SHA claims workflow; do not issue a patient-pay invoice for this visit.'
        );

        $items = $encounter->billing_items ?? [];

        if (is_string($items)) {
            $items = json_decode($items, true) ?: [];
        }

        if (!is_array($items)) {
            $items = [];
        }

        $total = round(collect($items)->sum(function ($item) {
            if (!is_array($item)) {
                return 0;
            }

            $quantity = max(0, (float) ($item['quantity'] ?? 1));
            $unitPrice = max(0, (float) ($item['unit_price'] ?? 0));

            return round($quantity * $unitPrice, 2);
        }), 2);

        if ($total <= 0) {
            return back()->withErrors([
                'invoice' => 'Add at least one charge with a positive total before issuing the invoice.',
            ]);
        }

        $reference = $encounter->invoice_reference ?: ('INV-' . $encounter->encounter_number);

        $encounter->forceFill([
            'invoice_status' => 'issued',
            'invoice_total' => $total,
            'invoice_reference' => $reference,
            'invoice_issued_at' => now(),
        ])->save();

        return redirect()
            ->route('visits.show', $encounter)
            ->with('success', 'Invoice ' . $reference . ' issued successfully.');
    }

    public function downloadInvoice(Encounter $encounter)
    {
        $encounter->load('patient:id,medical_record_number,full_name,first_name,middle_name,last_name,date_of_birth,phone,email');

        $items = $encounter->billing_items ?? [];

        if (is_string($items)) {
            $items = json_decode($items, true) ?: [];
        }

        if (!is_array($items)) {
            $items = [];
        }

        $patient = $encounter->patient;

        $patientName = $patient?->full_name ?: trim(implode(' ', array_filter([
            $patient?->first_name,
            $patient?->middle_name,
            $patient?->last_name,
        ])));

        $rows = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $description = trim((string) ($item['description'] ?? $item['name'] ?? $item['code'] ?? ''));

            if ($description === '') {
                continue;
            }

            $qty = max(0.0, (float) ($item['quantity'] ?? 1));
            $unit = max(0.0, (float) ($item['unit_price'] ?? 0));
            $lineTotal = round($qty * $unit, 2);

            $rows[] = [
                'description' => $description,
                'quantity' => $qty,
                'unit_price' => $unit,
                'total' => $lineTotal,
            ];
        }

        $calculatedTotal = round(collect($rows)->sum('total'), 2);
        $total = is_numeric($encounter->invoice_total ?? null)
            ? (float) $encounter->invoice_total
            : $calculatedTotal;

        if (!$rows) {
            $rows[] = [
                'description' => 'Visit services (not itemized)',
                'quantity' => 1,
                'unit_price' => $total,
                'total' => $total,
            ];
        }

        $reference = (string) ($encounter->invoice_reference ?: 'INV-' . $encounter->encounter_number);
        $coverage = strtolower((string) ($encounter->coverage_type ?: $encounter->payment_type ?: 'local'));
        $isSha = $coverage === 'sha';

        /*
         * Facility identity and branding are read from existing system settings.
         * No fictitious business, address, telephone number or payment account is supplied.
         */
        $identity = [];
        $branding = [];
        $paymentSettings = [];

        try {
            $identityRow = SystemSetting::query()->where('key', 'site.identity')->first();
            $identity = is_array($identityRow?->value) ? $identityRow->value : [];

            $brandingRow = SystemSetting::query()
                ->whereIn('key', ['site.branding', 'site.theme'])
                ->orderByRaw("CASE WHEN key = 'site.branding' THEN 0 ELSE 1 END")
                ->first();

            $branding = is_array($brandingRow?->value) ? $brandingRow->value : [];

            $paymentRow = SystemSetting::query()
                ->where('key', 'billing.payment_instructions')
                ->first();

            $paymentSettings = is_array($paymentRow?->value) ? $paymentRow->value : [];
        } catch (\Throwable $exception) {
            report($exception);
        }

        $clinicName = trim((string) ($identity['name'] ?? config('app.name', 'Ivona Wayside Clinic')));

        if ($clinicName === '') {
            $clinicName = 'Ivona Wayside Clinic';
        }

        $clinicTagline = trim((string) ($identity['tagline'] ?? ''));
        $clinicEmail = trim((string) ($identity['email'] ?? ''));
        $clinicPhone = trim((string) ($identity['phone'] ?? ''));
        $clinicAddress = trim((string) ($identity['address'] ?? ''));
        $clinicWebsite = trim((string) ($identity['url'] ?? $identity['website'] ?? ''));

        $patientMrn = trim((string) ($patient?->medical_record_number ?? ''));
        $patientPhone = trim((string) ($patient?->phone ?? ''));
        $patientEmail = trim((string) ($patient?->email ?? ''));

        $primaryHex = (string) (
            $branding['primary_color']
            ?? $branding['primary']
            ?? '#087f5b'
        );

        if (!preg_match('/^#[0-9a-fA-F]{6}$/', $primaryHex)) {
            $primaryHex = '#087f5b';
        }

        $brandR = hexdec(substr($primaryHex, 1, 2)) / 255;
        $brandG = hexdec(substr($primaryHex, 3, 2)) / 255;
        $brandB = hexdec(substr($primaryHex, 5, 2)) / 255;

        /*
         * Load the logo from the database-backed facility identity setting.
         * PNG transparency is composited onto white for the PDF image stream,
         * preserving the intended transparent appearance against white paper.
         * The stored source logo is never modified.
         */
        $logoJpeg = null;
        $logoWidth = 0;
        $logoHeight = 0;

        $logoPath = parse_url((string) ($identity['logo_url'] ?? $identity['logo'] ?? ''), PHP_URL_PATH);
        $relativeLogoPath = null;

        if (is_string($logoPath) && str_starts_with($logoPath, '/storage/')) {
            $relativeLogoPath = substr($logoPath, strlen('/storage/'));
        } elseif (is_string($logoPath) && $logoPath !== '' && !str_starts_with($logoPath, '/')) {
            $relativeLogoPath = ltrim($logoPath, '/');
        }

        if (
            $relativeLogoPath
            && Storage::disk('public')->exists($relativeLogoPath)
            && function_exists('imagecreatefromstring')
            && function_exists('imagejpeg')
        ) {
            try {
                $source = @imagecreatefromstring(Storage::disk('public')->get($relativeLogoPath));

                if ($source !== false) {
                    $logoWidth = imagesx($source);
                    $logoHeight = imagesy($source);

                    $canvas = imagecreatetruecolor($logoWidth, $logoHeight);
                    $white = imagecolorallocate($canvas, 255, 255, 255);

                    imagefill($canvas, 0, 0, $white);
                    imagealphablending($canvas, true);
                    imagecopy($canvas, $source, 0, 0, 0, 0, $logoWidth, $logoHeight);

                    ob_start();
                    imagejpeg($canvas, null, 92);
                    $logoJpeg = ob_get_clean();

                    imagedestroy($source);
                    imagedestroy($canvas);
                }
            } catch (\Throwable $exception) {
                report($exception);
                $logoJpeg = null;
            }
        }

        // ============================================================
        // PDF DRAWING ENGINE
        // ============================================================
        $ops = [];
        
        // Exact width calculation for Helvetica/Helvetica-Bold/Helvetica-Oblique
        $getTextWidth = function($text, $size, $font) {
            $width = 0;
            $len = strlen((string)$text);
            for ($i = 0; $i < $len; $i++) {
                $char = $text[$i];
                if ($font === 'F2' || $font === 'F3') {
                    if (in_array($char, ['i', 'l', 'I', 'j', 't', 'f', 'r', ' '])) $width += 0.35 * $size;
                    elseif (in_array($char, ['m', 'w', 'M', 'W'])) $width += 0.90 * $size;
                    else $width += 0.60 * $size;
                } else {
                    if (in_array($char, ['i', 'l', 'I', 'j', 't', 'f', 'r', ' '])) $width += 0.28 * $size;
                    elseif (in_array($char, ['m', 'w', 'M', 'W'])) $width += 0.85 * $size;
                    else $width += 0.55 * $size;
                }
            }
            return $width;
        };

        $rect = function ($x, $y, $w, $h, $r, $g, $b) use (&$ops) {
            $ops[] = sprintf('%.3f %.3f %.3f rg %.2f %.2f %.2f %.2f re f', $r, $g, $b, $x, $y, $w, $h);
        };
        $line = function ($x1, $y1, $x2, $y2, $r=.86, $g=.89, $b=.93, $width=1) use (&$ops) {
            $ops[] = sprintf('%.3f %.3f %.3f RG %.2f w %.2f %.2f m %.2f %.2f l S', $r, $g, $b, $width, $x1, $y1, $x2, $y2);
        };
        $text = function ($x, $y, $size, $value, $r=.12, $g=.16, $b=.22, $font='F1', $align='L') use (&$ops, $getTextWidth) {
            $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', (string) $value) ?: (string) $value;
            $value = str_replace(["\\", "(", ")", "\r", "\n"], ["\\\\", "\\(", "\\)", ' ', ' '], $value);
            
            if ($align === 'R') {
                $w = $getTextWidth($value, $size, $font);
                $x = $x - $w;
            } elseif ($align === 'C') {
                $w = $getTextWidth($value, $size, $font);
                $x = $x - ($w / 2);
            }
            
            $ops[] = sprintf('%.3f %.3f %.3f rg BT /%s %d Tf %.2f %.2f Td (%s) Tj ET', $r, $g, $b, $font, $size, $x, $y, $value);
        };
        $money = fn ($amount) => 'KES ' . number_format((float) $amount, 2);

        // ============================================================
        // BACKGROUND ARTWORK
        // ============================================================
        $rect(0, 0, 612, 842, 1, 1, 1); // Pure white canvas

        // 1. Dotted Matrix (Behind Logo)
        for ($dx = 30; $dx <= 150; $dx += 10) {
            for ($dy = 720; $dy <= 820; $dy += 10) {
                $ops[] = sprintf('%.3f %.3f %.3f rg %.2f %.2f 1.2 0 360 arc f', $brandR, $brandG, $brandB, $dx, $dy);
            }
        }

        // 2. Elegant Line Waves
        for ($i = 0; $i < 15; $i++) {
            $c = 0.88 + ($i * 0.008); 
            if ($c > 0.95) $c = 0.95;
            $yShift = $i * 2.5;

            $ops[] = sprintf(
                '%.3f %.3f %.3f RG 0.8 w %.2f %.2f m %.2f %.2f %.2f %.2f %.2f %.2f c %.2f %.2f %.2f %.2f %.2f %.2f c S',
                $c, $c, $c, 
                -20, 850 - $yShift,
                100, 800 - $yShift, 
                250, 750 - $yShift, 
                400, 680 - $yShift,
                550, 610 - $yShift, 
                650, 550 - $yShift, 
                650, 480 - $yShift
            );
        }

        // ============================================================
        // HEADER & META
        // ============================================================
        $marginL = 40;
        $marginR = 572;

        // Logo
        if ($logoJpeg !== null && $logoWidth > 0 && $logoHeight > 0) {
            $boxW = 70; $boxH = 60; $boxY = 745;
            $fit = min($boxW / $logoWidth, $boxH / $logoHeight);
            $drawW = $logoWidth * $fit; $drawH = $logoHeight * $fit;
            $drawX = $marginL; $drawY = $boxY + (($boxH - $drawH) / 2);
            $ops[] = sprintf('q %.2f 0 0 %.2f %.2f %.2f cm /ClinicLogo Do Q', $drawW, $drawH, $drawX, $drawY);
        } else {
            $text($marginL, 750, 40, 'SA', $brandR, $brandG, $brandB, 'F2');
        }

        // Title
        $text($marginR, 765, 24, 'Hospital Invoice', 0.10, 0.10, 0.10, 'F2', 'R');
        
        // Meta Block
        $metaY = 740;
        $metaLabelX = 410;
        $text($metaLabelX, $metaY, 9, 'Invoice no:', 0.45, 0.45, 0.45, 'F1', 'L');
        $text($marginR, $metaY, 9, $reference, 0.10, 0.10, 0.10, 'F2', 'R');
        
        $metaY -= 16;
        $text($metaLabelX, $metaY, 9, 'Invoice date:', 0.45, 0.45, 0.45, 'F1', 'L');
        $text($marginR, $metaY, 9, ($encounter->invoice_issued_at ?? $encounter->created_at ?? now())->format('d M Y'), 0.10, 0.10, 0.10, 'F2', 'R');
        
        $metaY -= 16;
        $text($metaLabelX, $metaY, 9, 'Due:', 0.45, 0.45, 0.45, 'F1', 'L');
        $text($marginR, $metaY, 9, now()->addDays(30)->format('d M Y'), 0.10, 0.10, 0.10, 'F2', 'R');

        // ============================================================
        // FROM / BILL TO / SHIP TO
        // ============================================================
        $col1X = $marginL;
        $col2X = 240;
        $col3X = 410;
        $topY = 640;

        // From
        $text($col1X, $topY, 9, 'From', 0.45, 0.45, 0.45, 'F1');
        $text($col1X, $topY - 14, 11, mb_substr($clinicName, 0, 30), 0.10, 0.10, 0.10, 'F2');
        
        $fromLines = array_values(array_filter([
            $clinicTagline !== '' ? $clinicTagline : null,
            $clinicEmail !== '' ? $clinicEmail : null,
            $clinicPhone !== '' ? $clinicPhone : null,
            $clinicAddress !== '' ? $clinicAddress : null,
            $clinicWebsite !== '' ? $clinicWebsite : null,
        ]));
        
        $fy = $topY - 28;
        foreach (array_slice($fromLines, 0, 5) as $l) {
            $text($col1X, $fy, 8, mb_substr($l, 0, 35), 0.35, 0.35, 0.35);
            $fy -= 12;
        }

        // Bill to
        $text($col2X, $topY, 9, 'Bill to', 0.45, 0.45, 0.45, 'F1');
        $text($col2X, $topY - 14, 11, mb_substr($patientName !== '' ? $patientName : 'Patient record', 0, 30), 0.10, 0.10, 0.10, 'F2');
        
        $billLines = array_values(array_filter([
            $patientEmail !== '' ? $patientEmail : null,
            $patientPhone !== '' ? $patientPhone : null,
            $patientMrn !== '' ? 'MRN: ' . $patientMrn : null,
            $clinicAddress !== '' ? $clinicAddress : null,
        ]));
        
        $by = $topY - 28;
        foreach (array_slice($billLines, 0, 4) as $l) {
            $text($col2X, $by, 8, mb_substr($l, 0, 35), 0.35, 0.35, 0.35);
            $by -= 12;
        }

        // Ship to
        $text($col3X, $topY, 9, 'Ship to / Service Location', 0.45, 0.45, 0.45, 'F1');
        $text($col3X, $topY - 14, 8, mb_substr($clinicAddress !== '' ? $clinicAddress : 'Facility Address', 0, 35), 0.35, 0.35, 0.35);
        $text($col3X, $topY - 26, 8, 'Track #: ' . mb_substr((string) $encounter->encounter_number, 0, 24), 0.35, 0.35, 0.35);


        // ============================================================
        // ITEMS TABLE
        // ============================================================
        $tableTop = 500;
        $tableLeft = $marginL;
        $tableWidth = $marginR - $marginL;
        $headerH = 24;

        // Header
        $rect($tableLeft, $tableTop - $headerH, $tableWidth, $headerH, $brandR, $brandG, $brandB);
        
        $cols = [
            'desc' => ['start' => $tableLeft + 10, 'align' => 'L'],
            'rate' => ['start' => 270, 'align' => 'R'],
            'qty'  => ['start' => 330, 'align' => 'R'],
            'tax'  => ['start' => 380, 'align' => 'R'],
            'disc' => ['start' => 440, 'align' => 'R'],
            'amt'  => ['start' => $marginR - 10, 'align' => 'R'],
        ];

        $text($cols['desc']['start'], $tableTop - 16, 8, 'DESCRIPTION', 1, 1, 1, 'F2', 'L');
        $text($cols['rate']['start'], $tableTop - 16, 8, 'RATE/CHARGE', 1, 1, 1, 'F2', 'R');
        $text($cols['qty']['start'],  $tableTop - 16, 8, 'QTY', 1, 1, 1, 'F2', 'R');
        $text($cols['tax']['start'],  $tableTop - 16, 8, 'TAX', 1, 1, 1, 'F2', 'R');
        $text($cols['disc']['start'], $tableTop - 16, 8, 'DISCOUNT', 1, 1, 1, 'F2', 'R');
        $text($cols['amt']['start'],  $tableTop - 16, 8, 'AMOUNT/CHARGE', 1, 1, 1, 'F2', 'R');

        // Rows
        $rowH = 26;
        $y = $tableTop - $headerH;
        foreach (array_slice($rows, 0, 10) as $i => $row) {
            $bg = ($i % 2 === 0) ? [0.98, 0.99, 1.0] : [1, 1, 1];
            $rect($tableLeft, $y - $rowH, $tableWidth, $rowH, $bg[0], $bg[1], $bg[2]);
            
            $text($cols['desc']['start'], $y - 16, 8, mb_substr($row['description'], 0, 45), 0.15, 0.15, 0.15, 'F1', 'L');
            $text($cols['rate']['start'], $y - 16, 8, number_format($row['unit_price'], 2), 0.15, 0.15, 0.15, 'F1', 'R');
            $text($cols['qty']['start'],  $y - 16, 8, rtrim(rtrim(number_format($row['quantity'], 2), '0'), '.'), 0.15, 0.15, 0.15, 'F1', 'R');
            $text($cols['tax']['start'],  $y - 16, 8, '0', 0.15, 0.15, 0.15, 'F1', 'R');
            $text($cols['disc']['start'], $y - 16, 8, '0', 0.15, 0.15, 0.15, 'F1', 'R');
            $text($cols['amt']['start'],  $y - 16, 8, number_format($row['total'], 2), 0.10, 0.10, 0.10, 'F2', 'R');
            
            $y -= $rowH;
        }
        $line($tableLeft, $y, $tableLeft + $tableWidth, $y, $brandR, $brandG, $brandB, 1);


        // ============================================================
        // PAYMENT INSTRUCTION & TOTALS
        // ============================================================
        $blockTop = $y - 40;
        
        $totalsBlockW = 230;
        $totalsBlockX = $marginR - $totalsBlockW;
        $rect($totalsBlockX - 10, $blockTop - 145, $totalsBlockW + 10, 155, 0.97, 0.98, 0.99);

        // Payment Instruction (Left)
        $text($marginL, $blockTop, 10, 'Payment instruction', 0.10, 0.10, 0.10, 'F2');
        
        $paymentLines = array_values(array_filter([
            trim((string) ($paymentSettings['paybill'] ?? '')) !== '' ? 'Paybill: ' . trim((string) $paymentSettings['paybill']) : null,
            trim((string) ($paymentSettings['till'] ?? '')) !== '' ? 'Till: ' . trim((string) $paymentSettings['till']) : null,
            trim((string) ($paymentSettings['account_reference'] ?? '')) !== '' ? 'Account/ref: ' . trim((string) $paymentSettings['account_reference']) : null,
            trim((string) ($paymentSettings['bank_name'] ?? '')) !== '' ? 'Bank: ' . trim((string) $paymentSettings['bank_name']) : null,
            trim((string) ($paymentSettings['account_name'] ?? '')) !== '' ? 'Acc Name: ' . trim((string) $paymentSettings['account_name']) : null,
            trim((string) ($paymentSettings['account_number'] ?? '')) !== '' ? 'Acc No: ' . trim((string) $paymentSettings['account_number']) : null,
            trim((string) ($paymentSettings['payment_note'] ?? '')) !== '' ? trim((string) $paymentSettings['payment_note']) : null,
        ]));
        
        if ($isSha) {
            array_unshift($paymentLines, 'SHA-covered visit: this is a cost summary, not a claim approval.');
        } elseif (!$paymentLines) {
            $paymentLines[] = 'Please quote invoice reference ' . $reference . ' when making payment.';
        }

        $payY = $blockTop - 18;
        foreach (array_slice($paymentLines, 0, 5) as $paymentLine) {
            $text($marginL, $payY, 8, mb_substr($paymentLine, 0, 45), 0.35, 0.35, 0.35);
            $payY -= 14;
        }


        // Totals (Right)
        $totLabelX = $totalsBlockX + 10;
        $totValX = $marginR - 10;
        $totY = $blockTop - 10;
        
        $text($totLabelX, $totY, 9, 'Subtotal:', 0.35, 0.35, 0.35, 'F1', 'L');
        $text($totValX, $totY, 9, number_format($calculatedTotal, 2), 0.10, 0.10, 0.10, 'F2', 'R');
        
        $totY -= 16;
        $text($totLabelX, $totY, 9, 'Discount (0%):', 0.35, 0.35, 0.35, 'F1', 'L');
        $text($totValX, $totY, 9, '0.00', 0.10, 0.10, 0.10, 'F2', 'R');
        
        $totY -= 16;
        $text($totLabelX, $totY, 9, 'Shipping cost:', 0.35, 0.35, 0.35, 'F1', 'L');
        $text($totValX, $totY, 9, '0.00', 0.10, 0.10, 0.10, 'F2', 'R');
        
        $totY -= 16;
        $text($totLabelX, $totY, 9, 'Sales Tax:', 0.35, 0.35, 0.35, 'F1', 'L');
        $text($totValX, $totY, 9, '0.00', 0.10, 0.10, 0.10, 'F2', 'R');
        
        $totY -= 18;
        $text($totLabelX, $totY, 10, 'Total:', 0.10, 0.10, 0.10, 'F2', 'L');
        $text($totValX, $totY, 10, $money($total), 0.10, 0.10, 0.10, 'F2', 'R');
        
        $totY -= 16;
        $text($totLabelX, $totY, 9, 'Amount paid:', 0.35, 0.35, 0.35, 'F1', 'L');
        $text($totValX, $totY, 9, '0.00', 0.10, 0.10, 0.10, 'F2', 'R');
        
        $totY -= 12;
        $line($totLabelX, $totY, $totValX, $totY, 0.85, 0.85, 0.85, 1);

        // Balance Due Highlight
        $totY -= 26;
        $rect($totLabelX - 5, $totY - 6, ($totValX - $totLabelX) + 10, 24, 0.92, 0.96, 0.95); 
        $text($totLabelX, $totY, 10, 'Balance Due:', 0.10, 0.10, 0.10, 'F2', 'L');
        $text($totValX, $totY, 10, $money($total), 0.10, 0.10, 0.10, 'F2', 'R');


        // ============================================================
        // NOTES
        // ============================================================
        $notesY = $totY - 45;
        $text($marginL, $notesY, 10, 'Notes', 0.10, 0.10, 0.10, 'F2', 'L');
        
        $noteLines = [
            'Payment is due within 30 days of the invoice date.',
            'Please include the invoice reference on all payments.',
            'For billing inquiries, please contact the facility.',
        ];
        
        $ny = $notesY - 16;
        foreach ($noteLines as $line) {
            $text($marginL, $ny, 8, $line, 0.35, 0.35, 0.35, 'F1', 'L');
            $ny -= 14;
        }


        // ============================================================
        // SYSTEM GENERATED DISCLAIMER (Centered & Detailed)
        // ============================================================
        $disclaimerY = 110;
        $centerX = 306; // Center of A4 page (612 / 2)
        
        // Line 1
        $text($centerX, $disclaimerY, 9, 'This is a system generated invoice and it needs no signature.', 0.35, 0.35, 0.35, 'F3', 'C');
        
        // Line 2
        $text($centerX, $disclaimerY - 14, 8, 'Generated by ' . $clinicName . ' Billing System on ' . now()->format('d M Y \a\t H:i T') . '.', 0.55, 0.55, 0.55, 'F3', 'C');

        // Line 3
        $text($centerX, $disclaimerY - 26, 8, 'For inquiries regarding this invoice, please contact ' . ($clinicEmail !== '' ? $clinicEmail : 'billing@clinic.com') . '.', 0.55, 0.55, 0.55, 'F3', 'C');


        // ============================================================
        // BUILD PDF
        // ============================================================
        $stream = implode("\n", $ops);
        
        // Added F3 (Helvetica-Oblique) to font resources
        $pageResources = '<< /Font << /F1 4 0 R /F2 5 0 R /F3 8 0 R >>'
            . ($logoJpeg !== null ? ' /XObject << /ClinicLogo 7 0 R >>' : '') . ' >>';

        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources ' . $pageResources . ' /Contents 6 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
            '<< /Length ' . strlen($stream) . ">>\nstream\n" . $stream . "\nendstream",
        ];
        if ($logoJpeg !== null) {
            $objects[] = '<< /Type /XObject /Subtype /Image /Width ' . $logoWidth
                . ' /Height ' . $logoHeight
                . ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '
                . strlen($logoJpeg) . ">>\nstream\n" . $logoJpeg . "\nendstream";
        }
        
        // Add Helvetica-Oblique font object
        $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>';

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [0];
        foreach ($objects as $i => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($i + 1) . " 0 obj\n" . $object . "\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }
        $pdf .= "trailer\n<< /Size " . (count($objects) + 1)
            . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'
                . preg_replace('/[^A-Za-z0-9._-]/', '-', $reference) . '.pdf"',
            'Cache-Control'       => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function completeVisit(Request $request, Encounter $encounter): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);
        if (in_array($encounter->status, ['completed', 'cancelled', 'terminated'], true)) {
            return back()->withErrors(['visit' => 'This visit is already closed.']);
        }
        if (blank($encounter->clinical_assessment) || blank($encounter->icd11_code)) {
            return back()->withErrors(['visit' => 'Complete the clinical assessment and select a valid ICD-11 diagnosis before finishing this visit.']);
        }
        $encounter->forceFill(['status' => 'completed', 'completed_at' => now(), 'finished_at' => now()])->save();
        return redirect()->route('visits.show', $encounter)->with('success', 'Visit completed: '.$encounter->encounter_number.'.');
    }

    /** Start an encounter-scoped DHA claim authorization challenge. */
    public function startShaClaimAuthorization(Request $request, Encounter $encounter, EnvironmentAwareIntegrationService $gateway)
    {
        abort_unless($request->user()->can('sha.claims.submit') || $request->user()->can('appointments.manage'), 403);
        abort_unless($this->isShaEncounter($encounter), 422, 'This encounter is not marked as SHA-covered.');
        abort_if(in_array($encounter->status, ['cancelled', 'terminated'], true), 409, 'A cancelled or terminated visit cannot be authorized for a claim.');
        $patient = $encounter->patient;
        abort_unless($patient && filled($patient->client_registry_id), 422, 'A verified DHA Client Registry ID is required before claim authorization.');
        $interventions = array_values(array_filter(array_unique(array_filter([
            (string) $encounter->sha_sub_benefit_code,
            (string) $encounter->sha_benefit_code,
        ]))));
        abort_if($interventions === [], 422, 'Select a verified SHA benefit/sub-benefit before requesting claim authorization.');
        $correlation = (string) Str::uuid();
        try {
            $response = $gateway->request('dha-hie', 'consent.send_otp', 'POST', '/claims/otp', [
                'patient_id' => $patient->client_registry_id,
                'service_type' => $encounter->visit_type === 'inpatient' ? 'INPATIENT' : 'OUTPATIENT',
                'interventions' => $interventions,
            ], ['X-Correlation-ID' => $correlation]);
            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            if (($response['status'] ?? 500) < 200 || ($response['status'] ?? 500) >= 300 || (($body['status'] ?? '') !== '' && !in_array(strtoupper((string) $body['status']), ['DEV_OTP_ISSUED','OTP_SENT','SENT','PENDING'], true))) {
                return response()->json(['message' => 'DHA did not confirm an OTP challenge. No authorization was stored.'], 502);
            }
            $request->session()->put('visit_sha_claim_auth_'.$encounter->id, [
                'correlation_id' => $correlation, 'patient_id' => $patient->client_registry_id,
                'service_type' => $encounter->visit_type === 'inpatient' ? 'INPATIENT' : 'OUTPATIENT',
                'interventions' => $interventions, 'started_at' => now()->timestamp,
                'environment' => $response['environment'] ?? $gateway->environment(), 'mock' => (bool) ($response['mock'] ?? false),
            ]);
            return response()->json(['ok' => true, 'environment' => $response['environment'] ?? $gateway->environment(), 'mock' => (bool) ($response['mock'] ?? false), 'message' => ($response['mock'] ?? false) ? 'Development-only OTP challenge created; no real SMS was sent.' : 'OTP challenge request accepted by the configured DHA service.']);
        } catch (\Throwable $exception) {
            report($exception);
            return response()->json(['message' => 'DHA authorization challenge failed. No mock fallback was used.'], 502);
        }
    }

    /** Verify fresh authorization and persist the provider token encrypted against this encounter. */
    public function authorizeShaClaim(Request $request, Encounter $encounter, EnvironmentAwareIntegrationService $gateway): RedirectResponse
    {
        abort_unless($request->user()->can('sha.claims.submit') || $request->user()->can('appointments.manage'), 403);
        $data = $request->validate(['otp' => ['required','digits:6']]);
        $challenge = $request->session()->get('visit_sha_claim_auth_'.$encounter->id);
        abort_unless(is_array($challenge) && (int) ($challenge['started_at'] ?? 0) >= now()->subMinutes(10)->timestamp, 422, 'The authorization challenge is missing or expired. Request a new OTP.');
        abort_unless(hash_equals((string) ($challenge['patient_id'] ?? ''), (string) $encounter->patient?->client_registry_id), 422, 'Authorization challenge does not match this encounter patient.');
        try {
            $response = $gateway->request('dha-hie', 'consent.authorize', 'POST', '/claims/authorize', [
                'patient_id' => $challenge['patient_id'], 'service_type' => $challenge['service_type'],
                'otp' => (string) $data['otp'], 'interventions' => $challenge['interventions'],
            ], ['X-Correlation-ID' => $challenge['correlation_id']]);
            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            $providerData = is_array($body['data'] ?? null) ? $body['data'] : $body;
            $status = strtoupper((string) ($providerData['status'] ?? ''));
            $token = $providerData['token'] ?? $providerData['consent_token'] ?? null;
            if (($response['status'] ?? 500) < 200 || ($response['status'] ?? 500) >= 300 || !in_array($status, ['AUTHORIZED','AUTHORIZED_PENDING_VISIT','DEV_AUTHORIZED'], true) || !is_string($token) || $token === '') {
                return back()->withErrors(['authorization' => 'DHA did not return a confirmed authorization token. The claim remains unsubmitted.']);
            }
            DB::transaction(function () use ($request, $encounter, $challenge, $response, $providerData, $token): void {
                PatientConsent::query()->where('encounter_id', $encounter->id)->where('consent_type', 'sha_claim')->where('status', 'granted')->update(['status' => 'superseded', 'updated_at' => now()]);
                PatientConsent::query()->create([
                    'patient_id' => $encounter->patient_id, 'encounter_id' => $encounter->id,
                    'consent_type' => 'sha_claim', 'status' => 'granted', 'method' => 'otp',
                    'provider' => 'dha-hie', 'provider_reference' => (string) ($providerData['guid'] ?? $challenge['correlation_id']),
                    'consent_token' => $token, 'consent_token_hash' => hash('sha256', $token),
                    'requested_at' => now()->setTimestamp((int) $challenge['started_at']), 'granted_at' => now(),
                    'expires_at' => isset($providerData['expires_at']) ? \Illuminate\Support\Carbon::parse($providerData['expires_at']) : null,
                    'captured_by' => $request->user()->id,
                    'provider_metadata' => ['environment' => $response['environment'] ?? $challenge['environment'], 'mock' => (bool) ($response['mock'] ?? false), 'authorization_status' => $providerData['status'] ?? null, 'correlation_id' => $challenge['correlation_id']],
                ]);
                $encounter->forceFill(['claim_status' => 'authorization_ready'])->save();
            });
            $request->session()->forget('visit_sha_claim_auth_'.$encounter->id);
            return back()->with('success', 'Encounter-specific SHA authorization was recorded securely. The claim has not yet been submitted.');
        } catch (\Throwable $exception) {
            report($exception);
            return back()->withErrors(['authorization' => 'DHA authorization verification failed. No local authorization success was recorded.']);
        }
    }

    public function submitShaClaim(Request $request, Encounter $encounter, EnvironmentAwareIntegrationService $gateway): RedirectResponse
    {
        abort_unless($request->user()->can('sha.claims.submit') || $request->user()->can('appointments.manage'), 403);
        abort_unless($this->isShaEncounter($encounter), 422, 'This encounter is not marked as SHA-covered.');
        abort_if(in_array($encounter->status, ['cancelled','terminated'], true), 409, 'Cancelled or terminated visits cannot be claimed.');
        if (($encounter->claim_status ?? null) === 'submitted' || filled($encounter->claim_reference)) return back()->withErrors(['claim' => 'A claim reference already exists for this encounter. Check claim status before any retry.']);
        $patient = $encounter->patient;
        abort_unless($patient && filled($patient->client_registry_id), 422, 'A verified Client Registry ID is required.');
        if (! filled($encounter->clinical_assessment) || ! filled($encounter->icd11_code)) {
            return back()->withErrors(['claim' => 'Complete and save the clinical assessment and ICD-11 diagnosis before submitting this claim.']);
        }
        $items = is_array($encounter->billing_items) ? $encounter->billing_items : [];
        $items = array_values(array_filter($items, fn ($item) => is_array($item) && filled($item['code'] ?? null) && filled($item['description'] ?? null) && (float) ($item['quantity'] ?? 0) > 0));
        if ($items === []) {
            return back()->withErrors(['claim' => 'Add and save at least one billable item with an approved tariff code, description, positive quantity and price before submitting this claim.']);
        }
        $consent = PatientConsent::query()->where('encounter_id', $encounter->id)->where('patient_id', $encounter->patient_id)->where('consent_type', 'sha_claim')->where('status', 'granted')->whereNull('revoked_at')->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))->latest('id')->first();
        if (! $consent || ! filled($consent->consent_token)) {
            return back()->withErrors(['claim' => 'This encounter has no active, encounter-linked SHA authorization. Request and verify authorization before submitting.']);
        }
        // Development must exercise the complete local workflow without requiring real facility/practitioner credentials.
        // The gateway's development branch is deterministic and never transmits this synthetic payload externally.
        if ($gateway->isMockMode()) {
            $correlation = (string) Str::uuid();
            $bundleId = 'DEV-BUNDLE-' . Str::uuid();
            $total = round(collect($items)->sum(fn ($item) => (float) $item['quantity'] * (float) ($item['unit_price'] ?? 0)), 2);
            abort_if($total <= 0, 422, 'Claim total must be greater than zero.');
            try {
                $response = $gateway->request('dha-afyalink', 'claims.submit', 'POST', '/v1/shr-med/bundle', [
                    'bundle_id' => $bundleId,
                    'encounter_id' => $encounter->id,
                    'patient_id' => (string) $patient->client_registry_id,
                    'total' => $total,
                    'line_count' => count($items),
                    'consent_token' => '[SYNTHETIC-DEVELOPMENT-ONLY]',
                ], ['X-Correlation-ID' => $correlation, 'Idempotency-Key' => $bundleId]);
                $body = is_array($response['body'] ?? null) ? $response['body'] : [];
                $data = is_array($body['data'] ?? null) ? $body['data'] : $body;
                if (($response['mock'] ?? false) !== true || ($response['status'] ?? 500) < 200 || ($response['status'] ?? 500) >= 300) {
                    throw new \RuntimeException('Development claim gateway did not return a synthetic success response.');
                }
                $reference = (string) ($data['claim_reference'] ?? $data['claim_id'] ?? $bundleId);
                PatientIntegrationTransaction::query()->create([
                    'correlation_id' => $correlation, 'patient_id' => $patient->id, 'encounter_id' => $encounter->id,
                    'provider' => 'dha-afyalink', 'operation' => 'claims.submit', 'environment' => 'development',
                    'status' => 'mocked', 'http_status' => 200, 'provider_reference' => $reference,
                    'request_body_redacted' => ['bundle_id' => $bundleId, 'line_count' => count($items), 'total' => $total, 'consent_token' => '[REDACTED]'],
                    'response_body_redacted' => ['mock' => true, 'status' => $data['status'] ?? 'DEV_MOCK_SUBMITTED', 'reference' => $reference],
                    'requested_by' => $request->user()->id, 'completed_at' => now(),
                ]);
                $encounter->forceFill(['claim_status' => 'development_mock', 'claim_reference' => $reference, 'claim_submitted_at' => now()])->save();
                return back()->with('success', 'Development claim simulation recorded. No claim was transmitted to SHA. Reference: ' . $reference);
            } catch (\Throwable $exception) {
                report($exception);
                $encounter->forceFill(['claim_status' => 'failed'])->save();
                return back()->withErrors(['claim' => 'The development claim simulation failed. Check the application log; no SHA claim was transmitted.']);
            }
        }

        $facilityId = (string) config('integrations.sha_facility_id', env('DHA_FACILITY_FID', ''));
        $practitionerId = (string) config('integrations.sha_practitioner_id', env('DHA_PRACTITIONER_UID', ''));
        $shaIdentifier = $patient->identifiers()->get()->first(function ($identifier) {
            return in_array(strtolower(str_replace(['_', '-'], ' ', (string) $identifier->type)), ['sha number', 'shanumber', 'sha'], true) && filled($identifier->verified_at);
        });
        $shaNumber = $shaIdentifier ? (string) $shaIdentifier->identifierValue() : '';
        $fhirPrefix = rtrim((string) config('integrations.fhir_prefix', env('DHA_FHIR_PREFIX', '')), '/');
        abort_if($facilityId === '' || $practitionerId === '' || $shaNumber === '' || $fhirPrefix === '', 422, 'Configure the authority-issued facility FID, practitioner UID, patient SHA number and environment FHIR prefix before live claim submission.');
        $claimId = (string) Str::uuid(); $bundleId = (string) Str::uuid();
        $total = round(collect($items)->sum(fn ($item) => (float) $item['quantity'] * (float) ($item['unit_price'] ?? 0)), 2);
        abort_if($total <= 0, 422, 'Claim total must be greater than zero.');
        $patientId = (string) $patient->client_registry_id;
        $coverageId = 'COV-'.substr(hash('sha256', $patientId.'|'.$encounter->id), 0, 20);
        $patientUrl = $fhirPrefix.'/fhir/Patient/'.$patientId;
        $orgUrl = $fhirPrefix.'/fhir/Organization/'.$facilityId;
        $practitionerUrl = $fhirPrefix.'/fhir/Practitioner/'.$practitionerId;
        $coverageUrl = $fhirPrefix.'/fhir/Coverage/'.$coverageId;
        $claimUrl = $fhirPrefix.'/fhir/Claim/'.$claimId;
        $claimItems = [];
        foreach (array_values($items) as $index => $item) {
            $quantity = (float) $item['quantity'];
            $unitPrice = (float) ($item['unit_price'] ?? 0);
            $claimItems[] = [
                'sequence' => $index + 1,
                'productOrService' => ['coding' => [['code' => (string) $item['code'], 'display' => (string) $item['description']]]],
                'quantity' => ['value' => $quantity],
                'unitPrice' => ['value' => $unitPrice, 'currency' => 'KES'],
                'net' => ['value' => round($quantity * $unitPrice, 2), 'currency' => 'KES'],
            ];
        }
        $claimResource = [
            'resourceType' => 'Claim', 'id' => $claimId, 'status' => 'active', 'use' => 'claim',
            'patient' => ['reference' => $patientUrl], 'provider' => ['reference' => $orgUrl],
            'insurance' => [['sequence' => 1, 'focal' => true, 'coverage' => ['reference' => $coverageUrl]]],
            'created' => now()->toDateString(), 'priority' => ['coding' => [['code' => 'normal']]],
            'diagnosis' => [[
                'sequence' => 1,
                'diagnosisCodeableConcept' => ['coding' => [[
                    'system' => $fhirPrefix.'/fhir/CodeSystem/icd-11',
                    'code' => $encounter->icd11_code,
                    'display' => $encounter->icd11_display,
                ]]],
            ]],
            'item' => $claimItems,
            'total' => ['value' => $total, 'currency' => 'KES'],
        ];
        $bundle = [
            'resourceType' => 'Bundle', 'id' => $bundleId, 'type' => 'message',
            'timestamp' => now()->toIso8601String(),
            'meta' => ['profile' => [$fhirPrefix.'/fhir/StructureDefinition/bundle|1.0.0']],
            'entry' => [
                ['fullUrl' => $patientUrl, 'resource' => ['resourceType' => 'Patient', 'id' => $patientId, 'identifier' => [['system' => $fhirPrefix.'/fhir/identifier/shanumber', 'value' => $shaNumber]]]],
                ['fullUrl' => $orgUrl, 'resource' => ['resourceType' => 'Organization', 'id' => $facilityId, 'active' => true, 'name' => (string) config('app.name')]],
                ['fullUrl' => $practitionerUrl, 'resource' => ['resourceType' => 'Practitioner', 'id' => $practitionerId, 'active' => true, 'name' => [['text' => (string) ($request->user()->name ?? 'Authorized practitioner')]]]],
                ['fullUrl' => $coverageUrl, 'resource' => ['resourceType' => 'Coverage', 'id' => $coverageId, 'status' => 'active', 'beneficiary' => ['reference' => $patientUrl, 'type' => 'Patient']]],
                ['fullUrl' => $claimUrl, 'resource' => $claimResource],
            ],
        ];
        $correlation = (string) Str::uuid();
        try {
            $response = $gateway->request('dha-afyalink', 'claims.submit', 'POST', '/v1/shr-med/bundle', $bundle, ['X-Correlation-ID' => $correlation, 'Idempotency-Key' => $bundleId]);
            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            $accepted = ($response['status'] ?? 500) >= 200 && ($response['status'] ?? 500) < 300;
            $data = is_array($body['data'] ?? null) ? $body['data'] : $body;
            $reference = $data['claim_id'] ?? $data['claim_reference'] ?? $data['bundle_id'] ?? $data['id'] ?? null;
            PatientIntegrationTransaction::query()->create([
                'correlation_id' => $correlation, 'patient_id' => $patient->id, 'encounter_id' => $encounter->id,
                'provider' => 'dha-afyalink', 'operation' => 'claims.submit', 'environment' => $response['environment'] ?? $gateway->environment(),
                'status' => $accepted ? (($response['mock'] ?? false) ? 'mocked' : 'succeeded') : 'failed', 'http_status' => $response['status'] ?? null,
                'provider_reference' => is_scalar($reference) ? (string) $reference : null,
                'request_body_redacted' => ['bundle_id' => $bundleId, 'claim_id' => $claimId, 'entry_count' => count($bundle['entry']), 'total' => $total, 'consent_token' => '[REDACTED]'],
                'response_body_redacted' => ['mock' => (bool) ($response['mock'] ?? false), 'status' => $data['status'] ?? null, 'reference' => $reference],
                'requested_by' => $request->user()->id, 'completed_at' => now(),
            ]);
            if (!$accepted) { $encounter->forceFill(['claim_status' => 'failed'])->save(); return back()->withErrors(['claim' => 'The configured claims provider rejected the submission. Check the integration transaction before retrying.']); }
            $encounter->forceFill(['claim_status' => ($response['mock'] ?? false) ? 'development_mock' : 'submitted', 'claim_reference' => is_scalar($reference) ? (string) $reference : $claimId, 'claim_submitted_at' => now()])->save();
            return back()->with('success', ($response['mock'] ?? false) ? 'Development claim simulation recorded. No claim was transmitted to SHA.' : 'Claim bundle submitted to the configured DHA AfyaLink endpoint. Provider reference: '.(string) ($reference ?? $claimId));
        } catch (\Throwable $exception) {
            report($exception);
            $encounter->forceFill(['claim_status' => 'submission_unknown'])->save();
            return back()->withErrors(['claim' => 'Claim submission outcome is unknown due to an integration failure. Check the provider status by the unique bundle ID before retrying to avoid duplicates.']);
        }
    }

    private function isShaEncounter(Encounter $encounter): bool
    {
        return strtolower((string) ($encounter->coverage_type ?: $encounter->payment_type)) === 'sha';
    }

    public function preauthorizations(): Response
    {
        // Show recorded integration activity only. Do not manufacture authorization states.
        $transactions = PatientIntegrationTransaction::query()
            ->with(['patient:id,medical_record_number,full_name', 'encounter:id,encounter_number'])
            ->where(function ($query): void {
                $query->whereRaw('LOWER(operation) LIKE ?', ['%preauthor%'])
                    ->orWhereRaw('LOWER(operation) LIKE ?', ['%pre-auth%'])
                    ->orWhereRaw('LOWER(operation) LIKE ?', ['%pre_auth%']);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (PatientIntegrationTransaction $transaction) => [
                'id' => $transaction->id,
                'provider' => $transaction->provider,
                'operation' => $transaction->operation,
                'environment' => $transaction->environment,
                'status' => $transaction->status,
                'http_status' => $transaction->http_status,
                'provider_reference' => $transaction->provider_reference,
                'patient_name' => $transaction->patient?->full_name,
                'medical_record_number' => $transaction->patient?->medical_record_number,
                'encounter_number' => $transaction->encounter?->encounter_number,
                'created_at' => $transaction->created_at?->toIso8601String(),
                'completed_at' => $transaction->completed_at?->toIso8601String(),
                'error_code' => $transaction->error_code,
            ]);

        return Inertia::render('preauthorizations/index', [
            'transactions' => $transactions,
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
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
        $status = strtoupper((string) ($encounter->invoice_status ?: 'DRAFT'));
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

        // A4-sized vector PDF drawing surface.
        $ops = [];

        $rect = function ($x, $y, $w, $h, $r, $g, $b) use (&$ops) {
            $ops[] = sprintf(
                '%.3f %.3f %.3f rg %.2f %.2f %.2f %.2f re f',
                $r, $g, $b, $x, $y, $w, $h
            );
        };

        $line = function ($x1, $y1, $x2, $y2, $r = .86, $g = .89, $b = .93, $width = 1) use (&$ops) {
            $ops[] = sprintf(
                '%.3f %.3f %.3f RG %.2f w %.2f %.2f m %.2f %.2f l S',
                $r, $g, $b, $width, $x1, $y1, $x2, $y2
            );
        };

        $text = function ($x, $y, $size, $value, $r = .12, $g = .16, $b = .22, $font = 'F1') use (&$ops) {
            $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', (string) $value) ?: (string) $value;
            $value = str_replace(
                ["\\", "(", ")", "\r", "\n"],
                ["\\\\", "\\(", "\\)", ' ', ' '],
                $value
            );

            $ops[] = sprintf(
                '%.3f %.3f %.3f rg BT /%s %d Tf %.2f %.2f Td (%s) Tj ET',
                $r, $g, $b, $font, $size, $x, $y, $value
            );
        };

        $money = fn ($amount) => 'KES ' . number_format((float) $amount, 2);

        // White page and faint diagonal line artwork, behind invoice content.
        $rect(0, 0, 612, 842, 1, 1, 1);

        for ($i = 0; $i < 22; $i++) {
            $yy = 838 - ($i * 2.6);

            $ops[] = sprintf(
                '0.925 0.945 0.935 RG 0.35 w 0 %.2f m 612 %.2f l S',
                $yy,
                $yy - 235
            );
        }

        for ($i = 0; $i < 12; $i++) {
            $yy = 440 - ($i * 3.2);

            $ops[] = sprintf(
                '0.965 0.972 0.968 RG 0.25 w 0 %.2f m 612 %.2f l S',
                $yy,
                $yy - 90
            );
        }

        // Branded header.
        $rect(0, 730, 612, 112, $brandR, $brandG, $brandB);

        if ($logoJpeg !== null && $logoWidth > 0 && $logoHeight > 0) {
            $fit = min(46 / $logoWidth, 46 / $logoHeight);
            $drawW = $logoWidth * $fit;
            $drawH = $logoHeight * $fit;
            $drawX = 42 + (46 - $drawW) / 2;
            $drawY = 758 + (46 - $drawH) / 2;

            $rect(38, 754, 54, 54, 1, 1, 1);
            $ops[] = sprintf(
                'q %.2f 0 0 %.2f %.2f %.2f cm /ClinicLogo Do Q',
                $drawW,
                $drawH,
                $drawX,
                $drawY
            );
        }

        $text(105, 790, 10, mb_substr($clinicName, 0, 36), .90, .96, 1, 'F2');

        if ($clinicTagline !== '') {
            $text(105, 777, 7, mb_substr($clinicTagline, 0, 48), .88, .95, 1);
        }

        $text(105, 762, 23, 'HOSPITAL INVOICE', 1, 1, 1, 'F2');
        $text(105, 744, 8, 'VISIT BILLING STATEMENT  |  KENYAN SHILLING (KES)', .90, .96, 1);

        $text(414, 792, 8, 'INVOICE REFERENCE', .82, .91, 1, 'F2');
        $text(414, 775, 10, mb_substr($reference, 0, 28), 1, 1, 1, 'F2');
        $text(414, 755, 8, 'ISSUE DATE', .82, .91, 1, 'F2');
        $text(
            414,
            740,
            9,
            ($encounter->invoice_issued_at ?? $encounter->created_at ?? now())->format('d M Y'),
            1,
            1,
            1
        );

        if ($clinicPhone !== '') {
            $text(414, 727, 7, mb_substr($clinicPhone, 0, 28), .88, .95, 1);
        }

        // FROM / BILL TO / SHIP TO — all values originate from the clinic and patient records.
        $panelY = 626;
        $panelH = 82;
        $panelW = 172;
        $panelXs = [36, 220, 404];

        foreach ($panelXs as $panelX) {
            $rect($panelX, $panelY, $panelW, $panelH, .96, .975, .99);
        }

        // From: clinic identity.
        $text(47, 688, 8, 'FROM', .28, .39, .54, 'F2');
        $text(47, 670, 10, mb_substr($clinicName, 0, 27), .08, .12, .20, 'F2');

        $fromLines = array_values(array_filter([
            $clinicTagline !== '' ? $clinicTagline : null,
            $clinicEmail !== '' ? $clinicEmail : null,
            $clinicPhone !== '' ? $clinicPhone : null,
            $clinicAddress !== '' ? $clinicAddress : null,
            $clinicWebsite !== '' ? $clinicWebsite : null,
        ], fn ($value) => is_string($value) && trim($value) !== ''));

        $lineY = 655;

        foreach (array_slice($fromLines, 0, 4) as $fromLine) {
            $text(47, $lineY, 7, mb_substr($fromLine, 0, 29), .28, .35, .43);
            $lineY -= 11;
        }

        // Bill to: patient demographics.
        $text(231, 688, 8, 'BILL TO', .28, .39, .54, 'F2');
        $text(
            231,
            670,
            10,
            mb_substr($patientName !== '' ? $patientName : 'Patient record', 0, 26),
            .08,
            .12,
            .20,
            'F2'
        );

        $billLines = array_values(array_filter([
            $patientMrn !== '' ? 'MRN: ' . $patientMrn : null,
            $patientPhone !== '' ? 'Phone: ' . $patientPhone : null,
            $patientEmail !== '' ? $patientEmail : null,
        ], fn ($value) => is_string($value) && trim($value) !== ''));

        $lineY = 655;

        foreach (array_slice($billLines, 0, 4) as $billLine) {
            $text(231, $lineY, 7, mb_substr($billLine, 0, 29), .28, .35, .43);
            $lineY -= 11;
        }

        // Ship to: clinic service location and actual encounter reference.
        $text(415, 688, 8, 'SHIP TO / SERVICE LOCATION', .28, .39, .54, 'F2');
        $text(415, 670, 10, mb_substr($clinicName, 0, 26), .08, .12, .20, 'F2');

        $shipLines = array_values(array_filter([
            $clinicAddress !== '' ? $clinicAddress : null,
            'Encounter: ' . (string) $encounter->encounter_number,
            'Visit: ' . strtoupper((string) ($encounter->visit_type ?: 'Not recorded')),
            $clinicPhone !== '' ? 'Facility phone: ' . $clinicPhone : null,
        ], fn ($value) => is_string($value) && trim($value) !== ''));

        $lineY = 655;

        foreach (array_slice($shipLines, 0, 4) as $shipLine) {
            $text(415, $lineY, 7, mb_substr($shipLine, 0, 29), .28, .35, .43);
            $lineY -= 11;
        }

        // Itemized charges.
        $text(38, 596, 12, 'ITEMIZED CHARGES', .08, .12, .20, 'F2');
        $text(38, 581, 8, 'Review the services and amounts recorded against this encounter.', .36, .42, .49);

        $rect(36, 544, 540, 25, $brandR, $brandG, $brandB);
        $text(48, 553, 8, 'DESCRIPTION', 1, 1, 1, 'F2');
        $text(346, 553, 8, 'QTY', 1, 1, 1, 'F2');
        $text(394, 553, 8, 'UNIT PRICE', 1, 1, 1, 'F2');
        $text(500, 553, 8, 'AMOUNT', 1, 1, 1, 'F2');

        $y = 523;

        foreach (array_slice($rows, 0, 12) as $index => $row) {
            if ($index % 2 === 0) {
                $rect(36, $y - 8, 540, 24, .97, .98, 1);
            }

            $text(48, $y, 8, mb_substr($row['description'], 0, 42), .12, .16, .22);
            $text(
                350,
                $y,
                8,
                rtrim(rtrim(number_format($row['quantity'], 2), '0'), '.'),
                .20,
                .25,
                .31
            );
            $text(394, $y, 8, number_format($row['unit_price'], 2), .20, .25, .31);
            $text(492, $y, 8, number_format($row['total'], 2), .08, .12, .20, 'F2');

            $line(36, $y - 9, 576, $y - 9, .90, .92, .95, .5);
            $y -= 25;
        }

        if (count($rows) > 12) {
            $text(
                48,
                $y,
                8,
                'Additional items omitted from this summary. Refer to the encounter billing record.',
                .42,
                .45,
                .50
            );
        }

        // Totals panel.
        $totalY = max(280, $y - 34);

        $rect(330, $totalY - 48, 246, 70, .93, .97, 1);
        $text(344, $totalY + 2, 9, 'SUBTOTAL', .28, .35, .43);
        $text(475, $totalY + 2, 9, number_format($calculatedTotal, 2), .08, .12, .20, 'F2');

        $line(344, $totalY - 8, 562, $totalY - 8, .78, .84, .92, .7);

        $text(344, $totalY - 28, 10, 'TOTAL DUE', .08, .12, .20, 'F2');
        $text(430, $totalY - 28, 13, $money($total), $brandR, $brandG, $brandB, 'F2');

        // Payment instructions: only configured values are displayed.
        $text(38, 230, 9, 'PAYMENT & BILLING NOTES', .08, .12, .20, 'F2');

        $paymentLines = array_values(array_filter([
            trim((string) ($paymentSettings['paybill'] ?? '')) !== ''
                ? 'Paybill: ' . trim((string) $paymentSettings['paybill'])
                : null,
            trim((string) ($paymentSettings['till'] ?? '')) !== ''
                ? 'Till: ' . trim((string) $paymentSettings['till'])
                : null,
            trim((string) ($paymentSettings['account_reference'] ?? '')) !== ''
                ? 'Account/reference: ' . trim((string) $paymentSettings['account_reference'])
                : null,
            trim((string) ($paymentSettings['bank_name'] ?? '')) !== ''
                ? 'Bank: ' . trim((string) $paymentSettings['bank_name'])
                : null,
            trim((string) ($paymentSettings['account_name'] ?? '')) !== ''
                ? 'Account name: ' . trim((string) $paymentSettings['account_name'])
                : null,
            trim((string) ($paymentSettings['account_number'] ?? '')) !== ''
                ? 'Account number: ' . trim((string) $paymentSettings['account_number'])
                : null,
            trim((string) ($paymentSettings['payment_note'] ?? '')) !== ''
                ? trim((string) $paymentSettings['payment_note'])
                : null,
        ], fn ($value) => is_string($value) && trim($value) !== ''));

        if ($isSha) {
            array_unshift(
                $paymentLines,
                'SHA-covered visit: this is a cost summary, not a claim approval or proof of payment.'
            );
        } elseif (!$paymentLines) {
            $paymentLines[] = 'Please quote invoice reference ' . $reference . ' when making payment.';
        }

        $paymentY = 212;

        foreach (array_slice($paymentLines, 0, 3) as $paymentLine) {
            $text(38, $paymentY, 7, mb_substr($paymentLine, 0, 108), .30, .36, .43);
            $paymentY -= 12;
        }

        $text(
            38,
            $paymentY,
            7,
            'Invoice status: ' . $status . '  |  Generated: ' . now()->format('d M Y H:i T'),
            .30,
            .36,
            .43
        );

        if ($isSha) {
            $text(
                38,
                $paymentY - 12,
                7,
                'SHA claim status: ' . strtoupper((string) ($encounter->claim_status ?: 'NOT SUBMITTED')),
                .30,
                .36,
                .43
            );
        }

        // Signature / payment reference lines.
        $line(38, 126, 230, 126, .67, .73, .80, .8);
        $text(38, 111, 8, 'Authorized by / billing officer', .35, .40, .48);

        $line(340, 126, 570, 126, .67, .73, .80, .8);
        $text(340, 111, 8, 'Payment reference / receipt number (if applicable)', .35, .40, .48);

        // Footer.
        $rect(0, 0, 612, 48, .95, .97, .99);

        $text(
            38,
            28,
            7,
            mb_substr($clinicName, 0, 48) . '  |  Confidential patient billing information',
            .32,
            .39,
            .48
        );

        $text(
            38,
            15,
            7,
            'Reference: ' . mb_substr($reference, 0, 38) . '  |  Not a receipt',
            .45,
            .50,
            .57
        );

        // Build the PDF.
        $stream = implode("\n", $ops);

        $pageResources = '<< /Font << /F1 4 0 R /F2 5 0 R >>'
            . ($logoJpeg !== null ? ' /XObject << /ClinicLogo 7 0 R >>' : '')
            . ' >>';

        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources '
                . $pageResources . ' /Contents 6 0 R >>',
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

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [0];

        foreach ($objects as $index => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($index + 1) . " 0 obj\n" . $object . "\nendobj\n";
        }

        $xref = strlen($pdf);

        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";

        for ($index = 1; $index <= count($objects); $index++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$index]);
        }

        $pdf .= "trailer\n<< /Size " . (count($objects) + 1)
            . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'
                . preg_replace('/[^A-Za-z0-9._-]/', '-', $reference) . '.pdf"',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function completeVisit(Request $request, Encounter $encounter): RedirectResponse
    {
        if (in_array($encounter->status, ['completed', 'cancelled'], true)) {
            return back()->withErrors(['visit' => 'This visit is already completed or cancelled.']);
        }

        $encounter->forceFill([
            'status' => 'completed',
            'completed_at' => now(),
        ])->save();

        return redirect()
            ->route('visits.show', $encounter)
            ->with('success', 'Visit completed: ' . $encounter->encounter_number . '.');
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
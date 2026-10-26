<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\PatientIntegrationTransaction;
use App\Services\Integrations\EnvironmentAwareIntegrationService;
use Illuminate\Support\Str;
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
                'patient_name' => $encounter->patient?->full_name ?: trim(implode(' ', array_filter([$encounter->patient?->first_name, $encounter->patient?->middle_name, $encounter->patient?->last_name]))),
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
        $encounter->load(['patient:id,public_id,medical_record_number,full_name,first_name,middle_name,last_name,date_of_birth,sex,gender,phone,email,registration_source,status', 'principalMember:id,medical_record_number,full_name']);
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
                'billing_items' => is_array($encounter->billing_items ?? null) ? $encounter->billing_items : (is_string($encounter->billing_items ?? null) ? (json_decode($encounter->billing_items, true) ?: []) : []),
                'claim_status' => $encounter->claim_status ?? null,
                'claim_reference' => $encounter->claim_reference ?? null,
                'claim_submitted_at' => isset($encounter->claim_submitted_at) ? $encounter->claim_submitted_at?->toIso8601String() : null,
                'documents' => [],
                'patient' => $encounter->patient ? [
                    'id' => $encounter->patient->id,
                    'public_id' => $encounter->patient->public_id,
                    'medical_record_number' => $encounter->patient->medical_record_number,
                    'full_name' => $encounter->patient->full_name ?: trim(implode(' ', array_filter([$encounter->patient->first_name, $encounter->patient->middle_name, $encounter->patient->last_name]))),
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
            'can' => ['complete' => request()->user()->can('appointments.manage'), 'manage' => request()->user()->can('appointments.manage'), 'claim' => request()->user()->can('sha.claims.submit') || request()->user()->can('appointments.manage')],
            'flash' => ['success' => session('success')],
        ]);
    }


    public function refreshVisitBenefits(Request $request, Encounter $encounter, EnvironmentAwareIntegrationService $gateway)
    {
        abort_unless($request->user()->can('appointments.manage') || $request->user()->can('sha.eligibility.verify'), 403);
        abort_unless(strtolower((string) ($encounter->coverage_type ?: $encounter->payment_type)) === 'sha' || filled($encounter->sha_benefit_code), 422, 'Benefit lookup is available only for SHA visits.');
        $patient = $encounter->patient()->with('identifiers')->first();
        abort_unless($patient && filled($patient->client_registry_id), 422, 'This patient has no verified Client Registry ID. Complete registry lookup before fetching SHA benefits.');
        $identifier = $patient->identifiers->firstWhere('is_primary', true) ?? $patient->identifiers->first();
        if (!$identifier) {
            return response()->json(['message' => 'No patient identifier is available for the DHA HIE benefit request.'], 422);
        }
        try {
            $response = $gateway->request('dha-hie', 'patient.benefits', 'GET', '', [
                'patient_id' => $patient->client_registry_id,
                'id' => $identifier->identifierValue(),
                'identification_type' => $identifier->type,
            ]);
            $body = is_array($response['body'] ?? null) ? $response['body'] : [];
            $benefits = $body['benefits'] ?? $body['data'] ?? $body['result'] ?? [];
            if (!is_array($benefits)) $benefits = [];
            return response()->json([
                'environment' => $response['environment'] ?? $gateway->environment(),
                'mock' => (bool) ($response['mock'] ?? false),
                'benefits' => array_values(array_filter($benefits, 'is_array')),
                'note' => ($response['mock'] ?? false) ? 'Development mock benefits; not an official SHA entitlement.' : 'Benefits returned by the configured DHA HIE provider.',
            ], (($response['status'] ?? 500) >= 200 && ($response['status'] ?? 500) < 300) ? 200 : 502);
        } catch (\Throwable $exception) {
            report($exception);
            return response()->json(['message' => 'DHA HIE benefit lookup failed. Check the configured environment, credentials and patient.benefits endpoint. No mock fallback was used.'], 502);
        }
    }

    public function downloadInvoice(Encounter $encounter)
    {
        $encounter->load('patient:id,medical_record_number,full_name,first_name,middle_name,last_name,date_of_birth');
        abort_unless($encounter->exists, 404);

        $items = $encounter->billing_items ?? [];
        if (is_string($items)) {
            $decoded = json_decode($items, true);
            $items = is_array($decoded) ? $decoded : [];
        }
        if (!is_array($items)) {
            $items = [];
        }

        $patient = $encounter->patient;
        $patientName = $patient?->full_name ?: trim(implode(' ', array_filter([
            $patient?->first_name, $patient?->middle_name, $patient?->last_name,
        ])));
        $total = 0.0;
        $lines = [
            'IVONA WAYSIDE CLINIC',
            'VISIT INVOICE / COST SUMMARY',
            '',
            'Invoice reference: INV-' . $encounter->encounter_number,
            'Encounter: ' . $encounter->encounter_number,
            'Patient: ' . ($patientName ?: 'Patient'),
            'MRN: ' . ($patient?->medical_record_number ?: 'Not recorded'),
            'Visit type: ' . strtoupper((string) $encounter->visit_type),
            'Coverage: ' . strtoupper((string) ($encounter->coverage_type ?: $encounter->payment_type ?: 'Not specified')),
            'Date: ' . optional($encounter->arrived_at)->format('d M Y H:i'),
            '',
            'CHARGE ITEMS',
            'Description                         Qty       Unit (KES)      Total (KES)',
            str_repeat('-', 78),
        ];

        foreach ($items as $item) {
            if (!is_array($item)) continue;
            $description = (string) ($item['description'] ?? $item['name'] ?? $item['code'] ?? 'Charge');
            $qty = max(0, (float) ($item['quantity'] ?? 1));
            $unit = max(0, (float) ($item['unit_price'] ?? $item['unitPrice'] ?? 0));
            $lineTotal = isset($item['total']) && is_numeric($item['total']) ? (float) $item['total'] : $qty * $unit;
            $total += $lineTotal;
            $lines[] = sprintf('%-35s %5s %14s %16s',
                mb_substr($description, 0, 35),
                rtrim(rtrim(number_format($qty, 2, '.', ''), '0'), '.'),
                number_format($unit, 2),
                number_format($lineTotal, 2)
            );
        }

        if (count($items) === 0) {
            $total = (float) ($encounter->invoice_total ?? 0);
            $lines[] = 'No itemized charge lines recorded.';
        } elseif (is_numeric($encounter->invoice_total ?? null)) {
            $total = (float) $encounter->invoice_total;
        }

        $lines[] = str_repeat('-', 78);
        $lines[] = 'TOTAL (KES): ' . number_format($total, 2);
        $lines[] = '';
        $lines[] = 'Status: ' . strtoupper((string) ($encounter->invoice_status ?: 'draft'));
        $lines[] = 'This document is an invoice/cost reference, not proof of payment.';
        if (strtolower((string) ($encounter->coverage_type ?: $encounter->payment_type)) === 'sha') {
            $lines[] = 'SHA claim status: ' . strtoupper((string) ($encounter->claim_status ?: 'not submitted'));
        }
        $lines[] = '';
        $lines[] = 'Generated: ' . now()->format('d M Y H:i T');

        // Build a small, standards-compliant one-page PDF without requiring an
        // optional PDF package. All text is escaped for PDF string syntax.
        $escape = static fn (string $s): string => str_replace(
            ['\\', '(', ')', "\r", "\n"],
            ['\\\\', '\\(', '\\)', ' ', ' '],
            iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s) ?: $s
        );
        $stream = "BT\n/F1 10 Tf\n48 790 Td\n14 TL\n";
        foreach ($lines as $index => $line) {
            if ($index > 0) $stream .= "T*\n";
            $stream .= '(' . $escape((string) $line) . ") Tj\n";
        }
        $stream .= "ET";
        $objects = [];
        $objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
        $objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
        $objects[] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
        $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
        $objects[] = '<< /Length ' . strlen($stream) . " >>\nstream\n" . $stream . "\nendstream";
        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [0];
        foreach ($objects as $i => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($i + 1) . " 0 obj\n" . $object . "\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="invoice-' . preg_replace('/[^A-Za-z0-9._-]/', '-', (string) $encounter->encounter_number) . '.pdf"',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function completeVisit(Request $request, Encounter $encounter): RedirectResponse
    {
        if (in_array($encounter->status, ['completed', 'cancelled'], true)) {
            return back()->withErrors(['visit' => 'This visit is already completed or cancelled.']);
        }
        $encounter->forceFill(['status' => 'completed', 'completed_at' => now()])->save();
        return redirect()->route('visits.show', $encounter)->with('success', 'Visit completed: ' . $encounter->encounter_number . '.');
    }

    public function preauthorizations(): Response
    {
        // Show recorded integration activity only. Do not manufacture authorization states
        // or imply a live SHA preauthorization operation exists when none is recorded.
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

        return Inertia::render('preauthorizations/index', ['transactions' => $transactions]);
    }
}

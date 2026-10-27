<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShaClaimsController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('sha.claims.view') || $request->user()->can('sha.claims.submit') || $request->user()->can('appointments.manage'), 403);
        $term = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', 'all'));
        $query = Encounter::query()
            ->with('patient:id,medical_record_number,full_name,first_name,middle_name,last_name')
            ->where(function ($q) { $q->where('coverage_type', 'sha')->orWhere('payment_type', 'sha'); });
        if ($term !== '') $query->where(function ($q) use ($term) {
            $q->where('encounter_number', 'like', "%{$term}%")
              ->orWhere('claim_reference', 'like', "%{$term}%")
              ->orWhereHas('patient', fn ($p) => $p->where('full_name', 'like', "%{$term}%")->orWhere('medical_record_number', 'like', "%{$term}%"));
        });
        if ($status === 'submitted') $query->whereNotNull('claim_submitted_at');
        elseif ($status === 'outstanding') $query->whereNull('claim_submitted_at');
        elseif ($status === 'failed') $query->whereIn('claim_status', ['failed', 'rejected', 'error']);
        $claims = $query->latest('updated_at')->paginate(20)->withQueryString()->through(function (Encounter $e) {
            $patient = $e->patient;
            return [
                'id' => $e->id,
                'encounter_number' => $e->encounter_number,
                'patient_name' => $patient?->full_name ?: trim(implode(' ', array_filter([$patient?->first_name, $patient?->middle_name, $patient?->last_name]))),
                'medical_record_number' => $patient?->medical_record_number,
                'visit_type' => $e->visit_type,
                'visit_status' => $e->status,
                'eligibility' => $e->sha_eligibility_status,
                'preauthorization' => $e->sha_preauthorization_status,
                'invoice_status' => $e->invoice_status,
                'invoice_total' => (float) ($e->invoice_total ?? 0),
                'claim_status' => $e->claim_status,
                'claim_reference' => $e->claim_reference,
                'claim_submitted_at' => $e->claim_submitted_at?->toIso8601String(),
                'benefit' => $e->sha_benefit_name,
                'can_review' => true,
                'clinical_assessment' => $e->clinical_assessment,
                'icd11_code' => $e->icd11_code,
                'icd11_display' => $e->icd11_display,
                'billing_items' => is_array($e->billing_items) ? $e->billing_items : [],
                'claim_submitter' => DB::table('patient_integration_transactions as t')->leftJoin('users as u', 'u.id', '=', 't.requested_by')->where('t.encounter_id', $e->id)->where('t.operation', 'claims.submit')->orderByDesc('t.created_at')->value(DB::raw("COALESCE(u.name, u.email)")),
                'claim_transaction_status' => DB::table('patient_integration_transactions')->where('encounter_id', $e->id)->where('operation', 'claims.submit')->orderByDesc('created_at')->value('status'),
                'claim_environment' => DB::table('patient_integration_transactions')->where('encounter_id', $e->id)->where('operation', 'claims.submit')->orderByDesc('created_at')->value('environment'),
                'claim_provider_reference' => DB::table('patient_integration_transactions')->where('encounter_id', $e->id)->where('operation', 'claims.submit')->orderByDesc('created_at')->value('provider_reference'),
                'created_at' => $e->created_at?->toIso8601String(),
                'visit_completed_at' => $e->completed_at?->toIso8601String(),
            ];
        });
        return Inertia::render('operations/sha-claims/index', [
            'claims' => $claims,
            'filters' => ['q' => $term, 'status' => $status],
            'canSubmit' => $request->user()->can('sha.claims.submit') || $request->user()->can('appointments.manage'),
            'environment' => config('integrations.environment', 'development'),
        ]);
    }
}

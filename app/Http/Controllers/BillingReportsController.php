<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class BillingReportsController extends Controller
{
    public function billing(Request $request): Response
    {
        $term = trim((string) $request->query('q', ''));
        $invoiceStatus = trim((string) $request->query('invoice_status', ''));
        $coverage = trim((string) $request->query('coverage', ''));

        $base = Encounter::query()->with('patient:id,medical_record_number,full_name,first_name,middle_name,last_name');
        $this->applySearch($base, $term);
        $this->applyCoverage($base, $coverage);

        $summaryQuery = clone $base;
        $summary = [
            'total' => (clone $summaryQuery)->count(),
            'draft' => (clone $summaryQuery)->where('invoice_status', 'draft')->count(),
            'issued' => (clone $summaryQuery)->where('invoice_status', 'issued')->count(),
            'value' => (float) (clone $summaryQuery)->whereIn('invoice_status', ['draft', 'issued', 'paid', 'partially_paid'])->sum('invoice_total'),
        ];

        $rows = clone $base;
        if ($invoiceStatus !== '') {
            $rows->where('invoice_status', $invoiceStatus);
        }

        $invoices = $rows->latest('arrived_at')->paginate(15)->withQueryString()->through(function (Encounter $e) {
            $items = is_array($e->billing_items) ? $e->billing_items : [];
            return [
                'id' => $e->id,
                'encounter_number' => $e->encounter_number,
                'patient_name' => $e->patient?->full_name ?: trim(implode(' ', array_filter([$e->patient?->first_name, $e->patient?->middle_name, $e->patient?->last_name]))),
                'mrn' => $e->patient?->medical_record_number,
                'visit_type' => $e->visit_type,
                'department' => $e->department,
                'coverage' => $e->coverage_type ?: $e->payment_type,
                'invoice_status' => $e->invoice_status ?: 'not_required',
                'invoice_reference' => $e->invoice_reference,
                'invoice_total' => (float) ($e->invoice_total ?? 0),
                'item_count' => count(array_filter($items, fn ($item) => is_array($item) && filled($item['description'] ?? null))),
                'arrived_at' => $e->arrived_at?->toIso8601String(),
                'claim_status' => $e->claim_status,
                'visit_url' => route('visits.show', $e),
            ];
        });

        return Inertia::render('billing/index', [
            'summary' => $summary,
            'invoices' => $invoices,
            'filters' => ['q' => $term, 'invoice_status' => $invoiceStatus, 'coverage' => $coverage],
        ]);
    }

    public function reports(Request $request): Response
    {
        $from = $request->date('from') ?: now()->subDays(6)->startOfDay();
        $to = $request->date('to') ?: now()->endOfDay();
        if ($from->gt($to)) {
            [$from, $to] = [$to->copy()->startOfDay(), $from->copy()->endOfDay()];
        }

        $query = Encounter::query()->whereBetween('arrived_at', [$from->copy()->startOfDay(), $to->copy()->endOfDay()]);
        $encounters = (clone $query)->get(['id','status','visit_type','department','coverage_type','payment_type','invoice_status','invoice_total','claim_status','arrived_at']);

        $daily = [];
        $cursor = $from->copy()->startOfDay();
        $end = $to->copy()->startOfDay();
        while ($cursor->lte($end) && count($daily) < 93) {
            $key = $cursor->toDateString();
            $daily[] = ['date' => $cursor->format('d M'), 'count' => $encounters->filter(fn ($e) => $e->arrived_at?->toDateString() === $key)->count()];
            $cursor->addDay();
        }

        $departments = $encounters->groupBy(fn ($e) => $e->department ?: 'Unassigned')
            ->map(fn ($items, $name) => ['name' => (string) $name, 'count' => $items->count(), 'value' => (float) $items->sum(fn ($e) => (float) ($e->invoice_total ?? 0))])
            ->sortByDesc('count')->take(8)->values();

        $financialAllowed = $request->user()?->can('finance.reports.view') ?? false;
        $shaEncounters = $encounters->filter(fn ($e) => strtolower((string) ($e->coverage_type ?: $e->payment_type)) === 'sha');
        $summary = [
            'visits' => $encounters->count(),
            'completed' => $encounters->where('status', 'completed')->count(),
            'cancelled' => $encounters->whereIn('status', ['cancelled', 'terminated'])->count(),
            'sha' => $shaEncounters->count(),
            'claims_submitted' => $shaEncounters->where('claim_status', 'submitted')->count(),
            'claims_pending' => $shaEncounters->filter(fn ($e) => strtolower((string) ($e->claim_status ?? '')) !== 'submitted')->count(),
            'invoices_issued' => $encounters->where('invoice_status', 'issued')->count(),
            'draft_invoices' => $encounters->where('invoice_status', 'draft')->count(),
            'inpatient' => $encounters->where('visit_type', 'inpatient')->count(),
            'outpatient' => $encounters->where('visit_type', 'outpatient')->count(),
            'invoice_value' => $financialAllowed ? (float) $encounters->whereIn('invoice_status', ['issued', 'paid', 'partially_paid'])->sum(fn ($e) => (float) ($e->invoice_total ?? 0)) : null,
        ];

        $visitStatuses = $encounters->groupBy(fn ($e) => $e->status ?: 'not_recorded')
            ->map(fn ($items, $name) => ['name' => (string) $name, 'count' => $items->count()])->sortByDesc('count')->values();
        $coverageMix = $encounters->groupBy(fn ($e) => strtolower((string) ($e->coverage_type ?: $e->payment_type ?: 'not_recorded')))
            ->map(fn ($items, $name) => ['name' => (string) $name, 'count' => $items->count()])->sortByDesc('count')->values();
        $claimStates = $shaEncounters->groupBy(fn ($e) => strtolower((string) ($e->claim_status ?: 'not_recorded')))
            ->map(fn ($items, $name) => ['name' => (string) $name, 'count' => $items->count()])->sortByDesc('count')->values();

        return Inertia::render('reports/index', [
            'summary' => $summary,
            'daily' => $daily,
            'departments' => $departments,
            'visit_statuses' => $visitStatuses,
            'coverage' => $coverageMix,
            'claim_states' => $claimStates,
            'filters' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'financial_allowed' => $financialAllowed,
        ]);
    }

    private function applySearch($query, string $term): void
    {
        if ($term === '') return;
        $query->where(function ($q) use ($term): void {
            $q->where('encounter_number', 'like', "%{$term}%")
                ->orWhereHas('patient', function ($patient) use ($term): void {
                    $patient->where('full_name', 'like', "%{$term}%")
                        ->orWhere('medical_record_number', 'like', "%{$term}%");
                });
        });
    }

    private function applyCoverage($query, string $coverage): void
    {
        if ($coverage === '') return;
        $query->where(function ($q) use ($coverage): void {
            $q->where('coverage_type', $coverage)->orWhere('payment_type', $coverage);
        });
    }
}

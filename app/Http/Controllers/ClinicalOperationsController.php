<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClinicalOperationsController extends Controller
{
    public function nursing(Request $request): Response
    {
        abort_unless($request->user()?->can('triage.manage') || $request->user()?->can('vitals.record') || $request->user()?->can('nursing_notes.manage') || $request->user()?->can('appointments.view'), 403);
        return $this->workspace('nursing', 'Nursing station', 'Nursing care, triage and observations', 'Record and review patient observations through the clinical encounter workspace.', $request);
    }

    public function laboratory(Request $request): Response
    {
        abort_unless($request->user()?->can('lab.orders.view') || $request->user()?->can('lab.orders.manage') || $request->user()?->can('lab.results.record'), 403);
        return $this->workspace('laboratory', 'Laboratory services', 'Diagnostics and specimen workflow', 'Review active encounters and open the encounter workspace to manage documented clinical requests.', $request);
    }

    public function pharmacy(Request $request): Response
    {
        abort_unless($request->user()?->can('pharmacy.prescriptions.view') || $request->user()?->can('pharmacy.dispense') || $request->user()?->can('pharmacy.stock.view'), 403);
        return $this->workspace('pharmacy', 'Pharmacy services', 'Prescriptions and dispensing', 'Review active encounters and use the clinical workspace for prescribed treatment. Stock operations remain in Inventory & Stores.', $request);
    }

    private function workspace(string $module, string $title, string $subtitle, string $description, Request $request): Response
    {
        $term = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));
        $query = Encounter::query()->with('patient:id,full_name,medical_record_number')->whereNotIn('status', ['cancelled', 'terminated']);
        if ($term !== '') $query->where(function ($q) use ($term) {
            $like = '%' . addcslashes($term, '%_\\') . '%';
            $q->where('encounter_number', 'like', $like)->orWhereHas('patient', fn ($p) => $p->where('full_name', 'like', $like)->orWhere('medical_record_number', 'like', $like));
        });
        if ($status !== '') $query->where('status', $status);
        $encounters = (clone $query)->latest('arrived_at')->paginate(12)->withQueryString()->through(fn ($e) => [
            'id' => $e->id, 'encounter_number' => $e->encounter_number,
            'patient_name' => $e->patient?->full_name, 'mrn' => $e->patient?->medical_record_number,
            'department' => $e->department, 'visit_type' => $e->visit_type, 'status' => $e->status,
            'priority' => $e->priority, 'arrived_at' => $e->arrived_at?->toISOString(),
            'coverage_type' => $e->coverage_type,
        ]);
        $counts = [
            'active' => (int) Encounter::whereNotIn('status', ['completed','cancelled','terminated'])->count(),
            'inpatient' => (int) Encounter::where('visit_type', 'inpatient')->whereNotIn('status', ['cancelled','terminated'])->count(),
            'outpatient' => (int) Encounter::where('visit_type', 'outpatient')->whereNotIn('status', ['cancelled','terminated'])->count(),
            'sha' => (int) Encounter::whereIn('coverage_type', ['sha'])->whereNotIn('status', ['cancelled','terminated'])->count(),
        ];
        return Inertia::render('clinical-operations/index', ['module'=>$module,'title'=>$title,'subtitle'=>$subtitle,'description'=>$description,'encounters'=>$encounters,'counts'=>$counts,'filters'=>['q'=>$term,'status'=>$status]]);
    }
}

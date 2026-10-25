<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\PatientIntegrationTransaction;
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
            'can' => ['complete' => request()->user()->can('appointments.manage')],
            'flash' => ['success' => session('success')],
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

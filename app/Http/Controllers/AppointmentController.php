<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $term = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));
        $date = trim((string) $request->query('date', now()->toDateString()));
        $query = Appointment::query()->with('patient:id,medical_record_number,full_name,first_name,middle_name,last_name,phone');

        $appointments = (clone $query)
            ->when($term !== '', function ($q) use ($term): void {
                $q->where(function ($nested) use ($term): void {
                    $nested->where('appointment_number', 'like', "%{$term}%")
                        ->orWhere('reason', 'like', "%{$term}%")
                        ->orWhereHas('patient', fn ($patient) => $patient
                            ->where('full_name', 'like', "%{$term}%")
                            ->orWhere('medical_record_number', 'like', "%{$term}%")
                            ->orWhere('phone', 'like', "%{$term}%"));
                });
            })
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->when($date !== 'all', fn ($q) => $q->whereDate('scheduled_at', $date))
            ->orderBy('scheduled_at')
            ->paginate(15)->withQueryString()
            ->through(fn (Appointment $a) => [
                'id' => $a->id,
                'appointment_number' => $a->appointment_number,
                'patient_id' => $a->patient_id,
                'patient_name' => $a->patient?->full_name ?: trim(implode(' ', array_filter([$a->patient?->first_name, $a->patient?->middle_name, $a->patient?->last_name]))),
                'medical_record_number' => $a->patient?->medical_record_number,
                'phone' => $a->patient?->phone,
                'scheduled_at' => $a->scheduled_at?->toIso8601String(),
                'visit_type' => $a->visit_type,
                'department' => $a->department,
                'priority' => $a->priority,
                'status' => $a->status,
                'reason' => $a->reason,
                'notes' => $a->notes,
            ]);

        $day = now()->toDateString();
        $stats = [
            'today' => Appointment::whereDate('scheduled_at', $day)->count(),
            'scheduled' => Appointment::whereDate('scheduled_at', $day)->whereIn('status', ['scheduled', 'confirmed'])->count(),
            'checked_in' => Appointment::whereDate('scheduled_at', $day)->where('status', 'checked_in')->count(),
            'completed' => Appointment::whereDate('scheduled_at', $day)->where('status', 'completed')->count(),
            'upcoming' => Appointment::where('scheduled_at', '>', now())->whereIn('status', ['scheduled', 'confirmed'])->count(),
        ];

        $patients = Patient::query()->where('status', 'active')->orderBy('full_name')->limit(500)->get(['id', 'full_name', 'first_name', 'middle_name', 'last_name', 'medical_record_number', 'phone'])
            ->map(fn (Patient $p) => ['id' => $p->id, 'name' => $p->full_name ?: trim(implode(' ', array_filter([$p->first_name, $p->middle_name, $p->last_name]))), 'mrn' => $p->medical_record_number, 'phone' => $p->phone]);

        return Inertia::render('appointments/index', [
            'appointments' => $appointments,
            'stats' => $stats,
            'patients' => $patients,
            'filters' => ['q' => $term, 'status' => $status, 'date' => $date],
            'canManage' => $request->user()->can('appointments.manage'),
            'errors' => session('errors')?->getBag('default')->getMessages() ?? (object) [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);
        $data = $request->validate([
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'scheduled_at' => ['required', 'date', 'after_or_equal:now'],
            'visit_type' => ['required', 'in:outpatient,inpatient,emergency,follow_up,review'],
            'department' => ['nullable', 'string', 'max:100'],
            'priority' => ['required', 'in:routine,urgent,emergency'],
            'reason' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);
        $data['appointment_number'] = 'APT-' . now()->format('ymd') . '-' . Str::upper(Str::random(6));
        $data['status'] = 'scheduled';
        $data['created_by'] = $request->user()->id;
        Appointment::create($data);
        return redirect()->route('appointments.index')->with('success', 'Appointment scheduled successfully.');
    }

    public function updateStatus(Request $request, Appointment $appointment): RedirectResponse
    {
        abort_unless($request->user()->can('appointments.manage'), 403);
        $data = $request->validate(['status' => ['required', 'in:scheduled,confirmed,checked_in,completed,cancelled,no_show']]);
        if (in_array($appointment->status, ['completed', 'cancelled', 'no_show'], true) && $appointment->status !== $data['status']) {
            return back()->withErrors(['status' => 'A closed appointment cannot be reopened from this screen.']);
        }
        $appointment->update(['status' => $data['status']]);
        return back()->with('success', 'Appointment status updated.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ApiIntegration;
use App\Models\ApiIntegrationLog;
use App\Models\Encounter;
use App\Models\Patient;
use App\Models\StaffMember;
use App\Models\SystemAuditLog;
use App\Models\SystemRelease;
use App\Models\SystemReleaseAcknowledgement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        // Resolve effective permissions from the application's actual active-role pivot.
        // Do not rely on Gate::can() unless a Gate::before/permission mapping is registered.
        $effectivePermissions = $user
            ? $user->roles()->where('roles.is_active', true)->with('permissions:id,name')->get()
                ->flatMap(fn ($role) => $role->permissions->pluck('name'))
                ->unique()->values()->all()
            : [];
        $can = fn (string $permission): bool => in_array($permission, $effectivePermissions, true);
        $days = collect(range(6, 0))->map(fn (int $daysAgo) => now()->startOfDay()->subDays($daysAgo));
        $visitActivity = $days->map(function ($date) use ($can): array {
            $count = $can('patients.view') && Schema::hasTable('encounters')
                ? Encounter::query()->whereBetween('arrived_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count()
                : null;
            return ['date' => $date->format('D'), 'visits' => $count];
        })->values();

        $metrics = [];
        if ($can('patients.view') && Schema::hasTable('patients')) {
            $metrics[] = ['key' => 'patients', 'label' => 'Registered patients', 'value' => Patient::query()->count(), 'caption' => 'Persistent patient records', 'tone' => 'emerald'];
        }
        if ($can('appointments.manage') && Schema::hasTable('encounters')) {
            $metrics[] = ['key' => 'today_visits', 'label' => "Today's visits", 'value' => Encounter::query()->whereDate('arrived_at', today())->count(), 'caption' => 'Visits registered today', 'tone' => 'blue'];
            $metrics[] = ['key' => 'waiting', 'label' => 'Open encounters', 'value' => Encounter::query()->whereIn('status', ['registered', 'triage', 'in_progress'])->count(), 'caption' => 'Not yet completed', 'tone' => 'amber'];
        }
        if ($can('staff.view') && Schema::hasTable('staff_members')) {
            $metrics[] = ['key' => 'staff', 'label' => 'Active staff', 'value' => StaffMember::query()->where('employment_status', 'active')->count(), 'caption' => 'Active staff records', 'tone' => 'violet'];
        }
        if ($can('users.view')) {
            $metrics[] = ['key' => 'accounts', 'label' => 'User accounts', 'value' => User::query()->count(), 'caption' => 'Registered system accounts', 'tone' => 'slate'];
        }
        if ($can('integrations.view') && Schema::hasTable('api_integrations')) {
            $metrics[] = ['key' => 'integrations', 'label' => 'Integration profiles', 'value' => ApiIntegration::query()->count(), 'caption' => 'Configured providers, not live status', 'tone' => 'teal'];
        }
        if ($can('audit.view') && Schema::hasTable('system_audit_logs')) {
            $metrics[] = ['key' => 'audit', 'label' => 'Audit events · 7 days', 'value' => SystemAuditLog::query()->where('created_at', '>=', now()->subDays(7))->count(), 'caption' => 'Recorded system activity', 'tone' => 'rose'];
        }

        $integrationActivity = [];
        if ($can('integrations.view') && Schema::hasTable('api_integration_logs')) {
            $integrationActivity = ApiIntegrationLog::query()->with('integration:id,name,slug')->latest('created_at')->limit(6)->get()->map(fn ($log) => [
                'provider' => $log->integration?->name ?? 'Integration', 'operation' => $log->operation,
                'environment' => $log->environment, 'result' => $log->result, 'http_status' => $log->http_status,
                'created_at' => $log->created_at?->toISOString(),
            ])->all();
        }

        return Inertia::render('dashboard', [
            'dashboard' => [
                'announcement' => $this->pendingAnnouncement($request),
                'metrics' => $metrics,
                'visit_activity' => $visitActivity,
                'integration_activity' => $integrationActivity,
                'capabilities' => [
                    'patients_view' => $can('patients.view'), 'patients_create' => $can('patients.create'),
                    'appointments_manage' => $can('appointments.manage'), 'staff_view' => $can('staff.view'),
                    'users_manage' => $can('users.manage'), 'roles_manage' => $can('roles.manage'),
                    'integrations_view' => $can('integrations.view'), 'integrations_manage' => $can('integrations.manage'),
                    'audit_view' => $can('audit.view'), 'billing_view' => $can('billing.invoices.view'),
                    'sha_verify' => $can('sha.eligibility.verify'), 'clinical_view' => $can('consultations.view'),
                ],
            ],
        ]);
    }

    private function pendingAnnouncement(Request $request): ?array
    {
        $user = $request->user();
        if (! $user) return null;
        $installedVersion = (string) config('system.installed_version', '0.1.0');
        $releases = SystemRelease::query()->where('status', 'published')->whereNotNull('published_at')->get()
            ->filter(fn (SystemRelease $release): bool => version_compare($release->version, $installedVersion, '>'))
            ->sort(fn (SystemRelease $a, SystemRelease $b): int => version_compare($b->version, $a->version))->values();
        foreach ($releases as $release) {
            if (SystemReleaseAcknowledgement::query()->where('user_id', $user->id)->where('system_release_id', $release->id)->exists()) continue;
            return [
                'id' => $release->id, 'version' => $release->version, 'title' => $release->title,
                'release_type' => $release->release_type, 'summary' => $release->summary, 'release_notes' => $release->release_notes,
                'features' => $release->features ?? [], 'improvements' => $release->improvements ?? [], 'bug_fixes' => $release->bug_fixes ?? [],
                'security_notes' => $release->security_notes ?? [], 'known_issues' => $release->known_issues ?? [],
                'published_at' => $release->published_at?->toISOString(), 'acknowledge_url' => route('dashboard.releases.acknowledge', $release),
            ];
        }
        return null;
    }
}

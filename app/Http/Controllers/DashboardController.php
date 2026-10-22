<?php

namespace App\Http\Controllers;

use App\Models\SystemRelease;
use App\Models\SystemReleaseAcknowledgement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('dashboard', [
            'dashboard' => [
                'announcement' => $this->pendingAnnouncement($request),
            ],
        ]);
    }

    private function pendingAnnouncement(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        $installedVersion = (string) config('system.installed_version', '0.1.0');

        $releases = SystemRelease::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->get()
            ->filter(fn (SystemRelease $release): bool => version_compare(
                $release->version,
                $installedVersion,
                '>',
            ))
            ->sort(fn (SystemRelease $a, SystemRelease $b): int => version_compare(
                $b->version,
                $a->version,
            ))
            ->values();

        foreach ($releases as $release) {
            $alreadyAcknowledged = SystemReleaseAcknowledgement::query()
                ->where('user_id', $user->id)
                ->where('system_release_id', $release->id)
                ->exists();

            if ($alreadyAcknowledged) {
                continue;
            }

            return [
                'id' => $release->id,
                'version' => $release->version,
                'title' => $release->title,
                'release_type' => $release->release_type,
                'summary' => $release->summary,
                'release_notes' => $release->release_notes,
                'features' => $release->features ?? [],
                'improvements' => $release->improvements ?? [],
                'bug_fixes' => $release->bug_fixes ?? [],
                'security_notes' => $release->security_notes ?? [],
                'known_issues' => $release->known_issues ?? [],
                'published_at' => $release->published_at?->toISOString(),
                'acknowledge_url' => route('dashboard.releases.acknowledge', $release),
            ];
        }

        return null;
    }
}

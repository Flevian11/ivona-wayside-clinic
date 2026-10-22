<?php

namespace App\Http\Controllers;

use App\Models\SystemRelease;
use Inertia\Inertia;
use Inertia\Response;

class ReleaseChangelogController extends Controller
{
    public function __invoke(): Response
    {
        $releases = SystemRelease::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->get()
            ->sort(fn (SystemRelease $a, SystemRelease $b): int => version_compare(
                $b->version,
                $a->version,
            ))
            ->values()
            ->map(fn (SystemRelease $release): array => [
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
            ]);

        return Inertia::render('releases/changelog', [
            'releases' => $releases,
        ]);
    }
}

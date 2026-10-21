<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemRelease;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemVersionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $releases = SystemRelease::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->get()
            ->sort(function (SystemRelease $a, SystemRelease $b): int {
                return version_compare($b->version, $a->version);
            })
            ->values();

        $release = $releases->first();

        return response()->json([
            'installed_version' => config('system.installed_version'),
            'latest_published_release' => $release ? [
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
            ] : null,
            'update_available' => $release !== null
                && version_compare(
                    $release->version,
                    (string) config('system.installed_version'),
                    '>'
                ),
        ])->header('Cache-Control', 'no-store');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\SystemRelease;
use App\Models\SystemReleaseAcknowledgement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DashboardReleaseAcknowledgementController extends Controller
{
    public function __invoke(
        Request $request,
        SystemRelease $systemRelease,
    ): RedirectResponse {
        if (
            $systemRelease->status !== 'published'
            || $systemRelease->published_at === null
            || version_compare(
                $systemRelease->version,
                (string) config('system.installed_version', '0.1.0'),
                '<=',
            )
        ) {
            throw ValidationException::withMessages([
                'release' => 'This release announcement is not available.',
            ]);
        }

        SystemReleaseAcknowledgement::query()->firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'system_release_id' => $systemRelease->id,
            ],
            [
                'acknowledged_at' => now(),
            ],
        );

        return back();
    }
}

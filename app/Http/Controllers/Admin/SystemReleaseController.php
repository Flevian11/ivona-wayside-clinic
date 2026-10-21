<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemAuditLog;
use App\Models\SystemRelease;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SystemReleaseController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            SystemRelease::query()
                ->orderByDesc('created_at')
                ->paginate(20)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());

        $release = DB::transaction(function () use ($request, $data) {
            $release = SystemRelease::create($data);

            $release->forceFill([
                'status' => 'draft',
                'created_by' => $request->user()->id,
            ])->save();

            $this->audit(
                $request,
                'release.created',
                $release,
                null,
                $this->snapshot($release),
            );

            return $release;
        });

        return response()->json(['data' => $release], 201);
    }

    public function show(SystemRelease $systemRelease): JsonResponse
    {
        return response()->json(['data' => $systemRelease]);
    }

    public function update(
        Request $request,
        SystemRelease $systemRelease
    ): JsonResponse {
        if ($systemRelease->status !== 'draft') {
            throw ValidationException::withMessages([
                'release' => 'Only draft releases can be edited.',
            ]);
        }

        $data = $request->validate(
            $this->rules($systemRelease->id, partial: true)
        );

        DB::transaction(function () use ($request, $systemRelease, $data) {
            $before = $this->snapshot($systemRelease);

            $systemRelease->update($data);

            $this->audit(
                $request,
                'release.updated',
                $systemRelease,
                $before,
                $this->snapshot($systemRelease),
            );
        });

        return response()->json(['data' => $systemRelease->fresh()]);
    }

    public function publish(
        Request $request,
        SystemRelease $systemRelease
    ): JsonResponse {
        if ($systemRelease->status !== 'draft') {
            throw ValidationException::withMessages([
                'release' => 'Only draft releases can be published.',
            ]);
        }

        $release = DB::transaction(function () use ($request, $systemRelease) {
            $before = $this->snapshot($systemRelease);

            $systemRelease->forceFill([
                'status' => 'published',
                'published_by' => $request->user()->id,
                'published_at' => now(),
                'withdrawn_at' => null,
            ])->save();

            $this->audit(
                $request,
                'release.published',
                $systemRelease,
                $before,
                $this->snapshot($systemRelease),
            );

            return $systemRelease->fresh();
        });

        return response()->json(['data' => $release]);
    }

    public function withdraw(
        Request $request,
        SystemRelease $systemRelease
    ): JsonResponse {
        if ($systemRelease->status !== 'published') {
            throw ValidationException::withMessages([
                'release' => 'Only published releases can be withdrawn.',
            ]);
        }

        $release = DB::transaction(function () use ($request, $systemRelease) {
            $before = $this->snapshot($systemRelease);

            $systemRelease->forceFill([
                'status' => 'withdrawn',
                'withdrawn_at' => now(),
            ])->save();

            $this->audit(
                $request,
                'release.withdrawn',
                $systemRelease,
                $before,
                $this->snapshot($systemRelease),
            );

            return $systemRelease->fresh();
        });

        return response()->json(['data' => $release]);
    }

    private function rules(
        ?int $ignoreId = null,
        bool $partial = false
    ): array {
        $required = $partial ? 'sometimes' : 'required';

        return [
            'version' => [
                $required,
                'string',
                'max:50',
                'regex:/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/',
                Rule::unique('system_releases', 'version')->ignore($ignoreId),
            ],
            'title' => [$required, 'string', 'max:255'],
            'release_type' => [
                $required,
                Rule::in(['major', 'minor', 'patch', 'security', 'hotfix']),
            ],
            'summary' => [$required, 'string', 'max:10000'],
            'release_notes' => ['sometimes', 'nullable', 'string'],
            'features' => ['sometimes', 'nullable', 'array'],
            'features.*' => ['string', 'max:1000'],
            'improvements' => ['sometimes', 'nullable', 'array'],
            'improvements.*' => ['string', 'max:1000'],
            'bug_fixes' => ['sometimes', 'nullable', 'array'],
            'bug_fixes.*' => ['string', 'max:1000'],
            'security_notes' => ['sometimes', 'nullable', 'array'],
            'security_notes.*' => ['string', 'max:1000'],
            'known_issues' => ['sometimes', 'nullable', 'array'],
            'known_issues.*' => ['string', 'max:1000'],
            'minimum_php_version' => ['sometimes', 'nullable', 'string', 'max:30'],
            'minimum_database_version' => ['sometimes', 'nullable', 'string', 'max:50'],
        ];
    }

    private function snapshot(SystemRelease $release): array
    {
        return $release->only([
            'version',
            'title',
            'release_type',
            'summary',
            'release_notes',
            'features',
            'improvements',
            'bug_fixes',
            'security_notes',
            'known_issues',
            'minimum_php_version',
            'minimum_database_version',
            'status',
            'created_by',
            'published_by',
            'published_at',
            'withdrawn_at',
        ]);
    }

    private function audit(
        Request $request,
        string $action,
        SystemRelease $release,
        ?array $before,
        ?array $after,
    ): void {
        SystemAuditLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'subject_type' => SystemRelease::class,
            'subject_id' => (string) $release->id,
            'before_values' => $before,
            'after_values' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 2000),
            'occurred_at' => now(),
        ]);
    }
}
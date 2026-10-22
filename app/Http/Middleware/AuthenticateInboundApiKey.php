<?php

namespace App\Http\Middleware;

use App\Models\InboundApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateInboundApiKey
{
    public function handle(Request $request, Closure $next, string ...$requiredScopes): Response
    {
        $bearer = (string) $request->bearerToken();
        if ($bearer === '' || !(str_starts_with($bearer, 'ivc_dev_') || str_starts_with($bearer, 'ivc_uat_') || str_starts_with($bearer, 'ivc_live_'))) {
            return response()->json(['message' => 'A valid bearer API key is required.'], 401);
        }

        $prefix = substr($bearer, 0, 18);
        $key = InboundApiKey::query()->where('prefix', $prefix)->first();
        if (!$key || !$key->isUsable() || $key->environment !== config('integrations.environment', 'development') || !hash_equals($key->token_hash, hash('sha256', $bearer))) {
            return response()->json(['message' => 'The API key is invalid, expired, or revoked.'], 401);
        }

        $granted = $key->scopes ?? [];
        foreach ($requiredScopes as $scope) {
            if ($scope !== '' && !in_array($scope, $granted, true)) {
                return response()->json(['message' => 'The API key lacks a required scope.', 'required_scope' => $scope], 403);
            }
        }

        $key->forceFill(['last_used_at' => now()])->save();
        $request->attributes->set('inbound_api_key', $key);
        return $next($request);
    }
}

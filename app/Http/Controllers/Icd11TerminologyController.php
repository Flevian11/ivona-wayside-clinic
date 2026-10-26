<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class Icd11TerminologyController extends Controller
{
    /** Search the WHO ICD-11 MMS terminology; development returns clearly synthetic demo matches. */
    public function search(Request $request): JsonResponse
    {
        $data = $request->validate(['q' => ['required','string','min:2','max:100']]);
        $query = trim($data['q']);
        if (config('integrations.environment') === 'development') {
            $catalogue = [
                ['code'=>'1A00','display'=>'Cholera'], ['code'=>'1A40','display'=>'Typhoid fever'],
                ['code'=>'1C1A','display'=>'Malaria'], ['code'=>'CA40','display'=>'Asthma'],
                ['code'=>'BA00','display'=>'Essential hypertension'], ['code'=>'5A11','display'=>'Type 2 diabetes mellitus'],
                ['code'=>'1D80','display'=>'Tuberculosis'], ['code'=>'1B10','display'=>'Influenza'],
                ['code'=>'MG30','display'=>'Headache'], ['code'=>'ME84','display'=>'Low back pain'],
                ['code'=>'JA00','display'=>'Normal pregnancy'], ['code'=>'1F00','display'=>'Acute gastroenteritis'],
            ];
            $results = collect($catalogue)->filter(fn ($item) => str_contains(mb_strtolower($item['display']), mb_strtolower($query)) || str_contains(mb_strtolower($item['code']), mb_strtolower($query)))->values();
            return response()->json(['environment'=>'development','mock'=>true,'results'=>$results,'note'=>'Synthetic ICD-11 search examples for development UI testing. Verify the current official WHO MMS code before clinical use.']);
        }

        $clientId = (string) config('services.who_icd.client_id');
        $clientSecret = (string) config('services.who_icd.client_secret');
        if ($clientId === '' || $clientSecret === '') return response()->json(['message'=>'WHO ICD-11 terminology credentials are not configured for this environment.'], 503);
        try {
            $token = Cache::remember('who-icd11-access-token', 3000, function () use ($clientId, $clientSecret) {
                $response = Http::asForm()->acceptJson()->withOptions(['verify'=>true,'allow_redirects'=>false])->timeout(15)->post('https://icdaccessmanagement.who.int/connect/token', [
                    'client_id'=>$clientId, 'client_secret'=>$clientSecret, 'scope'=>'icdapi_access', 'grant_type'=>'client_credentials',
                ]);
                if (!$response->successful() || !$response->json('access_token')) throw new RuntimeException('WHO ICD-11 token request failed.');
                return (string) $response->json('access_token');
            });
            $response = Http::acceptJson()->withToken($token)->withHeaders(['API-Version'=>'v2','Accept-Language'=>'en'])->withOptions(['verify'=>true,'allow_redirects'=>false])->timeout(15)->get('https://id.who.int/icd/release/11/2025-01/mms/search', ['q'=>$query,'useFlexisearch'=>'true','flatResults'=>'true','highlightingEnabled'=>'false']);
            if (!$response->successful()) return response()->json(['message'=>'WHO ICD-11 terminology search failed.','provider_status'=>$response->status()], 502);
            $body = $response->json();
            $items = $body['destinationEntities'] ?? $body['results'] ?? [];
            $results = collect($items)->map(function ($item) {
                $uri = (string) ($item['id'] ?? '');
                $code = $item['theCode'] ?? $item['code'] ?? null;
                if (!$code && preg_match('~/([^/]+)$~', $uri, $m)) $code = $m[1];
                return ['code'=>(string) $code,'display'=>(string) ($item['title'] ?? $item['display'] ?? ''),'uri'=>$uri];
            })->filter(fn ($item) => $item['code'] !== '' && $item['display'] !== '')->take(30)->values();
            return response()->json(['environment'=>config('integrations.environment'),'mock'=>false,'results'=>$results]);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message'=>'ICD-11 terminology service is unavailable. No diagnosis code was inferred.'], 503);
        }
    }
}

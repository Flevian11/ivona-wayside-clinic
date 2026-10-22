<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlockLegacyTwoFactorChallenge
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('post') && $request->is('two-factor-challenge')) {
            return $request->session()->has('email_otp.hash')
                ? redirect()->route('email-otp.challenge')
                : redirect()->route('login');
        }

        return $next($request);
    }
}

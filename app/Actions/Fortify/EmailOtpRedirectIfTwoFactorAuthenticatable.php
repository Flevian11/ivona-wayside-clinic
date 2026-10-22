<?php

namespace App\Actions\Fortify;

use App\Mail\LoginEmailOtp;
use Illuminate\Auth\Events\Failed;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Events\TwoFactorAuthenticationChallenged;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Throwable;

class EmailOtpRedirectIfTwoFactorAuthenticatable extends RedirectIfTwoFactorAuthenticatable
{
    protected function twoFactorChallengeResponse($request, $user)
    {
        if (! $user->email_verified_at) {
            throw ValidationException::withMessages([
                Fortify::username() => ['A verified email address is required for email two-factor authentication. Contact your administrator.'],
            ]);
        }

        $code = (string) random_int(100000, 999999);
        $request->session()->put([
            'login.id' => $user->getKey(),
            'login.remember' => $request->boolean('remember'),
            'email_otp.hash' => Hash::make($code),
            'email_otp.expires_at' => now()->addMinutes(10)->timestamp,
            'email_otp.attempts' => 0,
            'email_otp.last_sent_at' => now()->timestamp,
        ]);

        try {
            Mail::to($user->email)->send(new LoginEmailOtp($code));
        } catch (Throwable $exception) {
            report($exception);
            $request->session()->forget([
                'login.id', 'login.remember', 'email_otp.hash', 'email_otp.expires_at',
                'email_otp.attempts', 'email_otp.last_sent_at',
            ]);

            throw ValidationException::withMessages([
                Fortify::username() => ['We could not send your verification code. Please try again shortly.'],
            ]);
        }

        TwoFactorAuthenticationChallenged::dispatch($user);

        return $request->wantsJson()
            ? response()->json(['two_factor' => true, 'method' => 'email'])
            : redirect()->route('email-otp.challenge');
    }
}

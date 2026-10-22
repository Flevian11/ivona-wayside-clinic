<?php

namespace App\Http\Controllers\Auth;

use App\Mail\LoginEmailOtp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmailOtpTwoFactorSetupController
{
    public function send(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->email_verified_at) {
            throw ValidationException::withMessages([
                'email_otp' => ['Verify your email address before enabling email two-factor authentication.'],
            ]);
        }

        $lastSentAt = (int) $request->session()->get('email_otp.setup.last_sent_at', 0);
        if (now()->timestamp - $lastSentAt < 60 && $request->session()->has('email_otp.setup.hash')) {
            throw ValidationException::withMessages([
                'email_otp' => ['Please wait before requesting another verification code.'],
            ]);
        }

        $code = (string) random_int(100000, 999999);

        try {
            Mail::to($user->email)->send(new LoginEmailOtp($code));
        } catch (Throwable $exception) {
            report($exception);

            throw ValidationException::withMessages([
                'email_otp' => ['We could not send the verification code. Please try again shortly.'],
            ]);
        }

        $request->session()->put([
            'email_otp.setup.user_id' => $user->getKey(),
            'email_otp.setup.hash' => Hash::make($code),
            'email_otp.setup.expires_at' => now()->addMinutes(10)->timestamp,
            'email_otp.setup.attempts' => 0,
            'email_otp.setup.last_sent_at' => now()->timestamp,
        ]);

        return back()->with('status', 'A verification code has been sent to your verified email address.');
    }

    public function confirm(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $user = $request->user();
        $challengeUserId = $request->session()->get('email_otp.setup.user_id');
        $hash = $request->session()->get('email_otp.setup.hash');
        $expiresAt = (int) $request->session()->get('email_otp.setup.expires_at', 0);
        $attempts = (int) $request->session()->get('email_otp.setup.attempts', 0);

        if (! $challengeUserId || (string) $challengeUserId !== (string) $user->getKey()
            || ! $hash || $expiresAt <= now()->timestamp || $attempts >= 5) {
            $this->clearChallenge($request);

            throw ValidationException::withMessages([
                'code' => ['This setup code has expired or the attempt limit was reached. Request a new code.'],
            ]);
        }

        if (! Hash::check((string) $request->input('code'), $hash)) {
            $attempts++;
            $request->session()->put('email_otp.setup.attempts', $attempts);

            if ($attempts >= 5) {
                $this->clearChallenge($request);
            }

            throw ValidationException::withMessages([
                'code' => ['The verification code is incorrect.'],
            ]);
        }

        if (! $user->email_verified_at) {
            $this->clearChallenge($request);

            throw ValidationException::withMessages([
                'code' => ['A verified email address is required.'],
            ]);
        }

        // Fortify uses these existing columns to represent an enabled and confirmed
        // second factor. The encrypted marker is not a TOTP secret; login challenges
        // are intercepted by EmailOtpRedirectIfTwoFactorAuthenticatable.
        $user->forceFill([
            'two_factor_secret' => Crypt::encryptString(bin2hex(random_bytes(32))),
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => now(),
        ])->save();

        $this->clearChallenge($request);

        return back()->with('status', 'Email two-factor authentication is now enabled.');
    }

    private function clearChallenge(Request $request): void
    {
        $request->session()->forget([
            'email_otp.setup.user_id',
            'email_otp.setup.hash',
            'email_otp.setup.expires_at',
            'email_otp.setup.attempts',
            'email_otp.setup.last_sent_at',
        ]);
    }
}

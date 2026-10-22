<?php

namespace App\Http\Controllers\Auth;

use App\Mail\LoginEmailOtp;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class EmailOtpChallengeController
{
    public function show(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has('login.id') || ! $request->session()->has('email_otp.hash')) {
            return redirect()->route('login');
        }

        if ((int) $request->session()->get('email_otp.expires_at', 0) <= now()->timestamp) {
            $this->clearChallenge($request);

            return redirect()->route('login')->withErrors([
                'email' => 'Your sign-in verification expired. Please sign in again.',
            ]);
        }

        return Inertia::render('auth/email-otp-challenge', [
            'expiresAt' => (int) $request->session()->get('email_otp.expires_at'),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $userId = $request->session()->get('login.id');
        $hash = $request->session()->get('email_otp.hash');
        $expiresAt = (int) $request->session()->get('email_otp.expires_at', 0);
        $attempts = (int) $request->session()->get('email_otp.attempts', 0);

        if (! $userId || ! $hash || $expiresAt <= now()->timestamp || $attempts >= 5) {
            $this->clearChallenge($request);

            throw ValidationException::withMessages([
                'code' => ['This verification code has expired or the attempt limit was reached. Sign in again to request a new code.'],
            ]);
        }

        if (! Hash::check((string) $request->input('code'), $hash)) {
            $attempts++;
            $request->session()->put('email_otp.attempts', $attempts);

            if ($attempts >= 5) {
                $this->clearChallenge($request);
            }

            throw ValidationException::withMessages([
                'code' => ['The verification code is incorrect or expired.'],
            ]);
        }

        $user = User::query()->find($userId);
        if (! $user || ! $user->email_verified_at) {
            $this->clearChallenge($request);
            return redirect()->route('login')->withErrors([
                'email' => 'The account could not complete email verification. Contact your administrator.',
            ]);
        }

        $remember = (bool) $request->session()->get('login.remember', false);
        $this->clearChallenge($request);
        Auth::guard(config('fortify.guard', 'web'))->login($user, $remember);
        $request->session()->regenerate();

        return redirect()->intended(config('fortify.home', '/dashboard'));
    }

    public function resend(Request $request): RedirectResponse
    {
        $userId = $request->session()->get('login.id');
        if (! $userId || ! $request->session()->has('email_otp.hash')) {
            return redirect()->route('login');
        }

        $lastSentAt = (int) $request->session()->get('email_otp.last_sent_at', 0);
        if (now()->timestamp - $lastSentAt < 60) {
            throw ValidationException::withMessages([
                'code' => ['Please wait before requesting another code.'],
            ]);
        }

        $user = User::query()->find($userId);
        if (! $user || ! $user->email_verified_at) {
            $this->clearChallenge($request);
            return redirect()->route('login');
        }

        $code = (string) random_int(100000, 999999);
        try {
            Mail::to($user->email)->send(new LoginEmailOtp($code));
        } catch (Throwable $exception) {
            report($exception);
            throw ValidationException::withMessages([
                'code' => ['We could not send a new code. Please try again later.'],
            ]);
        }

        $request->session()->put([
            'email_otp.hash' => Hash::make($code),
            'email_otp.expires_at' => now()->addMinutes(10)->timestamp,
            'email_otp.attempts' => 0,
            'email_otp.last_sent_at' => now()->timestamp,
        ]);

        return back()->with('status', 'A new verification code has been sent to your verified email address.');
    }

    private function clearChallenge(Request $request): void
    {
        $request->session()->forget([
            'login.id', 'login.remember', 'email_otp.hash', 'email_otp.expires_at',
            'email_otp.attempts', 'email_otp.last_sent_at',
        ]);
    }
}

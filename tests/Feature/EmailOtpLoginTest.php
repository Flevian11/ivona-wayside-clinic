<?php

namespace Tests\Feature;

use App\Mail\LoginEmailOtp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailOtpLoginTest extends TestCase
{
    use RefreshDatabase;

    private function twoFactorUser(): User
    {
        $user = User::factory()->create();
        $user->forceFill([
            'two_factor_secret' => Crypt::encryptString('test-secret'),
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode(['unused-test-recovery-code'])),
            'two_factor_confirmed_at' => now(),
        ])->save();

        return $user;
    }

    public function test_password_login_with_two_factor_enabled_sends_email_code_without_authenticating_user(): void
    {
        Mail::fake();
        $user = $this->twoFactorUser();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('email-otp.challenge'));
        $this->assertGuest();
        $response->assertSessionHas('login.id', $user->id);
        Mail::assertSent(LoginEmailOtp::class, fn (LoginEmailOtp $mail): bool => $mail->hasTo($user->email));
    }

    public function test_correct_email_code_completes_login_and_clears_challenge(): void
    {
        Mail::fake();
        $user = $this->twoFactorUser();
        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect(route('email-otp.challenge'));
        $mail = Mail::sent(LoginEmailOtp::class)->first();
        $this->assertNotNull($mail);

        $response = $this->post(route('email-otp.verify'), ['code' => $mail->code])
            ->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
        $response->assertSessionMissing('email_otp.hash');
        $response->assertSessionMissing('login.id');
    }

    public function test_invalid_email_code_does_not_authenticate_user_and_counts_attempt(): void
    {
        Mail::fake();
        $user = $this->twoFactorUser();
        $this->post('/login', ['email' => $user->email, 'password' => 'password']);

        $response = $this->from(route('email-otp.challenge'))
            ->post(route('email-otp.verify'), ['code' => '000000'])
            ->assertSessionHasErrors('code');

        $this->assertGuest();
        $response->assertSessionHas('email_otp.attempts', 1);
    }

    public function test_unverified_email_cannot_complete_email_two_factor_login(): void
    {
        Mail::fake();
        $user = User::factory()->unverified()->create();
        $user->forceFill([
            'two_factor_secret' => Crypt::encryptString('test-secret'),
            'two_factor_confirmed_at' => now(),
        ])->save();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
        Mail::assertNothingSent();
    }

    public function test_legacy_authenticator_challenge_endpoint_cannot_bypass_email_otp(): void
    {
        Mail::fake();
        $user = $this->twoFactorUser();
        $this->post('/login', ['email' => $user->email, 'password' => 'password']);

        $this->post('/two-factor-challenge', ['code' => '123456'])
            ->assertRedirect(route('email-otp.challenge'));
        $this->assertGuest();
    }
}

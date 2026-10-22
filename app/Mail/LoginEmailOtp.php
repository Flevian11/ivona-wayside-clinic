<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginEmailOtp extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly string $code)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Ivona Wayside Clinic sign-in code');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.login-otp', with: [
            'code' => $this->code,
            'expiresInMinutes' => 10,
        ]);
    }
}

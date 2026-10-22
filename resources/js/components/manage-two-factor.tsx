import { Form } from '@inertiajs/react';
import { MailCheck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { disable } from '@/routes/two-factor';

export type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function ManageTwoFactor(props: Props) {
    const [setupCodeSent, setSetupCodeSent] = useState(false);

    if (!(props.canManageTwoFactor ?? false)) return null;

    return (
        <section className="space-y-5">
            <Heading
                variant="small"
                title="Email two-factor authentication"
                description="Protect your clinic account with a one-time code sent to your verified email address."
            />

            {props.twoFactorEnabled ? (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
                        <MailCheck className="mt-0.5 size-5 shrink-0" />
                        <p className="text-sm leading-6">
                            Email two-factor authentication is enabled. After entering your password at sign-in, you must verify a fresh code sent to your verified email address.
                        </p>
                    </div>
                    <Form {...disable.form()}>
                        {({ processing, errors }) => (
                            <div className="space-y-2">
                                <Button variant="destructive" type="submit" disabled={processing}>Disable email 2FA</Button>
                                <InputError message={errors.password} />
                            </div>
                        )}
                    </Form>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm leading-6 text-muted-foreground">
                        Enable email verification without an authenticator app. We will send a six-digit code to your verified email. Enter it to confirm ownership and activate two-factor authentication.
                    </p>
                    {!setupCodeSent ? (
                        <Form action="/settings/security/email-2fa/send" method="post" onSuccess={() => setSetupCodeSent(true)}>
                            {({ processing, errors }) => (
                                <div className="space-y-3">
                                    <Button type="submit" disabled={processing}>
                                        <MailCheck className="size-4" /> Send verification code
                                    </Button>
                                    <InputError message={errors.email_otp} />
                                </div>
                            )}
                        </Form>
                    ) : (
                        <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-5">
                            <div className="flex items-center gap-2 font-medium">
                                <ShieldCheck className="size-5 text-primary" />
                                Verify your email
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Enter the six-digit code we sent to your verified email address. It expires in 10 minutes.
                            </p>
                            <Form action="/settings/security/email-2fa/confirm" method="post" resetOnSuccess onSuccess={() => setSetupCodeSent(false)}>
                                {({ processing, errors }) => (
                                    <div className="space-y-3">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email-2fa-code">Verification code</Label>
                                            <Input
                                                id="email-2fa-code"
                                                name="code"
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                pattern="[0-9]{6}"
                                                minLength={6}
                                                maxLength={6}
                                                required
                                                autoFocus
                                                placeholder="000000"
                                                className="h-12 text-center text-xl tracking-[0.45em]"
                                            />
                                            <InputError message={errors.code} />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            {processing ? 'Verifyingâ€¦' : 'Verify and enable email 2FA'}
                                        </Button>
                                        <InputError message={errors.email_otp} />
                                    </div>
                                )}
                            </Form>
                            <Form action="/settings/security/email-2fa/send" method="post" onSuccess={() => setSetupCodeSent(true)}>
                                {({ processing, errors }) => (
                                    <div className="space-y-2">
                                        <Button type="submit" variant="outline" className="w-full" disabled={processing}>Send another code</Button>
                                        <InputError message={errors.email_otp} />
                                    </div>
                                )}
                            </Form>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}


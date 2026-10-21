import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

type Props = { status?: string };

export default function ForgotPassword({ status }: Props) {
    return (
        <>
            <Head title="Forgot password" />
            <section className="space-y-6">
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-emerald-700/15 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300">
                        {status ? <MailCheck className="size-6" aria-hidden="true" /> : <ShieldCheck className="size-6" aria-hidden="true" />}
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Enter the email address associated with your staff account. If an account is eligible for password recovery, we’ll send instructions to that address.
                    </p>
                </div>

                {status && (
                    <div role="status" aria-live="polite" className="rounded-xl border border-emerald-700/20 bg-emerald-700/5 px-4 py-3 text-sm leading-6 text-emerald-800 dark:text-emerald-300">
                        {status}
                    </div>
                )}

                <Form {...email.form()} className="space-y-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Work email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    inputMode="email"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    placeholder="you@clinic.org"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                <InputError id="email-error" message={errors.email} />
                            </div>

                            <Button className="h-11 w-full" type="submit" disabled={processing}>
                                {processing ? 'Sending instructions…' : 'Send password reset link'}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="flex justify-center border-t border-border pt-5">
                    <TextLink href={login()} className="inline-flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back to staff login
                    </TextLink>
                </div>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                    For account access issues, contact your clinic system administrator. Never share your password or reset link with anyone.
                </p>
            </section>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Recover your account',
    description: 'Securely reset your staff account password',
};

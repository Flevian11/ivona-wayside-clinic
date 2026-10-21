import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />
            <section className="space-y-6">
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-emerald-700/15 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300">
                        <KeyRound className="size-6" aria-hidden="true" />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Choose a new password for your staff account. Use a strong password that you do not use for another service.
                    </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/35 p-3.5">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                    <p className="text-xs leading-5 text-muted-foreground">
                        Your reset link is private. If it has expired or has already been used, request a new one from the forgot-password page.
                    </p>
                </div>

                <Form
                    {...update.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Account email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    value={email}
                                    readOnly
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? 'reset-email-error' : undefined}
                                />
                                <InputError id="reset-email-error" message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">New password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder="Enter a new password"
                                    passwordrules={passwordRules}
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={errors.password ? 'new-password-error' : undefined}
                                />
                                <InputError id="new-password-error" message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm new password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Enter the new password again"
                                    passwordrules={passwordRules}
                                    aria-invalid={Boolean(errors.password_confirmation)}
                                    aria-describedby={errors.password_confirmation ? 'confirm-password-error' : undefined}
                                />
                                <InputError id="confirm-password-error" message={errors.password_confirmation} />
                            </div>

                            <Button className="h-11 w-full" type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                {processing ? 'Updating password…' : 'Update password'}
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
            </section>
        </>
    );
}

ResetPassword.layout = {
    title: 'Create a new password',
    description: 'Choose a new password to regain access to your account',
};

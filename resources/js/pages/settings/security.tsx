import { Form, Head } from '@inertiajs/react';
import { KeyRound, LockKeyhole } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';

type Props = { passwordRules: string } & ManagePasskeysProps & ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />
            <div className="space-y-8">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Protect your account</p>
                    <Heading title="Security and sign-in" description="Manage your password, two-factor authentication, and passkeys from one place." />
                </div>

                <section className="rounded-2xl border bg-card p-5 sm:p-6">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div>
                        <div><h2 className="font-semibold">Change password</h2><p className="mt-1 text-sm text-muted-foreground">Use a unique password that you do not use on other websites.</p></div>
                    </div>
                    <Form {...SecurityController.update.form()} options={{ preserveScroll: true }} resetOnError={['password', 'password_confirmation', 'current_password']} resetOnSuccess onError={(errors) => {
                        if (errors.password) passwordInput.current?.focus();
                        if (errors.current_password) currentPasswordInput.current?.focus();
                    }} className="space-y-5">
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2"><Label htmlFor="current_password">Current password</Label><PasswordInput id="current_password" ref={currentPasswordInput} name="current_password" autoComplete="current-password" placeholder="Enter current password" className="h-11" /><InputError message={errors.current_password} /></div>
                                <div className="grid gap-2"><Label htmlFor="password">New password</Label><PasswordInput id="password" ref={passwordInput} name="password" autoComplete="new-password" placeholder="Create a new password" passwordrules={props.passwordRules} className="h-11" /><InputError message={errors.password} /></div>
                                <div className="grid gap-2"><Label htmlFor="password_confirmation">Confirm new password</Label><PasswordInput id="password_confirmation" name="password_confirmation" autoComplete="new-password" placeholder="Enter the new password again" passwordrules={props.passwordRules} className="h-11" /><InputError message={errors.password_confirmation} /></div>
                                <div className="flex justify-end border-t pt-5"><Button disabled={processing} className="w-full sm:w-auto">{processing ? 'Updating password…' : 'Update password'}</Button></div>
                            </>
                        )}
                    </Form>
                </section>

                <section className="rounded-2xl border bg-card p-5 sm:p-6">
                    <ManageTwoFactor canManageTwoFactor={props.canManageTwoFactor} requiresConfirmation={props.requiresConfirmation} twoFactorEnabled={props.twoFactorEnabled} />
                </section>

                <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><KeyRound className="size-5" /></div>
                        <div><h2 className="font-semibold">Passkeys</h2><p className="mt-1 text-sm text-muted-foreground">Use a device or password manager to sign in without typing a password.</p></div>
                    </div>
                    <ManagePasskeys canManagePasskeys={props.canManagePasskeys} passkeys={props.passkeys} />
                </section>
            </div>
        </>
    );
}

Security.layout = { breadcrumbs: [{ title: 'Security settings', href: edit() }] };

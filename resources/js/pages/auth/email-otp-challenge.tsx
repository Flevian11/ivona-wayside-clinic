import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { resend, verify } from '@/routes/email-otp';
import { store as login } from '@/routes/login';

type Props = { expiresAt: number };

export default function EmailOtpChallenge({ expiresAt }: Props) {
    setLayoutProps({
        title: 'Verify your sign-in',
        description: 'Enter the one-time code sent to your verified email address.',
    });

    const expiresIn = Math.max(0, Math.ceil((expiresAt * 1000 - Date.now()) / 60000));

    return (
        <>
            <Head title="Email verification" />
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <MailCheck className="size-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="font-semibold">Check your email</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            We sent a six-digit sign-in code to the verified email address on your account. The code expires in {expiresIn} minute{expiresIn === 1 ? '' : 's'}. Do not share it with anyone.
                        </p>
                    </div>
                </div>

                <Form {...verify()} className="space-y-4" resetOnSuccess>
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="code">Six-digit verification code</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    pattern="[0-9]{6}"
                                    minLength={6}
                                    maxLength={6}
                                    autoFocus
                                    required
                                    className="h-12 text-center text-xl tracking-[0.45em]"
                                    placeholder="000000"
                                />
                                <InputError message={errors.code} />
                            </div>
                            <Button className="w-full" type="submit" disabled={processing}>
                                {processing ? <Spinner /> : <ShieldCheck className="size-4" />}
                                Verify and sign in
                            </Button>
                        </>
                    )}
                </Form>

                <div className="space-y-3 border-t border-border pt-5 text-center">
                    <p className="text-sm text-muted-foreground">Didn't receive the code? Check your spam folder or request a new one after the resend cooldown.</p>
                    <Form {...resend()}>
                        {({ errors, processing }) => (
                            <div className="space-y-2">
                                <Button type="submit" variant="outline" className="w-full" disabled={processing}>
                                    {processing && <Spinner />}
                                    Send a new code
                                </Button>
                                <InputError message={errors.code} />
                            </div>
                        )}
                    </Form>
                    <p className="text-xs text-muted-foreground">Codes are single-use and limited to five verification attempts per sign-in.</p>
                    <Link href={login().url} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                        <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to sign in
                    </Link>
                </div>
            </div>
        </>
    );
}

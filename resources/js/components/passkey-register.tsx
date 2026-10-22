import { usePasskeyRegister } from '@laravel/passkeys/react';
import { CheckCircle2, KeyRound, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

/**
 * Browsers intentionally do not expose a reliable physical device model for
 * every authenticator. Use the best available platform/browser hints and a
 * neutral fallback; never ask the user to type a label or claim an exact model.
 */
function getPasskeyLabel(): string {
    if (typeof navigator === 'undefined') return 'Passkey on this device';

    const nav = navigator as Navigator & {
        userAgentData?: { platform?: string; brands?: { brand: string }[] };
    };
    const ua = nav.userAgent || '';
    const platform = nav.userAgentData?.platform || '';

    const os =
        /iPhone/i.test(ua) ? 'iPhone' :
        /iPad/i.test(ua) || (/Macintosh/i.test(ua) && 'ontouchstart' in window) ? 'iPad' :
        /Android/i.test(ua) ? 'Android device' :
        /Windows/i.test(ua) || /Windows/i.test(platform) ? 'Windows device' :
        /Mac/i.test(ua) || /macOS/i.test(platform) ? 'Mac' :
        /Linux/i.test(ua) || /Linux/i.test(platform) ? 'Linux device' : '';

    const browser =
        /Edg\//i.test(ua) ? 'Edge' :
        /OPR\//i.test(ua) ? 'Opera' :
        /Firefox\//i.test(ua) ? 'Firefox' :
        /Chrome\//i.test(ua) && !/Edg\//i.test(ua) ? 'Chrome' :
        /Safari\//i.test(ua) && !/Chrome\//i.test(ua) ? 'Safari' : '';

    if (os && browser) return `${os} · ${browser}`;
    if (os) return os;
    if (browser) return `${browser} browser`;
    return 'Passkey on this device';
}

type Props = { onSuccess: () => void };

export default function PasskeyRegistration({ onSuccess }: Props) {
    const [label] = useState(getPasskeyLabel);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { register, isLoading, error, isSupported } = usePasskeyRegister({
        onSuccess: () => {
            setShowConfirmation(true);
            onSuccess();
        },
    });

    const handleRegister = async () => {
        // The library stores this name alongside the WebAuthn credential.
        // It is an inferred label, not a guaranteed physical device model.
        await register(label);
    };

    if (!isSupported) {
        return (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
                <Smartphone className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div>
                    <p className="font-medium">Passkeys aren't available here</p>
                    <p className="mt-1 text-muted-foreground">Use a supported, up-to-date browser and a device or password manager that supports passkeys.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <KeyRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold">Add a passkey</p>
                        <p className="mt-1 text-sm text-muted-foreground">Sign in securely with your device, screen lock, or password manager.</p>
                        <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                            <Smartphone className="size-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">Suggested label: <strong className="font-medium">{label}</strong></span>
                        </div>
                    </div>
                </div>
                <Button type="button" onClick={handleRegister} disabled={isLoading} className="w-full shrink-0 sm:w-auto">
                    <ShieldCheck className="size-4" />
                    {isLoading ? 'Waiting for device…' : 'Create passkey'}
                </Button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">The label is generated from browser and platform information. For privacy, browsers may not reveal the exact device model.</p>
            {error && <div className="mt-4"><InputError message={error} /></div>}
            {showConfirmation && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400" role="status">
                    <CheckCircle2 className="size-4 shrink-0" />
                    Passkey registration completed. Refreshing your saved passkeys…
                </div>
            )}
        </div>
    );
}

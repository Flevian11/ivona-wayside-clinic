import { router } from '@inertiajs/react';
import { Fingerprint, KeyRound, ShieldCheck } from 'lucide-react';
import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import PasskeyItem from '@/components/passkey-item';
import PasskeyRegistration from '@/components/passkey-register';
import type { Passkey } from '@/types/auth';

export type Props = { canManagePasskeys?: boolean; passkeys?: Passkey[] };

function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed px-5 py-8 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Fingerprint className="size-6" /></div>
            <p className="font-medium">No passkeys registered</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Add a passkey to use your device screen lock, biometric check, or password manager when signing in.</p>
        </div>
    );
}

export default function ManagePasskeys(props: Props) {
    const passkeys = props.passkeys ?? [];

    const handleDelete = (id: number, onError: () => void) => {
        router.delete(destroy.url(id), {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ['passkeys'] }),
            onError,
        });
    };

    const handleRegisterSuccess = () => {
        router.reload({ only: ['passkeys'] });
    };

    if (!(props.canManagePasskeys ?? false)) return null;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1"><ShieldCheck className="size-3.5" /> Private-key based sign-in</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1"><KeyRound className="size-3.5" /> {passkeys.length} {passkeys.length === 1 ? 'passkey' : 'passkeys'} saved</span>
            </div>

            {passkeys.length > 0 ? (
                <div className="overflow-hidden rounded-xl border bg-background">
                    {passkeys.map((passkey) => <PasskeyItem key={passkey.id} passkey={passkey} onDelete={handleDelete} />)}
                </div>
            ) : <EmptyState />}

            <PasskeyRegistration onSuccess={handleRegisterSuccess} />
        </div>
    );
}

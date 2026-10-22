import { Clock3, KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Passkey } from '@/types/auth';

type Props = { passkey: Passkey; onDelete: (id: number, onError: () => void) => void };

export default function PasskeyItem({ passkey, onDelete }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        onDelete(passkey.id, () => setIsDeleting(false));
    };

    return (
        <div className="flex flex-col gap-4 border-b p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><KeyRound className="size-5" /></div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words font-medium">{passkey.name}</p>
                        {passkey.authenticator && <span className="inline-flex max-w-full items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{passkey.authenticator}</span>}
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                        <span>Added {passkey.created_at_diff}</span>
                        {passkey.last_used_at_diff && <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> Last used {passkey.last_used_at_diff}</span>}
                    </div>
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto">
                        <Trash2 className="size-4" /> Remove passkey
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Remove this passkey?</DialogTitle>
                    <DialogDescription>“{passkey.name}” will no longer be available for signing in to this account. Make sure you have another sign-in method available before removing your last passkey.</DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild><Button variant="secondary">Keep passkey</Button></DialogClose>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? 'Removing…' : 'Remove passkey'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

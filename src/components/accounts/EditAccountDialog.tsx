'use client'

import { useState } from 'react'
import { updateAccount, archiveAccount, restoreAccount } from '@/lib/actions/accounts'
import { AccountForm } from './AccountForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Account } from '@/types'
import type { AccountFormValues } from '@/lib/validators/account'

interface EditAccountDialogProps {
    account: Account
}

export function EditAccountDialog({ account }: EditAccountDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: AccountFormValues) {
        setError(null)
        const result = await updateAccount(account.id, data)
        if (result?.error) {
            setError(result.error)
            return
        }
        setOpen(false)
    }

    async function handleArchive() {
        await archiveAccount(account.id)
    }

    async function handleRestore() {
        await restoreAccount(account.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer font-mono uppercase tracking-widest">
                    Modifica
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className='text-white'>Modifica conto</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <AccountForm
                    defaultValues={{
                        name: account.name,
                        bank_name: account.bank_name ?? undefined,
                        account_type: account.account_type,
                        balance_initial: Number(account.balance_initial),
                        currency: account.currency,
                        color: account.color,
                        icon: account.icon,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Salva modifiche"
                />
                <div className="pt-2 border-t border-white/10">
                    {account.is_active ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="w-full text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-pointer font-mono uppercase tracking-widest py-1">
                                    Archivia conto
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#0d1420] border-white/10">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Archivia conto</AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/40 font-mono text-xs">
                                        Il conto verrà archiviato e non apparirà più nella dashboard. Le transazioni esistenti rimarranno invariate.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer">
                                        Annulla
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleArchive}
                                        className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 cursor-pointer"
                                    >
                                        Archivia
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <button
                            onClick={handleRestore}
                            className="w-full text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors cursor-pointer font-mono uppercase tracking-widest py-1"
                        >
                            Ripristina conto
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
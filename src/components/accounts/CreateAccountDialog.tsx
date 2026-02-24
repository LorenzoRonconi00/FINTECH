'use client'

import { useState } from 'react'
import { createAccount } from '@/lib/actions/accounts'
import { AccountForm } from './AccountForm'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { AccountFormValues } from '@/lib/validators/account'

export function CreateAccountDialog() {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: AccountFormValues) {
        setError(null)
        const result = await createAccount(data)
        if (result?.error) {
            setError(result.error)
            return
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                    Aggiungi conto
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuovo conto</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <AccountForm onSubmit={handleSubmit} submitLabel="Crea conto" />
            </DialogContent>
        </Dialog>
    )
}
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

interface CreateAccountDialogProps {
    compact?: boolean
}

export function CreateAccountDialog({ compact = false }: CreateAccountDialogProps) {
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
                {compact ? (
                    <button
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-white/40 hover:text-white/80 transition-all duration-200 cursor-pointer"
                        aria-label="Aggiungi conto"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                ) : (
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                        Aggiungi conto
                    </button>
                )}
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
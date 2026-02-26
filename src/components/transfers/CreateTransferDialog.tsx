'use client'

import { useState } from 'react'
import { createTransfer } from '@/lib/actions/transfers'
import { TransferForm } from './TransferForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { Account } from '@/types'
import type { TransferFormValues } from '@/lib/validators/transfer'
import { toast } from 'sonner'

interface CreateTransferDialogProps {
    accounts: Account[]
}

export function CreateTransferDialog({ accounts }: CreateTransferDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: TransferFormValues) {
        setError(null)
        const result = await createTransfer(data)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setOpen(false)
        toast.success('Trasferimento eseguito')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                    Nuovo trasferimento
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuovo trasferimento</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <TransferForm
                    accounts={accounts}
                    onSubmit={handleSubmit}
                    submitLabel="Esegui trasferimento"
                />
            </DialogContent>
        </Dialog>
    )
}
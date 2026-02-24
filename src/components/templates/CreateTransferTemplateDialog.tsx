'use client'

import { useState } from 'react'
import { createTransferTemplate } from '@/lib/actions/templates'
import { TransferTemplateForm } from './TransferTemplateForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { Account } from '@/types'
import type { TransferTemplateFormValues } from '@/lib/validators/template'

interface CreateTransferTemplateDialogProps {
    accounts: Account[]
}

export function CreateTransferTemplateDialog({ accounts }: CreateTransferTemplateDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: TransferTemplateFormValues) {
        setError(null)
        const result = await createTransferTemplate({
            ...data,
            end_month: data.end_month || null,
            notes: data.notes || null,
            emoji: data.emoji || null,
        })
        if (result?.error) {
            setError(result.error)
            return
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                    Nuovo trasferimento
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuovo template trasferimento</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <TransferTemplateForm
                    accounts={accounts}
                    onSubmit={handleSubmit}
                    submitLabel="Crea template"
                />
            </DialogContent>
        </Dialog>
    )
}
'use client'

import { useState } from 'react'
import { createRecurringTemplate } from '@/lib/actions/templates'
import { RecurringTemplateForm } from './RecurringTemplateForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { Account, Category } from '@/types'
import type { RecurringTemplateFormValues } from '@/lib/validators/template'

interface CreateRecurringTemplateDialogProps {
    accounts: Account[]
    categories: Category[]
}

export function CreateRecurringTemplateDialog({
    accounts,
    categories,
}: CreateRecurringTemplateDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: RecurringTemplateFormValues) {
        setError(null)
        const result = await createRecurringTemplate({
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
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                    Nuovo template
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuovo template ricorrente</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <RecurringTemplateForm
                    accounts={accounts}
                    categories={categories}
                    onSubmit={handleSubmit}
                    submitLabel="Crea template"
                />
            </DialogContent>
        </Dialog>
    )
}
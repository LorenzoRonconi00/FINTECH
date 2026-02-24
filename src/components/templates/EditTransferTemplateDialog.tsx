'use client'

import { useState } from 'react'
import { updateTransferTemplate, deleteTransferTemplate } from '@/lib/actions/templates'
import { TransferTemplateForm } from './TransferTemplateForm'
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
import type { Account, TransferTemplate } from '@/types'
import type { TransferTemplateFormValues } from '@/lib/validators/template'

interface EditTransferTemplateDialogProps {
    template: TransferTemplate
    accounts: Account[]
}

export function EditTransferTemplateDialog({ template, accounts }: EditTransferTemplateDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: TransferTemplateFormValues) {
        setError(null)
        const result = await updateTransferTemplate(template.id, {
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

    async function handleDelete() {
        const result = await deleteTransferTemplate(template.id)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono cursor-pointer">
                    Modifica
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Modifica template trasferimento</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <TransferTemplateForm
                    accounts={accounts}
                    defaultValues={{
                        from_account_id: template.from_account_id,
                        to_account_id: template.to_account_id,
                        amount: template.amount,
                        amount_is_variable: template.amount_is_variable,
                        scheduled_day: template.scheduled_day,
                        start_month: template.start_month,
                        end_month: template.end_month ?? '',
                        notes: template.notes ?? '',
                        emoji: template.emoji ?? '',
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Salva modifiche"
                />
                <div className="pt-2 border-t border-white/5">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors font-mono cursor-pointer">
                                Elimina template
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0d1420] border-white/10 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Eliminare il template?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/40 font-mono text-xs">
                                    Il template verrà eliminato permanentemente. I trasferimenti già generati non saranno influenzati.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                                    Annulla
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-400 text-white"
                                >
                                    Elimina
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    )
}
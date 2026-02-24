'use client'

import { useState } from 'react'
import { updateRecurringTemplate, deleteRecurringTemplate } from '@/lib/actions/templates'
import { RecurringTemplateForm } from './RecurringTemplateForm'
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
import type { Account, Category, RecurringTemplate } from '@/types'
import type { RecurringTemplateFormValues } from '@/lib/validators/template'

interface EditRecurringTemplateDialogProps {
    template: RecurringTemplate
    accounts: Account[]
    categories: Category[]
}

export function EditRecurringTemplateDialog({
    template,
    accounts,
    categories,
}: EditRecurringTemplateDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: RecurringTemplateFormValues) {
        setError(null)
        const result = await updateRecurringTemplate(template.id, {
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
        const result = await deleteRecurringTemplate(template.id)
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
                    <DialogTitle className="text-white">Modifica template</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <RecurringTemplateForm
                    accounts={accounts}
                    categories={categories}
                    defaultValues={{
                        title: template.title,
                        amount: template.amount,
                        amount_is_variable: template.amount_is_variable,
                        type: template.type,
                        account_id: template.account_id,
                        category_id: template.category_id,
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
                                    Il template <span className="text-white/70">{template.title}</span> verrà eliminato permanentemente.
                                    Le transazioni già generate non saranno influenzate.
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
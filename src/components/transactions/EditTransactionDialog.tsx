'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateTransaction, deleteTransaction } from '@/lib/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import type { Transaction } from '@/types'
import { toast } from 'sonner'

const editSchema = z.object({
    title: z.string().min(1, 'Il titolo è obbligatorio'),
    amount: z.coerce.number().min(0.01, "L'importo deve essere maggiore di 0"),
    date: z.string().min(1, 'La data è obbligatoria'),
    notes: z.string().optional(),
})

type EditFormValues = z.infer<typeof editSchema>

interface EditTransactionDialogProps {
    transaction: Transaction
}

export function EditTransactionDialog({ transaction }: EditTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editSchema) as import('react-hook-form').Resolver<EditFormValues>,
        defaultValues: {
            title: transaction.title,
            amount: transaction.amount,
            date: transaction.date,
            notes: transaction.notes ?? '',
        },
    })

    async function handleUpdate(data: EditFormValues) {
        setError(null)
        const result = await updateTransaction(transaction.id, data)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setOpen(false)
        toast.success('Transazione aggiornata')
    }

    async function handleDelete() {
        const result = await deleteTransaction(transaction.id)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        toast.success('Transazione eliminata')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono cursor-pointer">
                    Modifica
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Modifica transazione</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Titolo</Label>
                        <Input
                            {...register('title')}
                            className="bg-white/5 border-white/10 text-white focus:border-emerald-500/50"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-400 font-mono">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Importo</Label>
                        <Input
                            {...register('amount')}
                            type="number"
                            step="0.01"
                            className="bg-white/5 border-white/10 text-white focus:border-emerald-500/50"
                        />
                        {errors.amount && (
                            <p className="text-xs text-red-400 font-mono">{errors.amount.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Data</Label>
                        <Input
                            {...register('date')}
                            type="date"
                            className="bg-white/5 border-white/10 text-white focus:border-emerald-500/50 font-mono scheme-dark"
                        />
                        {errors.date && (
                            <p className="text-xs text-red-400 font-mono">{errors.date.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                            Note <span className="text-white/25">(opzionale)</span>
                        </Label>
                        <Textarea
                            {...register('notes')}
                            rows={2}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold"
                    >
                        {isSubmitting ? 'Salvataggio...' : 'Salva modifiche'}
                    </Button>
                </form>

                <div className="pt-2 border-t border-white/5">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors font-mono cursor-pointer">
                                Elimina transazione
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0d1420] border-white/10 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Eliminare la transazione?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/40 font-mono text-xs">
                                    La transazione <span className="text-white/70">{transaction.title}</span> verrà eliminata permanentemente.
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
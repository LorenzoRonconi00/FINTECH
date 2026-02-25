'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { confirmTransaction } from '@/lib/actions/transactions'
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
import type { Transaction } from '@/types'

const confirmSchema = z.object({
    date: z.string().min(1, 'La data è obbligatoria'),
    amount: z.coerce.number().min(0.01, "L'importo deve essere maggiore di 0"),
    notes: z.string().optional(),
})

type ConfirmFormValues = z.infer<typeof confirmSchema>

interface ConfirmTransactionDialogProps {
    transaction: Transaction
}

export function ConfirmTransactionDialog({ transaction }: ConfirmTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ConfirmFormValues>({
        resolver: zodResolver(confirmSchema) as import('react-hook-form').Resolver<ConfirmFormValues>,
        defaultValues: {
            date: transaction.date,
            amount: transaction.amount,
            notes: transaction.notes ?? '',
        },
    })

    async function handleConfirm(data: ConfirmFormValues) {
        setError(null)
        const result = await confirmTransaction(transaction.id, data)
        if (result?.error) {
            setError(result.error)
            return
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors font-mono cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20">
                    Conferma
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Conferma transazione</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-white/50 font-mono bg-white/5 rounded-lg px-3 py-2">
                    {transaction.title}
                </div>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                            Data effettiva
                        </Label>
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
                            Importo effettivo
                        </Label>
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
                        {isSubmitting ? 'Conferma in corso...' : 'Conferma'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
'use client'

import { useState } from 'react'
import { createTransaction } from '@/lib/actions/transactions'
import { TransactionForm } from './TransactionForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { Account, Category } from '@/types'
import type { TransactionFormValues } from '@/lib/validators/transaction'
import { toast } from 'sonner'

interface CreateTransactionDialogProps {
    accounts: Account[]
    categories: Category[]
}

export function CreateTransactionDialog({ accounts, categories }: CreateTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: TransactionFormValues) {
        setError(null)
        const result = await createTransaction(data)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setOpen(false)
        toast.success('Transazione registrata')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                    Nuova transazione
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuova transazione</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <TransactionForm
                    accounts={accounts}
                    categories={categories}
                    onSubmit={handleSubmit}
                    submitLabel="Registra transazione"
                />
            </DialogContent>
        </Dialog>
    )
}
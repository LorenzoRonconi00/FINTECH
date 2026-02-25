'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormValues } from '@/lib/validators/transaction'
import { TRANSACTION_TYPE_LABELS } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { Account, Category } from '@/types'

interface TransactionFormProps {
    accounts: Account[]
    categories: Category[]
    defaultValues?: Partial<TransactionFormValues>
    onSubmit: (data: TransactionFormValues) => Promise<void>
    submitLabel?: string
}

export function TransactionForm({
    accounts,
    categories,
    defaultValues,
    onSubmit,
    submitLabel = 'Salva',
}: TransactionFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema) as import('react-hook-form').Resolver<TransactionFormValues>,
        defaultValues: {
            type: 'expense',
            date: new Date().toISOString().slice(0, 10),
            ...defaultValues,
        },
    })

    const selectedType = watch('type')
    const filteredCategories = categories.filter((c) => c.type === selectedType)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Titolo */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Titolo</Label>
                <Input
                    {...register('title')}
                    placeholder="es. Spesa al supermercato"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                />
                {errors.title && (
                    <p className="text-xs text-red-400 font-mono">{errors.title.message}</p>
                )}
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Tipo</Label>
                <Select
                    defaultValue={defaultValues?.type ?? 'expense'}
                    onValueChange={(v) => {
                        setValue('type', v as 'income' | 'expense')
                        setValue('category_id', '')
                    }}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {(['income', 'expense'] as const).map((t) => (
                            <SelectItem key={t} value={t} className="text-white focus:bg-white/10">
                                {TRANSACTION_TYPE_LABELS[t]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Importo */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Importo</Label>
                <Input
                    {...register('amount')}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                />
                {errors.amount && (
                    <p className="text-xs text-red-400 font-mono">{errors.amount.message}</p>
                )}
            </div>

            {/* Conto */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Conto</Label>
                <Select
                    defaultValue={defaultValues?.account_id}
                    onValueChange={(v) => setValue('account_id', v)}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Seleziona un conto" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {accounts.map((a) => (
                            <SelectItem key={a.id} value={a.id} className="text-white focus:bg-white/10">
                                {a.icon} {a.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.account_id && (
                    <p className="text-xs text-red-400 font-mono">{errors.account_id.message}</p>
                )}
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Categoria</Label>
                <Select
                    defaultValue={defaultValues?.category_id}
                    onValueChange={(v) => setValue('category_id', v)}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {filteredCategories.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-white focus:bg-white/10">
                                {c.icon} {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category_id && (
                    <p className="text-xs text-red-400 font-mono">{errors.category_id.message}</p>
                )}
            </div>

            {/* Data */}
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

            {/* Note */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                    Note <span className="text-white/25">(opzionale)</span>
                </Label>
                <Textarea
                    {...register('notes')}
                    placeholder="Note aggiuntive..."
                    rows={2}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 resize-none"
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold"
            >
                {isSubmitting ? 'Salvataggio...' : submitLabel}
            </Button>
        </form>
    )
}
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transferSchema, type TransferFormValues } from '@/lib/validators/transfer'
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
import type { Account } from '@/types'

interface TransferFormProps {
    accounts: Account[]
    defaultValues?: Partial<TransferFormValues>
    onSubmit: (data: TransferFormValues) => Promise<void>
    submitLabel?: string
}

export function TransferForm({
    accounts,
    defaultValues,
    onSubmit,
    submitLabel = 'Salva',
}: TransferFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema) as import('react-hook-form').Resolver<TransferFormValues>,
        defaultValues: {
            date: new Date().toISOString().slice(0, 10),
            ...defaultValues,
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Conto origine */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Da</Label>
                <Select
                    defaultValue={defaultValues?.from_account_id}
                    onValueChange={(v) => setValue('from_account_id', v)}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Conto di origine" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {accounts.map((a) => (
                            <SelectItem key={a.id} value={a.id} className="text-white focus:bg-white/10">
                                {a.icon} {a.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.from_account_id && (
                    <p className="text-xs text-red-400 font-mono">{errors.from_account_id.message}</p>
                )}
            </div>

            {/* Conto destinazione */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">A</Label>
                <Select
                    defaultValue={defaultValues?.to_account_id}
                    onValueChange={(v) => setValue('to_account_id', v)}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Conto di destinazione" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {accounts.map((a) => (
                            <SelectItem key={a.id} value={a.id} className="text-white focus:bg-white/10">
                                {a.icon} {a.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.to_account_id && (
                    <p className="text-xs text-red-400 font-mono">{errors.to_account_id.message}</p>
                )}
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
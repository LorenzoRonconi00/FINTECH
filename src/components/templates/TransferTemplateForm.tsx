'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transferTemplateSchema, type TransferTemplateFormValues } from '@/lib/validators/template'
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

interface TransferTemplateFormProps {
    accounts: Account[]
    defaultValues?: Partial<TransferTemplateFormValues>
    onSubmit: (data: TransferTemplateFormValues) => Promise<void>
    submitLabel?: string
}

const EMOJI_SUGGESTIONS = ['🔄', '💸', '🏦', '💰', '📤', '📥', '💼', '🎯']

export function TransferTemplateForm({
    accounts,
    defaultValues,
    onSubmit,
    submitLabel = 'Salva',
}: TransferTemplateFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TransferTemplateFormValues>({
        resolver: zodResolver(transferTemplateSchema) as import('react-hook-form').Resolver<TransferTemplateFormValues>,
        defaultValues: {
            amount_is_variable: false,
            scheduled_day: 1,
            start_month: new Date().toISOString().slice(0, 7),
            emoji: '🔄',
            ...defaultValues,
        },
    })

    const selectedEmoji = watch('emoji')
    const amountIsVariable = watch('amount_is_variable')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Emoji */}
            <div className="space-y-2">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Emoji</Label>
                <div className="flex gap-1.5">
                    {EMOJI_SUGGESTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setValue('emoji', emoji)}
                            className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-all border ${selectedEmoji === emoji
                                    ? 'border-emerald-500/60 bg-emerald-500/10'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

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

            {/* Importo + variabile */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Importo</Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('amount_is_variable')}
                            className="accent-emerald-500"
                        />
                        <span className="text-xs text-white/40 font-mono">Variabile</span>
                    </label>
                </div>
                <Input
                    {...register('amount')}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                />
                {amountIsVariable && (
                    <p className="text-xs text-white/30 font-mono">
                        L'importo è indicativo e potrà essere modificato alla conferma
                    </p>
                )}
                {errors.amount && (
                    <p className="text-xs text-red-400 font-mono">{errors.amount.message}</p>
                )}
            </div>

            {/* Giorno */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                    Giorno del mese
                </Label>
                <Input
                    {...register('scheduled_day')}
                    type="number"
                    min={1}
                    max={28}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                />
                <p className="text-xs text-white/25 font-mono">Da 1 a 28 per compatibilità con tutti i mesi</p>
                {errors.scheduled_day && (
                    <p className="text-xs text-red-400 font-mono">{errors.scheduled_day.message}</p>
                )}
            </div>

            {/* Range mesi */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Da</Label>
                    <Input
                        {...register('start_month')}
                        placeholder="YYYY-MM"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 font-mono"
                    />
                    {errors.start_month && (
                        <p className="text-xs text-red-400 font-mono">{errors.start_month.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                        A <span className="text-white/25">(opzionale)</span>
                    </Label>
                    <Input
                        {...register('end_month')}
                        placeholder="YYYY-MM"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 font-mono"
                    />
                    {errors.end_month && (
                        <p className="text-xs text-red-400 font-mono">{errors.end_month.message}</p>
                    )}
                </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                    Note <span className="text-white/25">(opzionale)</span>
                </Label>
                <Textarea
                    {...register('notes')}
                    placeholder="Note precompilate per il trasferimento..."
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
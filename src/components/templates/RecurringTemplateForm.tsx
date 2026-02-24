'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recurringTemplateSchema, type RecurringTemplateFormValues } from '@/lib/validators/template'
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

interface RecurringTemplateFormProps {
    accounts: Account[]
    categories: Category[]
    defaultValues?: Partial<RecurringTemplateFormValues>
    onSubmit: (data: RecurringTemplateFormValues) => Promise<void>
    submitLabel?: string
}

const EMOJI_SUGGESTIONS = ['💰', '🏠', '🚗', '📱', '💼', '🛒', '📚', '✈️', '⚡', '🎮', '💊', '🎵']

export function RecurringTemplateForm({
    accounts,
    categories,
    defaultValues,
    onSubmit,
    submitLabel = 'Salva',
}: RecurringTemplateFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RecurringTemplateFormValues>({
        resolver: zodResolver(recurringTemplateSchema) as import('react-hook-form').Resolver<RecurringTemplateFormValues>,
        defaultValues: {
            amount_is_variable: false,
            type: 'expense',
            scheduled_day: 1,
            start_month: new Date().toISOString().slice(0, 7),
            emoji: '💰',
            ...defaultValues,
        },
    })

    const selectedType = watch('type')
    const selectedEmoji = watch('emoji')
    const amountIsVariable = watch('amount_is_variable')

    const filteredCategories = categories.filter(
        (c) => c.type === selectedType || c.type === 'transfer'
    ).filter((c) => c.type !== 'transfer')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Emoji + Titolo */}
            <div className="flex gap-3">
                <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Emoji</Label>
                    <div className="flex gap-1.5 flex-wrap w-48">
                        {EMOJI_SUGGESTIONS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => setValue('emoji', emoji)}
                                className={`h-8 w-8 rounded-lg flex items-center justify-center text-base transition-all border ${selectedEmoji === emoji
                                        ? 'border-emerald-500/60 bg-emerald-500/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 space-y-1.5">
                    <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Titolo</Label>
                    <Input
                        {...register('title')}
                        placeholder="es. Affitto"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                    />
                    {errors.title && (
                        <p className="text-xs text-red-400 font-mono">{errors.title.message}</p>
                    )}
                </div>
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
                    placeholder="Note precompilate per la transazione..."
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
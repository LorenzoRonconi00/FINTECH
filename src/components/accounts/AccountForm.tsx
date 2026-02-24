'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema, type AccountFormValues } from '@/lib/validators/account'
import { ACCOUNT_TYPE_LABELS, ACCOUNT_COLORS, type Account } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface AccountFormProps {
    defaultValues?: Partial<AccountFormValues>
    onSubmit: (data: AccountFormValues) => Promise<void>
    submitLabel?: string
}

export function AccountForm({ defaultValues, onSubmit, submitLabel = 'Salva' }: AccountFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema) as import('react-hook-form').Resolver<AccountFormValues>,
        defaultValues: {
            currency: 'EUR',
            color: ACCOUNT_COLORS[0],
            icon: '💳',
            ...defaultValues,
        },
    })

    const selectedColor = watch('color')
    const selectedType = watch('account_type')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono" htmlFor="name">Nome conto *</label>
                <Input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 font-mono" id="name" {...register('name')} placeholder="es. Primario" />
                {errors.name && <p className="text-xs text-red-400 font-mono">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono" htmlFor="bank_name">Banca</label>
                <Input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 font-mono" id="bank_name" {...register('bank_name')} placeholder="es. Intesa Sanpaolo" />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono">Tipo conto *</label>
                <Select
                    value={selectedType}
                    onValueChange={(val) => setValue('account_type', val as AccountFormValues['account_type'])}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-emerald-500/30">
                        <SelectValue placeholder="Seleziona tipo" className="text-white/40" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value} className="text-white/70 focus:bg-white/10 focus:text-white font-mono text-sm">
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.account_type && <p className="text-xs text-red-400 font-mono">{errors.account_type.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono" htmlFor="balance_initial">Saldo iniziale *</label>
                <Input
                    id="balance_initial"
                    type="number"
                    step="0.01"
                    {...register('balance_initial')}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 font-mono"
                />
                {errors.balance_initial && <p className="text-xs text-red-400 font-mono">{errors.balance_initial.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono" htmlFor="icon">Emoji</label>
                <Input id="icon" {...register('icon')} placeholder="💳" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 font-mono" />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono">Colore</label>
                <div className="flex gap-2 flex-wrap">
                    {ACCOUNT_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setValue('color', color)}
                            className="w-7 h-7 rounded-full border-2 transition-all"
                            style={{
                                backgroundColor: color,
                                borderColor: selectedColor === color ? 'black' : 'transparent',
                            }}
                        />
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/40 text-white font-semibold text-sm py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed tracking-wide"
            >
                {isSubmitting ? 'Salvataggio...' : submitLabel}
            </button>
        </form>
    )
}
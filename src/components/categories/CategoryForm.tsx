'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, type CategoryFormValues } from '@/lib/validators/category'
import { CATEGORY_COLORS, CATEGORY_TYPE_LABELS } from '@/types'
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

interface CategoryFormProps {
    defaultValues?: Partial<CategoryFormValues>
    onSubmit: (data: CategoryFormValues) => Promise<void>
    submitLabel?: string
}

const EMOJI_SUGGESTIONS = ['🏠', '🚗', '🛒', '💊', '📱', '🎮', '📚', '💰', '💼', '✈️', '🍔', '⚡', '🎵', '🐾', '🏋️', '🎁']

export function CategoryForm({ defaultValues, onSubmit, submitLabel = 'Salva' }: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            color: CATEGORY_COLORS[0],
            type: 'expense',
            icon: '📦',
            ...defaultValues,
        },
    })

    const selectedColor = watch('color')
    const selectedIcon = watch('icon')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Nome</Label>
                <Input
                    {...register('name')}
                    placeholder="es. Abbonamenti"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                />
                {errors.name && (
                    <p className="text-xs text-red-400 font-mono">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Tipo</Label>
                <Select
                    defaultValue={defaultValues?.type ?? 'expense'}
                    onValueChange={(v) => setValue('type', v as CategoryFormValues['type'])}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {(['income', 'expense'] as const).map((t) => (
                            <SelectItem key={t} value={t} className="text-white focus:bg-white/10">
                                {CATEGORY_TYPE_LABELS[t]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Icona</Label>
                <div className="grid grid-cols-8 gap-1.5">
                    {EMOJI_SUGGESTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setValue('icon', emoji)}
                            className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-all border ${selectedIcon === emoji
                                    ? 'border-emerald-500/60 bg-emerald-500/10'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <Input
                    {...register('icon')}
                    placeholder="o digita un'emoji"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                />
                {errors.icon && (
                    <p className="text-xs text-red-400 font-mono">{errors.icon.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">Colore</Label>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORY_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setValue('color', color)}
                            className={`w-7 h-7 rounded-full transition-all border-2 ${selectedColor === color
                                    ? 'border-white/80 scale-110'
                                    : 'border-transparent hover:scale-105'
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                {errors.color && (
                    <p className="text-xs text-red-400 font-mono">{errors.color.message}</p>
                )}
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
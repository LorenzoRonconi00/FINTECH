'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSettingsSchema, type UserSettingsFormValues } from '@/lib/validators/settings'
import { updateUserSettings } from '@/lib/actions/settings'
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
import type { UserSettings } from '@/types'
import { toast } from 'sonner'

const CURRENCIES = [
    { value: 'EUR', label: 'EUR — Euro' },
    { value: 'USD', label: 'USD — Dollaro USA' },
    { value: 'GBP', label: 'GBP — Sterlina' },
    { value: 'CHF', label: 'CHF — Franco svizzero' },
    { value: 'JPY', label: 'JPY — Yen' },
]

const TIMEZONES = [
    'Europe/Rome',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Zurich',
    'America/New_York',
    'America/Chicago',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Asia/Shanghai',
]

interface SettingsFormProps {
    settings: UserSettings
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UserSettingsFormValues>({
        resolver: zodResolver(userSettingsSchema) as import('react-hook-form').Resolver<UserSettingsFormValues>,
        defaultValues: {
            budget_start_day: settings.budget_start_day,
            default_currency: settings.default_currency,
            timezone: settings.timezone,
        },
    })

    async function handleSave(data: UserSettingsFormValues) {
        setError(null)
        setSuccess(false)
        const result = await updateUserSettings(data)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setSuccess(true)
        toast.success('Impostazioni aggiornate')
        setTimeout(() => setSuccess(false), 3000)
    }

    return (
        <form onSubmit={handleSubmit(handleSave)} className="space-y-6">

            {/* Budget start day */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                    Giorno di inizio periodo
                </Label>
                <Input
                    {...register('budget_start_day')}
                    type="number"
                    min={1}
                    max={28}
                    className="bg-white/5 border-white/10 text-white focus:border-emerald-500/50 max-w-32"
                />
                <p className="text-xs text-white/25 font-mono">
                    Il periodo finanziario inizia ogni mese da questo giorno. Da 1 a 28.
                </p>
                {errors.budget_start_day && (
                    <p className="text-xs text-red-400 font-mono">{errors.budget_start_day.message}</p>
                )}
            </div>

            {/* Valuta */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                    Valuta default
                </Label>
                <Select
                    defaultValue={settings.default_currency}
                    onValueChange={(v) => setValue('default_currency', v, { shouldDirty: true })}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white max-w-64">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value} className="text-white focus:bg-white/10 font-mono">
                                {c.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.default_currency && (
                    <p className="text-xs text-red-400 font-mono">{errors.default_currency.message}</p>
                )}
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-mono uppercase tracking-widest">
                    Fuso orario
                </Label>
                <Select
                    defaultValue={settings.timezone}
                    onValueChange={(v) => setValue('timezone', v, { shouldDirty: true })}
                >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white max-w-64">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1420] border-white/10">
                        {TIMEZONES.map((tz) => (
                            <SelectItem key={tz} value={tz} className="text-white focus:bg-white/10 font-mono text-xs">
                                {tz}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-white/25 font-mono">
                    Usato per calcolare correttamente il periodo finanziario corrente.
                </p>
                {errors.timezone && (
                    <p className="text-xs text-red-400 font-mono">{errors.timezone.message}</p>
                )}
            </div>

            {/* Feedback */}
            {error && (
                <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    Impostazioni salvate
                </p>
            )}

            <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold disabled:opacity-40"
            >
                {isSubmitting ? 'Salvataggio...' : 'Salva impostazioni'}
            </Button>
        </form>
    )
}
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface PeriodSelectorProps {
    periods: string[]
    currentPeriod: string
    activePeriod: string
}

export function PeriodSelector({ periods, currentPeriod, activePeriod }: PeriodSelectorProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleChange(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value === currentPeriod) {
            params.delete('period')
        } else {
            params.set('period', value)
        }
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname)
    }

    return (
        <select
            value={activePeriod}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
        >
            {periods.map((p) => (
                <option key={p} value={p} className="bg-[#0d1420]">
                    {p}{p === currentPeriod ? ' (corrente)' : ''}
                </option>
            ))}
        </select>
    )
}
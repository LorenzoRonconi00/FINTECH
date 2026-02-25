'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Account } from '@/types'

interface StatisticsFiltersProps {
    accounts: Account[]
}

export function StatisticsFilters({ accounts }: StatisticsFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function updateFilter(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const selectClass = "bg-white/5 border border-white/10 text-white text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"

    return (
        <div className="flex flex-wrap gap-2">
            <select
                value={searchParams.get('range') ?? '1'}
                onChange={(e) => updateFilter('range', e.target.value)}
                className={selectClass}
            >
                <option value="1" className="bg-[#0d1420]">Periodo corrente</option>
                <option value="3" className="bg-[#0d1420]">Ultimi 3 periodi</option>
                <option value="6" className="bg-[#0d1420]">Ultimi 6 periodi</option>
                <option value="12" className="bg-[#0d1420]">Ultimi 12 periodi</option>
            </select>

            <select
                value={searchParams.get('account_id') ?? ''}
                onChange={(e) => updateFilter('account_id', e.target.value)}
                className={selectClass}
            >
                <option value="" className="bg-[#0d1420]">Tutti i conti</option>
                {accounts.map((a) => (
                    <option key={a.id} value={a.id} className="bg-[#0d1420]">
                        {a.icon} {a.name}
                    </option>
                ))}
            </select>

            <button
                onClick={() => updateFilter(
                    'transfers',
                    searchParams.get('transfers') === '1' ? '' : '1'
                )}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${searchParams.get('transfers') === '1'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 bg-white/5 text-white/40 hover:text-white/70'
                    }`}
            >
                {searchParams.get('transfers') === '1' ? '✓ ' : ''}Includi trasferimenti
            </button>
        </div>
    )
}
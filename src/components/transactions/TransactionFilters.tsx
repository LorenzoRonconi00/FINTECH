'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Account } from '@/types'

interface TransactionFiltersProps {
    accounts: Account[]
    periods: string[]
    currentPeriod: string
}

export function TransactionFilters({ accounts, periods, currentPeriod }: TransactionFiltersProps) {
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
            {/* Periodo */}
            <select
                value={searchParams.get('period') ?? currentPeriod}
                onChange={(e) => updateFilter('period', e.target.value)}
                className={selectClass}
            >
                {periods.map((p) => (
                    <option key={p} value={p} className="bg-[#0d1420]">{p}</option>
                ))}
            </select>

            {/* Stato */}
            <select
                value={searchParams.get('status') ?? ''}
                onChange={(e) => updateFilter('status', e.target.value)}
                className={selectClass}
            >
                <option value="" className="bg-[#0d1420]">Tutti gli stati</option>
                <option value="confirmed" className="bg-[#0d1420]">Confermate</option>
                <option value="pending" className="bg-[#0d1420]">In attesa</option>
                <option value="skipped" className="bg-[#0d1420]">Saltate</option>
            </select>

            {/* Tipo */}
            <select
                value={searchParams.get('type') ?? ''}
                onChange={(e) => updateFilter('type', e.target.value)}
                className={selectClass}
            >
                <option value="" className="bg-[#0d1420]">Entrate e uscite</option>
                <option value="income" className="bg-[#0d1420]">Solo entrate</option>
                <option value="expense" className="bg-[#0d1420]">Solo uscite</option>
            </select>

            {/* Conto */}
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
        </div>
    )
}
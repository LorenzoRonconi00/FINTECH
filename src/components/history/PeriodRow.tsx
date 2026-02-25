import Link from 'next/link'

interface PeriodRowProps {
    period: string
    confirmedIncome: number
    confirmedExpense: number
    realBalance: number
    projectedBalance: number
    isActive: boolean
    currency: string
}

export function PeriodRow({
    period,
    confirmedIncome,
    confirmedExpense,
    realBalance,
    projectedBalance,
    isActive,
    currency,
}: PeriodRowProps) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(n)

    const hasPending = projectedBalance !== realBalance

    return (
        <Link
            href={`/history?period=${period}`}
            className={`block px-4 py-4 rounded-xl border transition-all duration-200 ${
                isActive
                    ? 'border-emerald-500/30 bg-emerald-500/4'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
            }`}
        >
            {/* Periodo + saldo */}
            <div className="flex items-center justify-between">
                <p className={`text-sm font-mono font-semibold ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                    {period}
                </p>
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold font-mono ${realBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {fmt(realBalance)}
                    </p>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                        className={`shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-white/20'}`}>
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Entrate / Uscite */}
            <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-emerald-400/60 font-mono">
                    +{fmt(confirmedIncome)}
                </span>
                <span className="text-white/15 text-xs">·</span>
                <span className="text-xs text-red-400/60 font-mono">
                    -{fmt(confirmedExpense)}
                </span>
            </div>

            {/* Proiettato (solo se diverso dal reale) */}
            {hasPending && (
                <p className="text-xs text-white/20 font-mono mt-1">
                    {fmt(projectedBalance)} proiettato
                </p>
            )}
        </Link>
    )
}
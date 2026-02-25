interface PeriodSummaryCardsProps {
    confirmedIncome: number
    confirmedExpense: number
    realBalance: number
    projectedBalance: number
    currency: string
}

export function PeriodSummaryCards({
    confirmedIncome,
    confirmedExpense,
    realBalance,
    projectedBalance,
    currency,
}: PeriodSummaryCardsProps) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(n)

    const cards = [
        {
            label: 'Entrate',
            value: fmt(confirmedIncome),
            color: 'text-emerald-400',
            border: 'border-emerald-500/10',
            bg: 'bg-emerald-500/[0.03]',
        },
        {
            label: 'Uscite',
            value: fmt(confirmedExpense),
            color: 'text-red-400',
            border: 'border-red-500/10',
            bg: 'bg-red-500/[0.03]',
        },
        {
            label: 'Saldo reale',
            value: fmt(realBalance),
            color: realBalance >= 0 ? 'text-white' : 'text-red-400',
            border: 'border-white/10',
            bg: 'bg-white/[0.02]',
        },
        {
            label: 'Saldo proiettato',
            value: fmt(projectedBalance),
            color: projectedBalance >= 0 ? 'text-white/60' : 'text-red-400/60',
            border: 'border-white/5',
            bg: 'bg-white/[0.01]',
            hint: 'Include i pending',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`rounded-xl border ${card.border} ${card.bg} px-4 py-4 space-y-1`}
                >
                    <p className="text-xs font-mono uppercase tracking-widest text-white/30">
                        {card.label}
                    </p>
                    <p className={`text-lg font-bold font-mono ${card.color}`}>
                        {card.value}
                    </p>
                    {card.hint && (
                        <p className="text-xs text-white/20 font-mono">{card.hint}</p>
                    )}
                </div>
            ))}
        </div>
    )
}
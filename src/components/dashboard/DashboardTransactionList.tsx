interface DashboardTransaction {
    id: string
    title: string
    amount: number
    type: 'income' | 'expense'
    date: string
    account: { name: string; icon: string } | null
    category: { name: string; icon: string; color: string } | null
}

interface DashboardTransactionListProps {
    transactions: DashboardTransaction[]
}

export function DashboardTransactionList({ transactions }: DashboardTransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 rounded-xl border border-white/5 bg-white/1">
                <p className="text-white/30 font-mono text-sm">Nessuna transazione confermata</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {transactions.map((tx) => (
                <div
                    key={tx.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/15 transition-colors"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{
                                backgroundColor: (tx.category?.color ?? '#888') + '22',
                                border: `1px solid ${(tx.category?.color ?? '#888')}44`,
                            }}
                        >
                            {tx.category?.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{tx.title}</p>
                            <p className="text-xs text-white/30 font-mono mt-0.5">
                                {tx.account?.icon} {tx.account?.name} · {tx.date}
                            </p>
                        </div>
                    </div>
                    <p className={`text-sm font-bold font-mono shrink-0 ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'expense' ? '-' : '+'}
                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                    </p>
                </div>
            ))}
        </div>
    )
}
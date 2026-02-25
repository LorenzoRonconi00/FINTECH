import { Suspense } from 'react'
import { getUserSettings } from '@/lib/queries/settings'
import { getCurrentFinancialPeriod } from '@/lib/utils/financial-period'
import { getTransactionsByPeriod } from '@/lib/queries/transactions'
import { getActiveAccounts } from '@/lib/queries/accounts'
import { getCategories } from '@/lib/queries/categories'
import { CreateTransactionDialog } from '@/components/transactions/CreateTransactionDialog'

export default async function TransactionsPage() {
    const settings = await getUserSettings()
    const currentPeriod = getCurrentFinancialPeriod(
        settings.budget_start_day,
        settings.timezone
    )

    const [transactions, accounts, categories] = await Promise.all([
        getTransactionsByPeriod(currentPeriod),
        getActiveAccounts(),
        getCategories(),
    ])

    const confirmed = transactions.filter((t) => t.status === 'confirmed')
    const pending = transactions.filter((t) => t.status === 'pending')
    const skipped = transactions.filter((t) => t.status === 'skipped')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Transazioni</h1>
                    <p className="text-white/40 text-sm mt-1 font-mono">
                        Periodo {currentPeriod}
                    </p>
                </div>
                <CreateTransactionDialog accounts={accounts} categories={categories} />
            </div>

            {transactions.length === 0 && (
                <div className="text-center py-16 rounded-xl border border-white/10 border-dashed bg-white/2">
                    <p className="text-white/40 font-mono text-sm">Nessuna transazione</p>
                    <p className="text-white/25 font-mono text-xs mt-1">
                        Aggiungi una transazione manuale o genera le voci pending dalla dashboard
                    </p>
                </div>
            )}

            {pending.length > 0 && (
                <section>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                        In attesa <span className="ml-2 text-white/20">{pending.length}</span>
                    </h2>
                    <div className="space-y-2">
                        {pending.map((tx) => {
                            const category = tx.category as { name: string; icon: string; color: string } | null
                            const account = tx.account as { name: string; icon: string } | null
                            return (
                                <div key={tx.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 border-dashed bg-white/2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                                            style={{ backgroundColor: (category?.color ?? '#888') + '22', border: `1px solid ${(category?.color ?? '#888')}44` }}
                                        >
                                            {category?.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white/70 truncate">{tx.title}</p>
                                            <p className="text-xs text-white/30 font-mono mt-0.5">
                                                {account?.icon} {account?.name} · {tx.date}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold font-mono shrink-0 ${tx.type === 'income' ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                                        {tx.type === 'expense' ? '-' : '+'}
                                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {confirmed.length > 0 && (
                <section>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                        Confermate <span className="ml-2 text-white/20">{confirmed.length}</span>
                    </h2>
                    <div className="space-y-2">
                        {confirmed.map((tx) => {
                            const category = tx.category as { name: string; icon: string; color: string } | null
                            const account = tx.account as { name: string; icon: string } | null
                            return (
                                <div key={tx.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/15 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                                            style={{ backgroundColor: (category?.color ?? '#888') + '22', border: `1px solid ${(category?.color ?? '#888')}44` }}
                                        >
                                            {category?.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{tx.title}</p>
                                            <p className="text-xs text-white/30 font-mono mt-0.5">
                                                {account?.icon} {account?.name} · {tx.date}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold font-mono shrink-0 ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {tx.type === 'expense' ? '-' : '+'}
                                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {skipped.length > 0 && (
                <section>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                        Saltate <span className="ml-2 text-white/20">{skipped.length}</span>
                    </h2>
                    <div className="space-y-2 opacity-40">
                        {skipped.map((tx) => {
                            const category = tx.category as { name: string; icon: string; color: string } | null
                            const account = tx.account as { name: string; icon: string } | null
                            return (
                                <div key={tx.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-white/2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-white/5">
                                            {category?.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white/50 truncate line-through">{tx.title}</p>
                                            <p className="text-xs text-white/20 font-mono mt-0.5">
                                                {account?.icon} {account?.name} · {tx.date}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold font-mono shrink-0 text-white/20">
                                        {tx.type === 'expense' ? '-' : '+'}
                                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}
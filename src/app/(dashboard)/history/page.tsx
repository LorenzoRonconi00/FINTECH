import Link from 'next/link'
import { getUserSettings } from '@/lib/queries/settings'
import { getCurrentFinancialPeriod } from '@/lib/utils/financial-period'
import { getAllPeriodSummaries, getTransactionsByPeriodFiltered } from '@/lib/queries/transactions'
import { PeriodRow } from '@/components/history/PeriodRow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FinTech - Storico',
}

interface HistoryPageProps {
    searchParams: Promise<{ period?: string }>
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
    const params = await searchParams
    const settings = await getUserSettings()
    const currentPeriod = getCurrentFinancialPeriod(
        settings.budget_start_day,
        settings.timezone
    )

    const summaries = await getAllPeriodSummaries()

    const allSummaries = summaries.some((s) => s.period === currentPeriod)
        ? summaries
        : [{ period: currentPeriod, confirmedIncome: 0, confirmedExpense: 0, pendingIncome: 0, pendingExpense: 0, realBalance: 0, projectedBalance: 0 }, ...summaries]

    const selectedPeriod = params.period

    const periodTransactions = selectedPeriod
        ? await getTransactionsByPeriodFiltered(selectedPeriod, {})
        : null

    const selectedSummary = selectedPeriod
        ? allSummaries.find((s) => s.period === selectedPeriod)
        : null

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Storico</h1>
                <p className="text-white/40 text-sm mt-1 font-mono">
                    Riepilogo di tutti i periodi finanziari
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

                {/* Lista periodi */}
                <div className="space-y-2">
                    {allSummaries.length === 0 ? (
                        <div className="text-center py-8 rounded-xl border border-white/5 bg-white/1">
                            <p className="text-white/30 font-mono text-sm">Nessun periodo</p>
                        </div>
                    ) : (
                        allSummaries.map((s) => (
                            <PeriodRow
                                key={s.period}
                                period={s.period}
                                confirmedIncome={s.confirmedIncome}
                                confirmedExpense={s.confirmedExpense}
                                realBalance={s.realBalance}
                                projectedBalance={s.projectedBalance}
                                isActive={s.period === selectedPeriod}
                                currency={settings.default_currency}
                            />
                        ))
                    )}
                </div>

                {/* Dettaglio periodo */}
                <div>
                    {!selectedPeriod ? (
                        <div className="text-center py-16 rounded-xl border border-white/5 border-dashed bg-white/1">
                            <p className="text-white/30 font-mono text-sm">
                                Seleziona un periodo per vedere il dettaglio
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Link
                                href="/history"
                                className="lg:hidden inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 font-mono mb-2"
                            >
                                ← Torna alla lista
                            </Link>
                            {/* Intestazione dettaglio */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-white font-mono">
                                        {selectedPeriod}
                                        {selectedPeriod === currentPeriod && (
                                            <span className="ml-2 text-xs text-emerald-400/60 font-mono">corrente</span>
                                        )}
                                    </h2>
                                </div>
                                <Link
                                    href={`/transactions?period=${selectedPeriod}`}
                                    className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono"
                                >
                                    Vai alle transazioni →
                                </Link>
                            </div>

                            {/* Mini summary */}
                            {selectedSummary && (
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Entrate', value: selectedSummary.confirmedIncome, color: 'text-emerald-400' },
                                        { label: 'Uscite', value: selectedSummary.confirmedExpense, color: 'text-red-400' },
                                        { label: 'Saldo reale', value: selectedSummary.realBalance, color: selectedSummary.realBalance >= 0 ? 'text-white' : 'text-red-400' },
                                        { label: 'Proiettato', value: selectedSummary.projectedBalance, color: 'text-white/50' },
                                    ].map((card) => (
                                        <div key={card.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                            <p className="text-xs font-mono uppercase tracking-widest text-white/30">{card.label}</p>
                                            <p className={`text-base font-bold font-mono mt-1 ${card.color}`}>
                                                {new Intl.NumberFormat('it-IT', {
                                                    style: 'currency',
                                                    currency: settings.default_currency,
                                                }).format(card.value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Lista transazioni del periodo */}
                            {periodTransactions && (
                                <div className="space-y-2">
                                    {periodTransactions.length === 0 ? (
                                        <p className="text-white/30 font-mono text-sm text-center py-8">
                                            Nessuna transazione in questo periodo
                                        </p>
                                    ) : (
                                        periodTransactions.map((tx) => {
                                            const category = tx.category as { name: string; icon: string; color: string } | null
                                            const account = tx.account as { name: string; icon: string } | null
                                            return (
                                                <div
                                                    key={tx.id}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${tx.status === 'confirmed'
                                                            ? 'border-white/10 bg-white/5'
                                                            : tx.status === 'pending'
                                                                ? 'border-white/10 border-dashed bg-white/2'
                                                                : 'border-white/5 bg-white/1 opacity-40'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                                                            style={{
                                                                backgroundColor: (category?.color ?? '#888') + '22',
                                                                border: `1px solid ${(category?.color ?? '#888')}44`,
                                                            }}
                                                        >
                                                            {category?.icon}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className={`text-sm font-medium truncate ${tx.status === 'skipped' ? 'line-through text-white/40' : 'text-white'}`}>
                                                                {tx.title}
                                                            </p>
                                                            <p className="text-xs text-white/25 font-mono mt-0.5">
                                                                {account?.icon} {account?.name} · {tx.date}
                                                                {tx.status === 'pending' && <span className="ml-2 text-amber-400/60">pending</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm font-bold font-mono shrink-0 ${tx.status === 'skipped' ? 'text-white/20' :
                                                            tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                                                        }`}>
                                                        {tx.type === 'expense' ? '-' : '+'}
                                                        {new Intl.NumberFormat('it-IT', {
                                                            style: 'currency',
                                                            currency: settings.default_currency,
                                                        }).format(tx.amount)}
                                                    </p>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
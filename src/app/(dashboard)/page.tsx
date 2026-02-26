import { Suspense } from 'react'
import { getUserSettings } from '@/lib/queries/settings'
import { getCurrentFinancialPeriod } from '@/lib/utils/financial-period'
import { getAvailablePeriods, getPeriodSummary, getPendingTransactions, getTransactionsByPeriodFiltered } from '@/lib/queries/transactions'
import { getTransfersByPeriod } from '@/lib/queries/transfers'
import { AccountsStrip, AccountsStripSkeleton } from '@/components/accounts/AccountsStrip'
import { PendingGenerator } from '@/components/dashboard/PendingGenerator'
import { PeriodSummaryCards } from '@/components/dashboard/PeriodSummaryCards'
import { DashboardPendingList } from '@/components/dashboard/DashboardPendingList'
import { DashboardTransactionList } from '@/components/dashboard/DashboardTransactionList'
import { PeriodSelector } from '@/components/dashboard/PeriodSelector'
import type { Transaction, Transfer } from '@/types'
import type { Metadata } from 'next'

interface DashboardPageProps {
    searchParams: Promise<{ period?: string }>
}

export const metadata: Metadata = {
    title: 'FinTech - Dashboard',
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const params = await searchParams
    const settings = await getUserSettings()
    const currentPeriod = getCurrentFinancialPeriod(
        settings.budget_start_day,
        settings.timezone
    )
    const activePeriod = params.period ?? currentPeriod

    const [summary, pendingTransactions, allTransactions, transfers, periods] = await Promise.all([
        getPeriodSummary(activePeriod),
        getPendingTransactions(activePeriod),
        getTransactionsByPeriodFiltered(activePeriod, {}),
        getTransfersByPeriod(activePeriod),
        getAvailablePeriods(),
    ])

    const allPeriods = periods.includes(currentPeriod)
        ? periods
        : [currentPeriod, ...periods]

    const confirmedTransactions = allTransactions.filter((t) => t.status === 'confirmed')
    const pendingTransfers = transfers.filter((t) => t.status === 'pending')

    return (
        <div className="space-y-10">
            <PendingGenerator currentPeriod={currentPeriod} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-white/40 text-sm mt-1 font-mono">
                        Panoramica del tuo patrimonio finanziario
                    </p>
                </div>
                <Suspense>
                    <PeriodSelector
                        periods={allPeriods}
                        currentPeriod={currentPeriod}
                        activePeriod={activePeriod}
                    />
                </Suspense>
            </div>

            {/* Conti */}
            <section>
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
                    I tuoi conti
                </h2>
                <Suspense fallback={<AccountsStripSkeleton />}>
                    <AccountsStrip />
                </Suspense>
            </section>

            {/* Riepilogo periodo */}
            <section>
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
                    Riepilogo periodo
                </h2>
                <PeriodSummaryCards
                    confirmedIncome={summary.confirmedIncome}
                    confirmedExpense={summary.confirmedExpense}
                    realBalance={summary.realBalance}
                    projectedBalance={summary.projectedBalance}
                    currency={settings.default_currency}
                />
            </section>

            {/* Voci pending */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30">
                        In attesa
                        {(pendingTransactions.length + pendingTransfers.length) > 0 && (
                            <span className="ml-2 bg-amber-500/20 text-amber-400 text-xs font-mono px-1.5 py-0.5 rounded-full">
                                {pendingTransactions.length + pendingTransfers.length}
                            </span>
                        )}
                    </h2>
                </div>
                <DashboardPendingList
                    pendingTransactions={pendingTransactions.map((t) => ({
                        ...t,
                        account: t.account as { name: string; icon: string } | null,
                        category: t.category as { name: string; icon: string; color: string } | null,
                    }))}
                    pendingTransfers={pendingTransfers.map((t) => ({
                        ...t,
                        from_account: t.from_account as { name: string; icon: string } | null,
                        to_account: t.to_account as { name: string; icon: string } | null,
                    }))}
                    fullTransactions={allTransactions as Transaction[]}
                    fullTransfers={transfers as Transfer[]}
                />
            </section>

            {/* Transazioni confermate */}
            <section>
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
                    Transazioni confermate
                </h2>
                <DashboardTransactionList
                    transactions={confirmedTransactions.map((t) => ({
                        ...t,
                        account: t.account as { name: string; icon: string } | null,
                        category: t.category as { name: string; icon: string; color: string } | null,
                    }))}
                />
            </section>
        </div>
    )
}
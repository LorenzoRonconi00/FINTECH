import { Suspense } from 'react'
import { getUserSettings } from '@/lib/queries/settings'
import { getCurrentFinancialPeriod, getLastNPeriods } from '@/lib/utils/financial-period'
import { getExpensesByCategory, getIncomeByCategory, getBalanceTrend } from '@/lib/queries/statistics'
import { getActiveAccounts } from '@/lib/queries/accounts'
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters'
import { ExpensesPieChart } from '@/components/statistics/ExpensesPieChart'
import { ExpensesBarChart } from '@/components/statistics/ExpensesBarChart'
import { BalanceTrendChart } from '@/components/statistics/BalanceTrendChart'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Statistiche — FinTech',
}

interface StatisticsPageProps {
    searchParams: Promise<{
        range?: string
        account_id?: string
        transfers?: string
    }>
}

export default async function StatisticsPage({ searchParams }: StatisticsPageProps) {
    const params = await searchParams
    const settings = await getUserSettings()
    const currentPeriod = getCurrentFinancialPeriod(
        settings.budget_start_day,
        settings.timezone
    )

    const range = parseInt(params.range ?? '1', 10)
    const periods = getLastNPeriods(currentPeriod, range)
    const includeTransfers = params.transfers === '1'

    const [expensesByCategory, incomeByCategory, accounts, balanceTrend] = await Promise.all([
        getExpensesByCategory(periods, params.account_id, includeTransfers),
        getIncomeByCategory(periods, params.account_id, includeTransfers),
        getActiveAccounts(),
        getBalanceTrend(params.account_id),
    ])

    const totalExpenses = expensesByCategory.reduce((sum, c) => sum + c.total, 0)
    const totalIncome = incomeByCategory.reduce((sum, c) => sum + c.total, 0)

    const fmt = (n: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency: settings.default_currency }).format(n)

    const rangeLabel = range === 1
        ? `Periodo ${currentPeriod}`
        : `Ultimi ${range} periodi (${periods[periods.length - 1]} → ${periods[0]})`

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Statistiche</h1>
                <p className="text-white/40 text-sm mt-1 font-mono">{rangeLabel}</p>
            </div>

            <Suspense>
                <StatisticsFilters accounts={accounts} />
            </Suspense>

            {/* Uscite per categoria */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30">
                        Uscite per categoria
                    </h2>
                    <p className="text-sm font-bold font-mono text-red-400">{fmt(totalExpenses)}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <p className="text-xs font-mono uppercase tracking-widest text-white/25 mb-4">Torta</p>
                        <ExpensesPieChart
                            data={expensesByCategory}
                            currency={settings.default_currency}
                        />
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <p className="text-xs font-mono uppercase tracking-widest text-white/25 mb-4">Barre</p>
                        <ExpensesBarChart
                            data={expensesByCategory}
                            currency={settings.default_currency}
                        />
                    </div>
                </div>

                {/* Tabella dettaglio */}
                {expensesByCategory.length > 0 && (
                    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        {expensesByCategory.map((cat, i) => (
                            <div
                                key={cat.id}
                                className={`flex items-center justify-between px-4 py-3 ${i < expensesByCategory.length - 1 ? 'border-b border-white/5' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                                        style={{
                                            backgroundColor: cat.color + '22',
                                            border: `1px solid ${cat.color}44`,
                                        }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <p className="text-sm text-white">{cat.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${Math.round((cat.total / totalExpenses) * 100)}%`,
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-white/30 font-mono w-8 text-right">
                                        {Math.round((cat.total / totalExpenses) * 100)}%
                                    </p>
                                    <p className="text-sm font-bold font-mono text-red-400 w-28 text-right">
                                        -{fmt(cat.total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Entrate per categoria */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30">
                        Entrate per categoria
                    </h2>
                    <p className="text-sm font-bold font-mono text-emerald-400">{fmt(totalIncome)}</p>
                </div>

                {incomeByCategory.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border border-white/5 bg-white/1">
                        <p className="text-white/30 font-mono text-sm">Nessuna entrata nel periodo</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        {incomeByCategory.map((cat, i) => (
                            <div
                                key={cat.id}
                                className={`flex items-center justify-between px-4 py-3 ${i < incomeByCategory.length - 1 ? 'border-b border-white/5' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                                        style={{
                                            backgroundColor: cat.color + '22',
                                            border: `1px solid ${cat.color}44`,
                                        }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <p className="text-sm text-white">{cat.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${Math.round((cat.total / totalIncome) * 100)}%`,
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-white/30 font-mono w-8 text-right">
                                        {Math.round((cat.total / totalIncome) * 100)}%
                                    </p>
                                    <p className="text-sm font-bold font-mono text-emerald-400 w-28 text-right">
                                        +{fmt(cat.total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* Trend saldo */}
            <section className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/30">
                    Trend saldo nel tempo
                </h2>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <BalanceTrendChart
                        data={balanceTrend}
                        currency={settings.default_currency}
                    />
                </div>
            </section>
        </div>
    )
}
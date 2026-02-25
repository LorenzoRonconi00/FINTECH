import { Suspense } from 'react'
import { AccountsStrip, AccountsStripSkeleton } from '@/components/accounts/AccountsStrip'
import { PendingGenerator } from '@/components/dashboard/PendingGenerator'
import { getUserSettings } from '@/lib/queries/settings'
import { getCurrentFinancialPeriod } from '@/lib/utils/financial-period'

export default async function DashboardPage() {
    const settings = await getUserSettings()
    const currentPeriod = getCurrentFinancialPeriod(
        settings.budget_start_day,
        settings.timezone
    )

    return (
        <div className="space-y-8">
            <PendingGenerator currentPeriod={currentPeriod} />

            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-white/40 text-sm mt-1 font-mono">
                    Panoramica del tuo patrimonio finanziario
                </p>
            </div>

            <section>
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
                    I tuoi conti
                </h2>
                <Suspense fallback={<AccountsStripSkeleton />}>
                    <AccountsStrip />
                </Suspense>
            </section>
        </div>
    )
}
import { getUserSettings } from '@/lib/queries/settings'
import { getCurrentFinancialPeriod } from '@/lib/utils/financial-period'
import { getTransfers } from '@/lib/queries/transfers'
import { getActiveAccounts } from '@/lib/queries/accounts'
import { CreateTransferDialog } from '@/components/transfers/CreateTransferDialog'
import { ConfirmTransferDialog } from '@/components/transfers/ConfirmTransferDialog'
import { SkipTransferButton } from '@/components/transfers/SkipTransferButton'
import type { Transfer } from '@/types'

export default async function TransfersPage() {
    const settings = await getUserSettings()
    const currentPeriod = getCurrentFinancialPeriod(
        settings.budget_start_day,
        settings.timezone
    )

    const [transfers, accounts] = await Promise.all([
        getTransfers(),
        getActiveAccounts(),
    ])

    const pending = transfers.filter((t) => t.status === 'pending')
    const confirmed = transfers.filter((t) => t.status === 'confirmed')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Trasferimenti</h1>
                    <p className="text-white/40 text-sm mt-1 font-mono">
                        Movimenti tra i tuoi conti
                    </p>
                </div>
                <CreateTransferDialog accounts={accounts} />
            </div>

            {transfers.length === 0 && (
                <div className="text-center py-16 rounded-xl border border-white/10 border-dashed bg-white/2">
                    <p className="text-white/40 font-mono text-sm">Nessun trasferimento</p>
                    <p className="text-white/25 font-mono text-xs mt-1">
                        Crea un trasferimento tra i tuoi conti
                    </p>
                </div>
            )}

            {pending.length > 0 && (
                <section>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                        In attesa <span className="ml-2 text-white/20">{pending.length}</span>
                    </h2>
                    <div className="space-y-2">
                        {pending.map((transfer) => {
                            const fromAccount = transfer.from_account as { name: string; icon: string } | null
                            const toAccount = transfer.to_account as { name: string; icon: string } | null
                            return (
                                <div key={transfer.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 border-dashed bg-white/2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xl shrink-0">🔄</span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-medium text-white/70 truncate">
                                                    {fromAccount?.icon} {fromAccount?.name}
                                                </p>
                                                <span className="text-white/20 text-xs shrink-0">→</span>
                                                <p className="text-sm font-medium text-white/70 truncate">
                                                    {toAccount?.icon} {toAccount?.name}
                                                </p>
                                            </div>
                                            <p className="text-xs text-white/30 font-mono mt-0.5">
                                                {transfer.date} · periodo {transfer.financial_period}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <p className="text-sm font-bold font-mono text-blue-400/60 mr-2">
                                            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(transfer.amount)}
                                        </p>
                                        <SkipTransferButton id={transfer.id} />
                                        <ConfirmTransferDialog
                                            transfer={transfer as Transfer}
                                            fromAccountName={`${fromAccount?.icon ?? ''} ${fromAccount?.name ?? ''}`}
                                            toAccountName={`${toAccount?.icon ?? ''} ${toAccount?.name ?? ''}`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {confirmed.length > 0 && (
                <section>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                        Confermati <span className="ml-2 text-white/20">{confirmed.length}</span>
                    </h2>
                    <div className="space-y-2">
                        {confirmed.map((transfer) => {
                            const fromAccount = transfer.from_account as { name: string; icon: string } | null
                            const toAccount = transfer.to_account as { name: string; icon: string } | null
                            const isManual = !transfer.transfer_template_id
                            return (
                                <div key={transfer.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/15 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xl shrink-0">🔄</span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {fromAccount?.icon} {fromAccount?.name}
                                                </p>
                                                <span className="text-white/20 text-xs shrink-0">→</span>
                                                <p className="text-sm font-medium text-white truncate">
                                                    {toAccount?.icon} {toAccount?.name}
                                                </p>
                                            </div>
                                            <p className="text-xs text-white/30 font-mono mt-0.5">
                                                {transfer.date} · periodo {transfer.financial_period}
                                                {isManual && <span className="ml-2 text-white/20">manuale</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold font-mono text-blue-400 shrink-0">
                                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(transfer.amount)}
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
import { ConfirmTransactionDialog } from '@/components/transactions/ConfirmTransactionDialog'
import { SkipTransactionButton } from '@/components/transactions/SkipTransactionButton'
import { ConfirmTransferDialog } from '@/components/transfers/ConfirmTransferDialog'
import { SkipTransferButton } from '@/components/transfers/SkipTransferButton'
import type { Transaction, Transfer } from '@/types'

interface PendingTransaction {
    id: string
    title: string
    amount: number
    type: 'income' | 'expense'
    date: string
    account: { name: string; icon: string } | null
    category: { name: string; icon: string; color: string } | null
}

interface PendingTransfer {
    id: string
    amount: number
    date: string
    financial_period: string
    notes: string | null
    from_account: { name: string; icon: string } | null
    to_account: { name: string; icon: string } | null
}

interface DashboardPendingListProps {
    pendingTransactions: PendingTransaction[]
    pendingTransfers: PendingTransfer[]
    fullTransactions: Transaction[]
    fullTransfers: Transfer[]
}

export function DashboardPendingList({
    pendingTransactions,
    pendingTransfers,
    fullTransactions,
    fullTransfers,
}: DashboardPendingListProps) {
    const total = pendingTransactions.length + pendingTransfers.length

    if (total === 0) {
        return (
            <div className="text-center py-8 rounded-xl border border-white/5 bg-white/1">
                <p className="text-white/30 font-mono text-sm">Nessuna voce in attesa</p>
                <p className="text-white/20 font-mono text-xs mt-1">
                    Tutte le voci del periodo sono state gestite
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {pendingTransactions.map((tx) => (
                <div
                    key={tx.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 border-dashed bg-white/2"
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
                            <p className="text-sm font-medium text-white/70 truncate">{tx.title}</p>
                            <p className="text-xs text-white/30 font-mono mt-0.5">
                                {tx.account?.icon} {tx.account?.name} · {tx.date}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <p className={`text-sm font-bold font-mono mr-2 ${tx.type === 'income' ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                            {tx.type === 'expense' ? '-' : '+'}
                            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                        </p>
                        <SkipTransactionButton id={tx.id} />
                        <ConfirmTransactionDialog
                            transaction={fullTransactions.find((t) => t.id === tx.id)!}
                        />
                    </div>
                </div>
            ))}

            {pendingTransfers.map((transfer) => (
                <div
                    key={transfer.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 border-dashed bg-white/2"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">🔄</span>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium text-white/70 truncate">
                                    {transfer.from_account?.icon} {transfer.from_account?.name}
                                </p>
                                <span className="text-white/20 text-xs shrink-0">→</span>
                                <p className="text-sm font-medium text-white/70 truncate">
                                    {transfer.to_account?.icon} {transfer.to_account?.name}
                                </p>
                            </div>
                            <p className="text-xs text-white/30 font-mono mt-0.5">{transfer.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <p className="text-sm font-bold font-mono text-blue-400/60 mr-2">
                            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(transfer.amount)}
                        </p>
                        <SkipTransferButton id={transfer.id} />
                        <ConfirmTransferDialog
                            transfer={fullTransfers.find((t) => t.id === transfer.id)!}
                            fromAccountName={`${transfer.from_account?.icon ?? ''} ${transfer.from_account?.name ?? ''}`}
                            toAccountName={`${transfer.to_account?.icon ?? ''} ${transfer.to_account?.name ?? ''}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
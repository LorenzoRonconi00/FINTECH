import { ACCOUNT_TYPE_LABELS, type Account } from '@/types'
import { getCurrentBalance } from '@/lib/queries/accounts'
import { EditAccountDialog } from './EditAccountDialog'

interface AccountCardProps {
    account: Account
}

export async function AccountCard({ account }: AccountCardProps) {
    const balance = await getCurrentBalance(account.id)

    const formatted = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: account.currency,
    }).format(balance)

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4 hover:border-white/20 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: account.color + '22', border: `1px solid ${account.color}44` }}
                    >
                        {account.icon}
                    </div>
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: account.color }}
                    />
                </div>
                <EditAccountDialog account={account} />
            </div>
            <div>
                <p className="font-semibold text-white">{account.name}</p>
                {account.bank_name && (
                    <p className="text-xs text-white/40 font-mono mt-0.5">{account.bank_name}</p>
                )}
                <p className="text-xs text-white/30 font-mono uppercase tracking-widest mt-1">
                    {ACCOUNT_TYPE_LABELS[account.account_type]}
                </p>
            </div>
            <p className="text-xl font-bold text-emerald-400 font-mono">{formatted}</p>
        </div>
    )
}
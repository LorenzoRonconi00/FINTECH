import { Suspense } from 'react'
import { getActiveAccounts } from '@/lib/queries/accounts'
import { AccountCard } from './AccountCard'
import { AccountCardSkeleton } from './AccountCardSkeleton'
import { CreateAccountDialog } from './CreateAccountDialog'

export async function AccountsStrip() {
    const accounts = await getActiveAccounts()

    if (accounts.length === 0) {
        return (
            <div className="flex items-center justify-between rounded-xl border border-white/10 border-dashed bg-white/2 px-6 py-5">
                <div>
                    <p className="text-sm font-medium text-white/60">Nessun conto attivo</p>
                    <p className="text-xs text-white/30 font-mono mt-0.5">
                        Crea il tuo primo conto per iniziare a tracciare le finanze
                    </p>
                </div>
                <CreateAccountDialog />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:overflow-x-auto gap-4 pb-1">
            {accounts.map((account) => (
                <div key={account.id} className="lg:min-w-55 lg:shrink-0">
                    <Suspense fallback={<AccountCardSkeleton />}>
                        <AccountCard account={account} />
                    </Suspense>
                </div>
            ))}
            <div className="min-w-13 shrink-0 flex items-center justify-center">
                <CreateAccountDialog compact />
            </div>
        </div>
    )
}

export function AccountsStripSkeleton() {
    return (
        <div className="flex gap-4 overflow-x-auto pb-1">
            {Array.from({ length: 3 }).map((_, i) => (
                <AccountCardSkeleton key={i} />
            ))}
        </div>
    )
}
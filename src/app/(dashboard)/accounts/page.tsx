import { Suspense } from 'react'
import { getAccounts } from '@/lib/queries/accounts'
import { AccountCard } from '@/components/accounts/AccountCard'
import { CreateAccountDialog } from '@/components/accounts/CreateAccountDialog'

export default async function AccountsPage() {
    const accounts = await getAccounts()
    const active = accounts.filter((a) => a.is_active)
    const archived = accounts.filter((a) => !a.is_active)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Conti</h1>
                    <p className="text-white/40 text-sm mt-1 font-mono">
                        Gestisci i tuoi conti bancari e portafogli
                    </p>
                </div>
                <CreateAccountDialog />
            </div>

            {active.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                    <p className="text-lg">Nessun conto</p>
                    <p className="text-sm mt-1 font-mono">Crea il tuo primo conto per iniziare</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {active.map((account) => (
                        <Suspense
                            key={account.id}
                            fallback={<div className="rounded-lg border bg-card p-4 h-32 animate-pulse" />}
                        >
                            <AccountCard account={account} />
                        </Suspense>
                    ))}
                </div>
            )}

            {archived.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-white/20 uppercase tracking-widest font-mono">
                        Archiviati
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
                        {archived.map((account) => (
                            <Suspense
                                key={account.id}
                                fallback={<div className="rounded-lg border bg-card p-4 h-32 animate-pulse" />}
                            >
                                <AccountCard account={account} />
                            </Suspense>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
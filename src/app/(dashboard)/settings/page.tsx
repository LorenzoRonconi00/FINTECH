import Link from 'next/link'
import { getUserSettings } from '@/lib/queries/settings'
import { SettingsForm } from '@/components/settings/SettingsForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FinTech - Impostazioni',
}

export default async function SettingsPage() {
    const settings = await getUserSettings()

    return (
        <div className="space-y-10 max-w-xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Impostazioni</h1>
                <p className="text-white/40 text-sm mt-1 font-mono">
                    Configura il tuo profilo finanziario
                </p>
            </div>

            {/* Impostazioni generali */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-white">Generali</h2>
                    <p className="text-xs text-white/30 font-mono mt-0.5">
                        Periodo finanziario, valuta e fuso orario
                    </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <SettingsForm settings={settings} />
                </div>
            </section>

            {/* Avviso budget_start_day */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/3 px-4 py-3">
                <p className="text-xs text-amber-400/70 font-mono leading-relaxed">
                    Modificare il giorno di inizio periodo cambia come vengono calcolati i periodi futuri.
                    I periodi già registrati non vengono ricalcolati automaticamente.
                </p>
            </div>

            {/* Link categorie */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-sm font-semibold text-white">Categorie</h2>
                    <p className="text-xs text-white/30 font-mono mt-0.5">
                        Gestisci le categorie per le transazioni
                    </p>
                </div>
                <Link
                    href="/settings/categories"
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors"
                >
                    <span className="text-sm text-white">Gestisci categorie</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/30">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </section>
        </div>
    )
}
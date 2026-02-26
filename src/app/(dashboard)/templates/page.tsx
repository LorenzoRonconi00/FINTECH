import { getRecurringTemplates, getTransferTemplates } from '@/lib/queries/templates'
import { getActiveAccounts } from '@/lib/queries/accounts'
import { getCategories } from '@/lib/queries/categories'
import { CreateRecurringTemplateDialog } from '@/components/templates/CreateRecurringTemplateDialog'
import { EditRecurringTemplateDialog } from '@/components/templates/EditRecurringTemplateDialog'
import { ToggleTemplateButton } from '@/components/templates/ToggleTemplateButton'
import { CreateTransferTemplateDialog } from '@/components/templates/CreateTransferTemplateDialog'
import { EditTransferTemplateDialog } from '@/components/templates/EditTransferTemplateDialog'
import { TRANSACTION_TYPE_LABELS, TransferTemplate } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FinTech - Template',
}

export default async function TemplatesPage() {
    const [templates, transferTemplates, accounts, categories] = await Promise.all([
        getRecurringTemplates(),
        getTransferTemplates(),
        getActiveAccounts(),
        getCategories(),
    ])

    const income = templates.filter((t) => t.type === 'income')
    const expense = templates.filter((t) => t.type === 'expense')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Template</h1>
                    <p className="text-white/40 text-sm mt-1 font-mono">
                        Gestisci le voci ricorrenti mensili
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <CreateTransferTemplateDialog accounts={accounts} />
                    <CreateRecurringTemplateDialog accounts={accounts} categories={categories} />
                </div>
            </div>

            {templates.length === 0 && (
                <div className="text-center py-16 rounded-xl border border-white/10 border-dashed bg-white/2">
                    <p className="text-white/40 font-mono text-sm">Nessun template</p>
                    <p className="text-white/25 font-mono text-xs mt-1">
                        Crea il primo template per generare automaticamente le voci mensili
                    </p>
                </div>
            )}

            {([['income', income], ['expense', expense]] as const).map(([type, list]) =>
                list.length > 0 ? (
                    <section key={type}>
                        <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                            {TRANSACTION_TYPE_LABELS[type]}
                        </h2>
                        <div className="space-y-2">
                            {list.map((template) => {
                                const account = template.account as { name: string; color: string; icon: string } | null
                                const category = template.category as { name: string; icon: string } | null

                                return (
                                    <div
                                        key={template.id}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${template.is_active
                                            ? 'border-white/10 bg-white/5 hover:border-white/15'
                                            : 'border-white/5 bg-white/2 opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-xl shrink-0">{template.emoji ?? '💰'}</span>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {template.title}
                                                    </p>
                                                    {template.amount_is_variable && (
                                                        <span className="text-xs text-white/30 font-mono shrink-0">
                                                            variabile
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/30 font-mono mt-0.5">
                                                    {category?.icon} {category?.name}
                                                    {' · '}
                                                    {account?.icon} {account?.name}
                                                    {' · '}
                                                    giorno {template.scheduled_day}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            <p className={`text-sm font-bold font-mono ${type === 'income' ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {type === 'expense' ? '-' : '+'}
                                                {new Intl.NumberFormat('it-IT', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                }).format(template.amount)}
                                            </p>
                                            <ToggleTemplateButton
                                                id={template.id}
                                                isActive={template.is_active}
                                                type="recurring"
                                            />
                                            <EditRecurringTemplateDialog
                                                template={template}
                                                accounts={accounts}
                                                categories={categories}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                ) : null
            )}
            <section>
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                    Trasferimenti
                </h2>

                {transferTemplates.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border border-white/10 border-dashed bg-white/2">
                        <p className="text-white/40 font-mono text-sm">Nessun template di trasferimento</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {transferTemplates.map((template) => {
                            const fromAccount = template.from_account as { name: string; icon: string } | null
                            const toAccount = template.to_account as { name: string; icon: string } | null

                            return (
                                <div
                                    key={template.id}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${template.is_active
                                            ? 'border-white/10 bg-white/5 hover:border-white/15'
                                            : 'border-white/5 bg-white/2 opacity-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xl shrink-0">{template.emoji ?? '🔄'}</span>
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
                                                giorno {template.scheduled_day}
                                                {template.amount_is_variable && ' · variabile'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <p className="text-sm font-bold font-mono text-blue-400">
                                            {new Intl.NumberFormat('it-IT', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            }).format(template.amount)}
                                        </p>
                                        <ToggleTemplateButton
                                            id={template.id}
                                            isActive={template.is_active}
                                            type="transfer"
                                        />
                                        <EditTransferTemplateDialog
                                            template={template as TransferTemplate}
                                            accounts={accounts}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
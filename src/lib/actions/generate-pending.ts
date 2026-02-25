'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isTemplateActiveForPeriod } from '@/lib/utils/financial-period'

export async function generatePendingForPeriod(period: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('budget_start_day, default_currency')
        .eq('user_id', user.id)
        .single()

    if (settingsError) return { error: settingsError.message }

    const { data: recurringTemplates, error: rtError } = await supabase
        .from('recurring_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

    if (rtError) return { error: rtError.message }

    const { data: transferTemplates, error: ttError } = await supabase
        .from('transfer_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

    if (ttError) return { error: ttError.message }

    const { data: transferCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('type', 'transfer')
        .single()

    const periodYear = parseInt(period.slice(0, 4), 10)
    const periodMonth = parseInt(period.slice(5, 7), 10)

    const { data: existingTx } = await supabase
        .from('transactions')
        .select('recurring_template_id')
        .eq('user_id', user.id)
        .eq('financial_period', period)
        .not('recurring_template_id', 'is', null)

    const alreadyGeneratedTx = new Set(existingTx?.map((t) => t.recurring_template_id) ?? [])

    const transactionsToInsert = (recurringTemplates ?? [])
        .filter((t) => isTemplateActiveForPeriod(t, period))
        .filter((t) => !alreadyGeneratedTx.has(t.id))
        .map((t) => ({
            user_id: user.id,
            account_id: t.account_id,
            title: t.title,
            amount: t.amount,
            type: t.type,
            category_id: t.category_id,
            date: buildDate(periodYear, periodMonth, t.scheduled_day),
            status: 'pending' as const,
            financial_period: period,
            recurring_template_id: t.id,
            notes: t.notes,
        }))

    if (transactionsToInsert.length > 0) {
        const { error: insertTxError } = await supabase
            .from('transactions')
            .insert(transactionsToInsert)

        if (insertTxError) return { error: insertTxError.message }
    }

    const { data: existingTr } = await supabase
        .from('transfers')
        .select('transfer_template_id')
        .eq('user_id', user.id)
        .eq('financial_period', period)
        .not('transfer_template_id', 'is', null)

    const alreadyGeneratedTr = new Set(existingTr?.map((t) => t.transfer_template_id) ?? [])

    const transfersToInsert = (transferTemplates ?? [])
        .filter((t) => isTemplateActiveForPeriod(t, period))
        .filter((t) => !alreadyGeneratedTr.has(t.id))
        .map((t) => ({
            user_id: user.id,
            from_account_id: t.from_account_id,
            to_account_id: t.to_account_id,
            amount: t.amount,
            date: buildDate(periodYear, periodMonth, t.scheduled_day),
            status: 'pending' as const,
            financial_period: period,
            transfer_template_id: t.id,
            notes: t.notes,
        }))

    if (transfersToInsert.length > 0) {
        const { error: insertTrError } = await supabase
            .from('transfers')
            .insert(transfersToInsert)

        if (insertTrError) return { error: insertTrError.message }
    }

    revalidatePath('/')
    return {
        success: true,
        generated: {
            transactions: transactionsToInsert.length,
            transfers: transfersToInsert.length,
        },
    }
}

function buildDate(year: number, month: number, scheduledDay: number): string {
    const lastDay = new Date(year, month, 0).getDate()
    const day = Math.min(scheduledDay, lastDay)
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
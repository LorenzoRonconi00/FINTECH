'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getFinancialPeriodForDate } from '@/lib/utils/financial-period'
import { getUserSettings } from '@/lib/queries/settings'
import type { TransactionFormValues } from '@/lib/validators/transaction'

export async function createTransaction(data: TransactionFormValues) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const settings = await getUserSettings()
    const date = new Date(data.date)
    const financialPeriod = getFinancialPeriodForDate(date, settings.budget_start_day)

    const { error } = await supabase
        .from('transactions')
        .insert({
            user_id: user.id,
            account_id: data.account_id,
            title: data.title,
            amount: data.amount,
            type: data.type,
            category_id: data.category_id,
            date: data.date,
            status: 'confirmed',
            financial_period: financialPeriod,
            notes: data.notes || null,
        })

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true }
}

export async function confirmTransaction(
    id: string,
    data: { date: string; amount: number; notes?: string }
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('transactions')
        .update({
            status: 'confirmed',
            date: data.date,
            amount: data.amount,
            notes: data.notes || null,
        })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true }
}

export async function skipTransaction(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('transactions')
        .update({ status: 'skipped' })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true }
}
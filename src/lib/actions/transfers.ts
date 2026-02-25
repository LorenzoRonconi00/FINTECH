'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getFinancialPeriodForDate } from '@/lib/utils/financial-period'
import { getUserSettings } from '@/lib/queries/settings'
import type { TransferFormValues } from '@/lib/validators/transfer'

export async function createTransfer(data: TransferFormValues) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const settings = await getUserSettings()
    const date = new Date(data.date)
    const financialPeriod = getFinancialPeriodForDate(date, settings.budget_start_day)

    const { data: transferCategory, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('type', 'transfer')
        .single()

    if (catError || !transferCategory) {
        return { error: 'Categoria trasferimento non trovata. Controlla le categorie di sistema.' }
    }

    const { data: transfer, error: transferError } = await supabase
        .from('transfers')
        .insert({
            user_id: user.id,
            from_account_id: data.from_account_id,
            to_account_id: data.to_account_id,
            amount: data.amount,
            date: data.date,
            status: 'confirmed',
            financial_period: financialPeriod,
            notes: data.notes || null,
        })
        .select('id')
        .single()

    if (transferError) return { error: transferError.message }

    const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .insert([
            {
                user_id: user.id,
                account_id: data.from_account_id,
                title: 'Trasferimento in uscita',
                amount: data.amount,
                type: 'expense' as const,
                category_id: transferCategory.id,
                date: data.date,
                status: 'confirmed' as const,
                financial_period: financialPeriod,
                transfer_id: transfer.id,
                notes: data.notes || null,
            },
            {
                user_id: user.id,
                account_id: data.to_account_id,
                title: 'Trasferimento in entrata',
                amount: data.amount,
                type: 'income' as const,
                category_id: transferCategory.id,
                date: data.date,
                status: 'confirmed' as const,
                financial_period: financialPeriod,
                transfer_id: transfer.id,
                notes: data.notes || null,
            },
        ])
        .select('id')

    if (txError) {
        await supabase.from('transfers').delete().eq('id', transfer.id)
        return { error: txError.message }
    }

    const fromTx = transactions?.[0]
    const toTx = transactions?.[1]

    if (!fromTx || !toTx) {
        await supabase.from('transfers').delete().eq('id', transfer.id)
        return { error: 'Errore nella creazione delle transazioni' }
    }

    await supabase
        .from('transfers')
        .update({
            from_transaction_id: fromTx.id,
            to_transaction_id: toTx.id,
        })
        .eq('id', transfer.id)

    revalidatePath('/')
    revalidatePath('/transfers')
    revalidatePath('/transactions')
    return { success: true }
}

export async function deleteTransfer(id: string) {
    const supabase = await createClient()

    const { error: txError } = await supabase
        .from('transactions')
        .delete()
        .eq('transfer_id', id)

    if (txError) return { error: txError.message }

    const { error } = await supabase
        .from('transfers')
        .delete()
        .eq('id', id)
        .is('transfer_template_id', null)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/transfers')
    revalidatePath('/transactions')
    return { success: true }
}

export async function confirmTransfer(
    id: string,
    data: { date: string; amount: number; notes?: string }
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data: transfer, error: fetchError } = await supabase
        .from('transfers')
        .select('from_account_id, to_account_id, financial_period')
        .eq('id', id)
        .single()

    if (fetchError || !transfer) return { error: 'Trasferimento non trovato' }

    const { data: transferCategory, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('type', 'transfer')
        .single()

    if (catError || !transferCategory) {
        return { error: 'Categoria trasferimento non trovata.' }
    }

    const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .insert([
            {
                user_id: user.id,
                account_id: transfer.from_account_id,
                title: 'Trasferimento in uscita',
                amount: data.amount,
                type: 'expense' as const,
                category_id: transferCategory.id,
                date: data.date,
                status: 'confirmed' as const,
                financial_period: transfer.financial_period,
                transfer_id: id,
                notes: data.notes || null,
            },
            {
                user_id: user.id,
                account_id: transfer.to_account_id,
                title: 'Trasferimento in entrata',
                amount: data.amount,
                type: 'income' as const,
                category_id: transferCategory.id,
                date: data.date,
                status: 'confirmed' as const,
                financial_period: transfer.financial_period,
                transfer_id: id,
                notes: data.notes || null,
            },
        ])
        .select('id')

    if (txError) return { error: txError.message }

    const fromTx = transactions?.[0]
    const toTx = transactions?.[1]

    if (!fromTx || !toTx) {
        return { error: 'Errore nella creazione delle transazioni' }
    }

    const { error: updateError } = await supabase
        .from('transfers')
        .update({
            status: 'confirmed',
            date: data.date,
            amount: data.amount,
            notes: data.notes || null,
            from_transaction_id: fromTx.id,
            to_transaction_id: toTx.id,
        })
        .eq('id', id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/')
    revalidatePath('/transfers')
    revalidatePath('/transactions')
    return { success: true }
}

export async function skipTransfer(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('transfers')
        .update({ status: 'skipped' })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/transfers')
    return { success: true }
}
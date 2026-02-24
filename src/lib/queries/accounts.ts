import { createClient } from '@/lib/supabase/server'

export async function getAccounts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

export async function getActiveAccounts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

export async function getAccountById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getCurrentBalance(accountId: string): Promise<number> {
    const supabase = await createClient()

    const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('balance_initial')
        .eq('id', accountId)
        .single()

    if (accountError) throw accountError

    const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('account_id', accountId)
        .eq('status', 'confirmed')

    if (txError) throw txError

    const delta = transactions.reduce((acc, tx) => {
        return tx.type === 'income' ? acc + Number(tx.amount) : acc - Number(tx.amount)
    }, 0)

    return Number(account.balance_initial) + delta
}
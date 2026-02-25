import { createClient } from '@/lib/supabase/server'

export async function getTransactionsByPeriod(period: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            account:accounts(id, name, color, icon),
            category:categories(id, name, color, icon)
        `)
        .eq('financial_period', period)
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

export async function getTransactionsByPeriodFiltered(
    period: string,
    filters: {
        status?: "pending" | "confirmed" | "skipped"
        type?: "income" | "expense"
        account_id?: string
    }
) {
    const supabase = await createClient()

    let query = supabase
        .from('transactions')
        .select(`
            *,
            account:accounts(id, name, color, icon),
            category:categories(id, name, color, icon)
        `)
        .eq('financial_period', period)

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.type) query = query.eq('type', filters.type)
    if (filters.account_id) query = query.eq('account_id', filters.account_id)

    const { data, error } = await query.order('date', { ascending: false })

    if (error) throw error
    return data
}

export async function getAvailablePeriods() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select('financial_period')
        .order('financial_period', { ascending: false })

    if (error) throw error

    const periods = [...new Set(data.map((t) => t.financial_period))]
    return periods
}

export async function getPeriodSummary(period: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, status')
        .eq('financial_period', period)

    if (error) throw error

    const confirmedIncome = data
        .filter((t) => t.status === 'confirmed' && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const confirmedExpense = data
        .filter((t) => t.status === 'confirmed' && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const pendingIncome = data
        .filter((t) => t.status === 'pending' && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const pendingExpense = data
        .filter((t) => t.status === 'pending' && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
        confirmedIncome,
        confirmedExpense,
        realBalance: confirmedIncome - confirmedExpense,
        projectedBalance: (confirmedIncome + pendingIncome) - (confirmedExpense + pendingExpense),
    }
}

export async function getPendingTransactions(period: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            account:accounts(id, name, color, icon),
            category:categories(id, name, color, icon)
        `)
        .eq('financial_period', period)
        .eq('status', 'pending')
        .order('date', { ascending: true })

    if (error) throw error
    return data
}
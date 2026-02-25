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

export async function getAllPeriodSummaries() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, status, financial_period')
        .in('status', ['confirmed', 'pending'])
        .order('financial_period', { ascending: false })

    if (error) throw error

    const periodsMap = new Map<string, {
        confirmedIncome: number
        confirmedExpense: number
        pendingIncome: number
        pendingExpense: number
    }>()

    for (const tx of data) {
        const period = tx.financial_period
        if (!periodsMap.has(period)) {
            periodsMap.set(period, {
                confirmedIncome: 0,
                confirmedExpense: 0,
                pendingIncome: 0,
                pendingExpense: 0,
            })
        }
        const entry = periodsMap.get(period)!
        const amount = Number(tx.amount)

        if (tx.status === 'confirmed') {
            if (tx.type === 'income') entry.confirmedIncome += amount
            else entry.confirmedExpense += amount
        } else if (tx.status === 'pending') {
            if (tx.type === 'income') entry.pendingIncome += amount
            else entry.pendingExpense += amount
        }
    }

    return Array.from(periodsMap.entries()).map(([period, data]) => ({
        period,
        ...data,
        realBalance: data.confirmedIncome - data.confirmedExpense,
        projectedBalance: (data.confirmedIncome + data.pendingIncome) - (data.confirmedExpense + data.pendingExpense),
    }))
}
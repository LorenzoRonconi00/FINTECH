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

    // deduplication
    const periods = [...new Set(data.map((t) => t.financial_period))]
    return periods
}
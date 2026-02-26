import { createClient } from '@/lib/supabase/server'

export async function getExpensesByCategory(
    periods: string[],
    accountId?: string,
    includeTransfers?: boolean
) {
    const supabase = await createClient()

    let query = supabase
        .from('transactions')
        .select(`
            amount,
            category:categories(id, name, color, icon)
        `)
        .in('financial_period', periods)
        .eq('type', 'expense')
        .eq('status', 'confirmed')

    if (accountId) query = query.eq('account_id', accountId)
    if (!includeTransfers) query = query.is('transfer_id', null)

    const { data, error } = await query

    if (error) throw error

    const map = new Map<string, {
        id: string
        name: string
        color: string
        icon: string
        total: number
    }>()

    for (const tx of data) {
        const cat = tx.category as { id: string; name: string; color: string; icon: string } | null
        if (!cat) continue
        const existing = map.get(cat.id)
        if (existing) {
            existing.total += Number(tx.amount)
        } else {
            map.set(cat.id, { ...cat, total: Number(tx.amount) })
        }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export async function getIncomeByCategory(
    periods: string[],
    accountId?: string,
    includeTransfers?: boolean
) {
    const supabase = await createClient()

    let query = supabase
        .from('transactions')
        .select(`
            amount,
            category:categories(id, name, color, icon)
        `)
        .in('financial_period', periods)
        .eq('type', 'income')
        .eq('status', 'confirmed')

    if (accountId) query = query.eq('account_id', accountId)
    if (!includeTransfers) query = query.is('transfer_id', null)

    const { data, error } = await query

    if (error) throw error

    const map = new Map<string, {
        id: string
        name: string
        color: string
        icon: string
        total: number
    }>()

    for (const tx of data) {
        const cat = tx.category as { id: string; name: string; color: string; icon: string } | null
        if (!cat) continue
        const existing = map.get(cat.id)
        if (existing) {
            existing.total += Number(tx.amount)
        } else {
            map.set(cat.id, { ...cat, total: Number(tx.amount) })
        }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export async function getBalanceTrend(accountId?: string) {
    const supabase = await createClient()

    let accountsQuery = supabase
        .from('accounts')
        .select('id, name, color, balance_initial')
        .eq('is_active', true)

    if (accountId) accountsQuery = accountsQuery.eq('id', accountId)

    const { data: accounts, error: accError } = await accountsQuery
    if (accError) throw accError

    let txQuery = supabase
        .from('transactions')
        .select('amount, type, financial_period, account_id')
        .eq('status', 'confirmed')
        .order('financial_period', { ascending: true })

    if (accountId) txQuery = txQuery.eq('account_id', accountId)

    const { data: transactions, error: txError } = await txQuery
    if (txError) throw txError

    const periods = [...new Set(transactions.map((t) => t.financial_period))].sort()

    if (periods.length === 0) return []

    const totalInitial = accounts.reduce((sum, a) => sum + Number(a.balance_initial), 0)

    const trend = periods.map((period) => {
        const txUpToPeriod = transactions.filter((t) => t.financial_period <= period)
        const delta = txUpToPeriod.reduce((sum, t) => {
            return t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount)
        }, 0)
        return {
            period,
            balance: totalInitial + delta,
        }
    })

    return trend
}
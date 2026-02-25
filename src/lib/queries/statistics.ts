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

    // Raggruppa per categoria
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
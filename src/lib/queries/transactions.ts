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
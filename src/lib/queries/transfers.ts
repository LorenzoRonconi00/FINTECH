import { createClient } from '@/lib/supabase/server'

export async function getTransfers() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transfers')
        .select(`
            *,
            from_account:accounts!transfers_from_account_id_fkey(id, name, color, icon),
            to_account:accounts!transfers_to_account_id_fkey(id, name, color, icon)
        `)
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

export async function getTransfersByPeriod(period: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transfers')
        .select(`
            *,
            from_account:accounts!transfers_from_account_id_fkey(id, name, color, icon),
            to_account:accounts!transfers_to_account_id_fkey(id, name, color, icon)
        `)
        .eq('financial_period', period)
        .order('date', { ascending: false })

    if (error) throw error
    return data
}
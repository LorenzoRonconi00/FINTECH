import { createClient } from '@/lib/supabase/server'

export async function getRecurringTemplates() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('recurring_templates')
        .select(`
            *,
            account:accounts(id, name, color, icon),
            category:categories(id, name, color, icon)
        `)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getTransferTemplates() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transfer_templates')
        .select(`
            *,
            from_account:accounts!transfer_templates_from_account_id_fkey(id, name, color, icon),
            to_account:accounts!transfer_templates_to_account_id_fkey(id, name, color, icon)
        `)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}
import { createClient } from '@/lib/supabase/server'

export async function getUserSettings() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

    if (error) throw error

    if (!data) {
        const { data: created, error: createError } = await supabase
            .from('user_settings')
            .insert({
                user_id: user.id,
                budget_start_day: 1,
                default_currency: 'EUR',
                timezone: 'Europe/Rome',
            })
            .select()
            .single()

        if (createError) throw createError
        return created
    }

    return data
}
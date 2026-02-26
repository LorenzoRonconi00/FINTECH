'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateUserSettings(data: {
    budget_start_day: number
    default_currency: string
    timezone: string
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { error } = await supabase
        .from('user_settings')
        .update(data)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/settings')
    return { success: true }
}
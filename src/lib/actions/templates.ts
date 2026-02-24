'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { RecurringTemplateInsert, RecurringTemplateUpdate } from '@/types'

export async function createRecurringTemplate(
    data: Omit<RecurringTemplateInsert, 'user_id'>
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { error } = await supabase
        .from('recurring_templates')
        .insert({ ...data, user_id: user.id })

    if (error) return { error: error.message }

    revalidatePath('/templates')
    return { success: true }
}

export async function updateRecurringTemplate(
    id: string,
    data: RecurringTemplateUpdate
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('recurring_templates')
        .update(data)
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/templates')
    return { success: true }
}

export async function toggleRecurringTemplate(id: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('recurring_templates')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/templates')
    return { success: true }
}

export async function deleteRecurringTemplate(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('recurring_templates')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/templates')
    return { success: true }
}
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { AccountInsert, AccountUpdate } from '@/types'

export async function createAccount(data: Omit<AccountInsert, 'user_id'>) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { error } = await supabase
        .from('accounts')
        .insert({ ...data, user_id: user.id })

    if (error) return { error: error.message }

    revalidatePath('/accounts')
    revalidatePath('/')
    return { success: true }
}

export async function updateAccount(id: string, data: AccountUpdate) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('accounts')
        .update(data)
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/accounts')
    revalidatePath('/')
    return { success: true }
}

export async function archiveAccount(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('accounts')
        .update({ is_active: false })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/accounts')
    revalidatePath('/')
    return { success: true }
}

export async function restoreAccount(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('accounts')
        .update({ is_active: true })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/accounts')
    revalidatePath('/')
    return { success: true }
}
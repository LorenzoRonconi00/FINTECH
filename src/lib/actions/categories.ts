'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CategoryInsert, CategoryUpdate } from '@/types'

export async function createCategory(data: Omit<CategoryInsert, 'user_id' | 'is_default'>) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { error } = await supabase
        .from('categories')
        .insert({ ...data, user_id: user.id, is_default: false })

    if (error) return { error: error.message }

    revalidatePath('/settings/categories')
    return { success: true }
}

export async function updateCategory(id: string, data: CategoryUpdate) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .eq('is_default', false)

    if (error) return { error: error.message }

    revalidatePath('/settings/categories')
    return { success: true }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id)

    if ((count ?? 0) > 0) {
        return { error: `Categoria usata da ${count} transazioni. Riassegna prima le transazioni.` }
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('is_default', false)

    if (error) return { error: error.message }

    revalidatePath('/settings/categories')
    return { success: true }
}
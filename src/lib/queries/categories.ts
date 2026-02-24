import { createClient } from '@/lib/supabase/server'

export async function getCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

export async function getCategoriesInUse(categoryId: string): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

    if (error) throw error
    return count ?? 0
}
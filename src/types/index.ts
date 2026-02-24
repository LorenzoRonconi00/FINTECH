import type { Database } from './database.types'

export type Account = Database['public']['Tables']['accounts']['Row']
export type AccountInsert = Database['public']['Tables']['accounts']['Insert']
export type AccountUpdate = Database['public']['Tables']['accounts']['Update']

export type AccountType = Database['public']['Enums']['account_type']

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
    checking: 'Conto corrente',
    savings: 'Conto risparmio',
    cash: 'Contanti',
    investment: 'Investimenti',
    other: 'Altro',
}

export const ACCOUNT_COLORS = [
    '#6366f1', '#3b82f6', '#22c55e', '#f97316',
    '#ef4444', '#a855f7', '#eab308', '#14b8a6',
]
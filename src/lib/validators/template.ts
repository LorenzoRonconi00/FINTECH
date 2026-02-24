import { z } from 'zod'

const YYYY_MM = /^\d{4}-(0[1-9]|1[0-2])$/

export const recurringTemplateSchema = z.object({
    title: z.string().min(1, 'Il titolo è obbligatorio'),
    amount: z.coerce.number().min(0.01, 'L\'importo deve essere maggiore di 0'),
    amount_is_variable: z.boolean(),
    type: z.enum(['income', 'expense']),
    account_id: z.string().uuid('Seleziona un conto'),
    category_id: z.string().uuid('Seleziona una categoria'),
    scheduled_day: z.coerce
        .number()
        .min(1, 'Giorno minimo 1')
        .max(28, 'Giorno massimo 28'),
    start_month: z
        .string()
        .regex(YYYY_MM, 'Formato YYYY-MM richiesto'),
    end_month: z
        .string()
        .regex(YYYY_MM, 'Formato YYYY-MM richiesto')
        .optional()
        .or(z.literal('')),
    notes: z.string().optional(),
    emoji: z.string().optional(),
})

export type RecurringTemplateFormValues = z.infer<typeof recurringTemplateSchema>

export const transferTemplateSchema = z.object({
    from_account_id: z.string().uuid('Seleziona il conto di origine'),
    to_account_id: z.string().uuid('Seleziona il conto di destinazione'),
    amount: z.coerce.number().min(0.01, "L'importo deve essere maggiore di 0"),
    amount_is_variable: z.boolean(),
    scheduled_day: z.coerce.number().min(1, 'Giorno minimo 1').max(28, 'Giorno massimo 28'),
    start_month: z.string().regex(YYYY_MM, 'Formato YYYY-MM richiesto'),
    end_month: z
        .string()
        .regex(YYYY_MM, 'Formato YYYY-MM richiesto')
        .optional()
        .or(z.literal('')),
    notes: z.string().optional(),
    emoji: z.string().optional(),
}).refine((data) => data.from_account_id !== data.to_account_id, {
    message: 'Il conto di origine e destinazione devono essere diversi',
    path: ['to_account_id'],
})

export type TransferTemplateFormValues = z.infer<typeof transferTemplateSchema>
import { z } from 'zod'

export const transactionSchema = z.object({
    title: z.string().min(1, 'Il titolo è obbligatorio'),
    amount: z.coerce.number().min(0.01, "L'importo deve essere maggiore di 0"),
    type: z.enum(['income', 'expense']),
    account_id: z.string().uuid('Seleziona un conto'),
    category_id: z.string().uuid('Seleziona una categoria'),
    date: z.string().min(1, 'La data è obbligatoria'),
    notes: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
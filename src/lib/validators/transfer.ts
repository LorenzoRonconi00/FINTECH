import { z } from 'zod'

export const transferSchema = z.object({
    from_account_id: z.string().uuid('Seleziona il conto di origine'),
    to_account_id: z.string().uuid('Seleziona il conto di destinazione'),
    amount: z.coerce.number().min(0.01, "L'importo deve essere maggiore di 0"),
    date: z.string().min(1, 'La data è obbligatoria'),
    notes: z.string().optional(),
}).refine((data) => data.from_account_id !== data.to_account_id, {
    message: 'Il conto di origine e destinazione devono essere diversi',
    path: ['to_account_id'],
})

export type TransferFormValues = z.infer<typeof transferSchema>
import { z } from 'zod'

export const accountSchema = z.object({
    name: z.string().min(1, 'Il nome è obbligatorio'),
    bank_name: z.string().optional(),
    account_type: z.enum(['checking', 'savings', 'cash', 'investment', 'other']),
    balance_initial: z.coerce.number(),
    currency: z.string().min(1),
    color: z.string().min(1),
    icon: z.string().min(1),
})

export type AccountFormValues = z.infer<typeof accountSchema>
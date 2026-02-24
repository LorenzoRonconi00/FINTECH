import { z } from 'zod'

export const categorySchema = z.object({
    name: z.string().min(1, 'Il nome è obbligatorio').max(50),
    type: z.enum(['income', 'expense', 'transfer']),
    color: z.string().min(1, 'Il colore è obbligatorio'),
    icon: z.string().min(1, 'L\'icona è obbligatoria'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
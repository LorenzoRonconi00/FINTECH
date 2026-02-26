import { z } from 'zod'

export const userSettingsSchema = z.object({
    budget_start_day: z.coerce
        .number()
        .min(1, 'Giorno minimo 1')
        .max(28, 'Giorno massimo 28'),
    default_currency: z.string().min(1, 'La valuta è obbligatoria').max(3),
    timezone: z.string().min(1, 'Il fuso orario è obbligatorio'),
})

export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>
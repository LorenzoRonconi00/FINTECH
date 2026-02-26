'use client'

import { useTransition } from 'react'
import { toggleRecurringTemplate, toggleTransferTemplate } from '@/lib/actions/templates'
import { toast } from 'sonner'

interface ToggleTemplateButtonProps {
    id: string
    isActive: boolean
    type: 'recurring' | 'transfer'
}

export function ToggleTemplateButton({ id, isActive, type }: ToggleTemplateButtonProps) {
    const [isPending, startTransition] = useTransition()

    function handleToggle() {
        startTransition(async () => {
            if (type === 'recurring') {
                await toggleRecurringTemplate(id, !isActive)
                toast(isActive ? 'Template disattivato' : 'Template attivato')
            } else {
                await toggleTransferTemplate(id, !isActive)
                toast(isActive ? 'Template disattivato' : 'Template attivato')
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`relative w-10 h-5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 ${isActive ? 'bg-emerald-500' : 'bg-white/10'
                }`}
            aria-label={isActive ? 'Disattiva template' : 'Attiva template'}
        >
            <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${isActive ? 'left-5' : 'left-0.5'
                    }`}
            />
        </button>
    )
}
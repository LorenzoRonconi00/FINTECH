'use client'

import { useTransition } from 'react'
import { toggleRecurringTemplate } from '@/lib/actions/templates'

interface ToggleTemplateButtonProps {
    id: string
    isActive: boolean
}

export function ToggleTemplateButton({ id, isActive }: ToggleTemplateButtonProps) {
    const [isPending, startTransition] = useTransition()

    function handleToggle() {
        startTransition(async () => {
            await toggleRecurringTemplate(id, !isActive)
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
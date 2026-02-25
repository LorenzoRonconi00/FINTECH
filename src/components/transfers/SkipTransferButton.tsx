'use client'

import { useTransition } from 'react'
import { skipTransfer } from '@/lib/actions/transfers'

interface SkipTransferButtonProps {
    id: string
}

export function SkipTransferButton({ id }: SkipTransferButtonProps) {
    const [isPending, startTransition] = useTransition()

    function handleSkip() {
        startTransition(async () => {
            await skipTransfer(id)
        })
    }

    return (
        <button
            onClick={handleSkip}
            disabled={isPending}
            className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 disabled:opacity-50"
        >
            Salta
        </button>
    )
}
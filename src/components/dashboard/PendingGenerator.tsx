'use client'

import { useEffect, useState } from 'react'
import { generatePendingForPeriod } from '@/lib/actions/generate-pending'

interface PendingGeneratorProps {
    currentPeriod: string
}

export function PendingGenerator({ currentPeriod }: PendingGeneratorProps) {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        generatePendingForPeriod(currentPeriod).then((result) => {
            if (result?.error) setError(result.error)
        })
    }, [currentPeriod])

    if (!error) return null

    return (
        <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            Errore nella generazione delle voci pending: {error}
        </p>
    )
}
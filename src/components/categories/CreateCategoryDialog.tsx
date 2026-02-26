'use client'

import { useState } from 'react'
import { createCategory } from '@/lib/actions/categories'
import { CategoryForm } from './CategoryForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { CategoryFormValues } from '@/lib/validators/category'
import { toast } from 'sonner'

export function CreateCategoryDialog() {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: CategoryFormValues) {
        setError(null)
        const result = await createCategory(data)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setOpen(false)
        toast.success('Categoria creata')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer tracking-wide">
                    Nuova categoria
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Nuova categoria</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <CategoryForm onSubmit={handleSubmit} submitLabel="Crea categoria" />
            </DialogContent>
        </Dialog>
    )
}
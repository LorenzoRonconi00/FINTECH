'use client'

import { useState } from 'react'
import { updateCategory, deleteCategory } from '@/lib/actions/categories'
import { CategoryForm } from './CategoryForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Category } from '@/types'
import type { CategoryFormValues } from '@/lib/validators/category'
import { toast } from 'sonner'

interface EditCategoryDialogProps {
    category: Category
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(data: CategoryFormValues) {
        setError(null)
        const result = await updateCategory(category.id, data)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setOpen(false)
        toast.success('Categoria aggiornata')
    }

    async function handleDelete() {
        const result = await deleteCategory(category.id)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            return
        }
        setOpen(false)
        toast.success('Categoria eliminata')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono cursor-pointer">
                    Modifica
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1420] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Modifica categoria</DialogTitle>
                </DialogHeader>
                {error && (
                    <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                <CategoryForm
                    defaultValues={{
                        name: category.name,
                        type: category.type,
                        color: category.color,
                        icon: category.icon,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Salva modifiche"
                />
                <div className="pt-2 border-t border-white/5">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors font-mono cursor-pointer">
                                Elimina categoria
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#0d1420] border-white/10 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Eliminare la categoria?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/40 font-mono text-xs">
                                    La categoria <span className="text-white/70">{category.name}</span> verrà eliminata permanentemente.
                                    Se è usata da transazioni esistenti, l'operazione verrà bloccata.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                                    Annulla
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-400 text-white"
                                >
                                    Elimina
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    )
}
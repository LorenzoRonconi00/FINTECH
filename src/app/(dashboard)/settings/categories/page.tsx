import { getCategories } from '@/lib/queries/categories'
import { CreateCategoryDialog } from '@/components/categories/CreateCategoryDialog'
import { EditCategoryDialog } from '@/components/categories/EditCategoryDialog'
import { CATEGORY_TYPE_LABELS, type CategoryType } from '@/types'

export default async function CategoriesPage() {
    const categories = await getCategories()

    const grouped = {
        income: categories.filter((c) => c.type === 'income'),
        expense: categories.filter((c) => c.type === 'expense'),
    } as Record<CategoryType, typeof categories>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categorie</h1>
                    <p className="text-white/40 text-sm mt-1 font-mono">
                        Gestisci le categorie per le tue transazioni
                    </p>
                </div>
                <CreateCategoryDialog />
            </div>

            {(['income', 'expense'] as const).map((type) => (
                <section key={type}>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                        {CATEGORY_TYPE_LABELS[type]}
                    </h2>
                    <div className="space-y-2">
                        {grouped[type]?.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/15 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                                        style={{
                                            backgroundColor: category.color + '22',
                                            border: `1px solid ${category.color}44`,
                                        }}
                                    >
                                        {category.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{category.name}</p>
                                        {category.is_default && (
                                            <p className="text-xs text-white/25 font-mono">Default</p>
                                        )}
                                    </div>
                                </div>
                                {!category.is_default && (
                                    <EditCategoryDialog category={category} />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
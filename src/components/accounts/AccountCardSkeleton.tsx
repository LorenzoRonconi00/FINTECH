export function AccountCardSkeleton() {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4 min-w-55">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 animate-pulse" />
                </div>
                <div className="w-6 h-6 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="space-y-1.5">
                <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="h-6 w-28 rounded bg-white/5 animate-pulse" />
        </div>
    )
}
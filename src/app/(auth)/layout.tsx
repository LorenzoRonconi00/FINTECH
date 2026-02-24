export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#080c14]">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)
          `,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Glow top-left */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
            {/* Glow bottom-right */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />

            {/* Brand mark top-left */}
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">F</span>
                </div>
                <span className="text-sm font-medium text-white/60 tracking-widest uppercase font-mono">
                    FinTech
                </span>
            </div>

            <div className="relative w-full max-w-sm px-4">
                {children}
            </div>
        </div>
    )
}
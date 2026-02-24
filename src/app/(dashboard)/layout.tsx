import Link from 'next/link'
import { logout } from '@/lib/actions/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#080c14]">
            <div
                className="fixed inset-0 opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)
          `,
                    backgroundSize: '48px 48px',
                }}
            />
            <header className="relative border-b border-white/5 bg-[#080c14]/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto flex h-14 items-center justify-between px-6">
                    <nav className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">F</span>
                            </div>
                            <span className="text-sm font-medium text-white/60 tracking-widest uppercase font-mono">
                                FinTech
                            </span>
                        </div>
                        <Link href="/" className="text-sm text-white/40 hover:text-white/80 transition-colors font-mono">
                            Dashboard
                        </Link>
                        <Link href="/accounts" className="text-sm text-white/40 hover:text-white/80 transition-colors font-mono">
                            Conti
                        </Link>
                    </nav>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer font-mono uppercase tracking-widest"
                        >
                            Esci
                        </button>
                    </form>
                </div>
            </header>
            <main className="relative container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}
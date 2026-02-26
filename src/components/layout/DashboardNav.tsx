'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
    { href: '/', label: 'Dashboard', icon: '◈' },
    { href: '/accounts', label: 'Conti', icon: '◉' },
    { href: '/transactions', label: 'Transazioni', icon: '↕' },
    { href: '/transfers', label: 'Trasferimenti', icon: '⇄' },
    { href: '/templates', label: 'Template', icon: '◫' },
    { href: '/history', label: 'Storico', icon: '◷' },
    { href: '/statistics', label: 'Statistiche', icon: '◱' },
    { href: '/settings', label: 'Impostazioni', icon: '◎' },
]

const BOTTOM_NAV_LINKS = [
    { href: '/', label: 'Home', icon: '◈' },
    { href: '/transactions', label: 'Transazioni', icon: '↕' },
    { href: '/transfers', label: 'Trasferimenti', icon: '⇄' },
    { href: '/history', label: 'Storico', icon: '◷' },
    { href: '/settings', label: 'Impostazioni', icon: '◎' },
]

interface NavLinkProps {
    href: string
    isActive: boolean
    className: string
    children: React.ReactNode
}

function NavLink({ href, isActive, className, children }: NavLinkProps) {

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    )
}

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 mr-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">F</span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-white/60 tracking-widest uppercase font-mono">
                    FinTech
                </span>
            </div>
            {NAV_LINKS.map((link) => {
                const isActive = link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                    <NavLink
                        key={link.href}
                        href={link.href}
                        isActive={isActive}
                        className={`hidden lg:block text-sm transition-colors font-mono ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                            }`}
                    >
                        {link.label}
                    </NavLink>
                )
            })}
        </nav>
    )
}

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#080c14]/95 backdrop-blur-sm border-t border-white/5">
            <div className="flex items-center justify-around px-2 py-2 pb-safe">
                {BOTTOM_NAV_LINKS.map((link) => {
                    const isActive = link.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(link.href)
                    return (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            isActive={isActive}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-14 ${isActive
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-white/30 hover:text-white/60'
                                }`}
                        >
                            <span className="text-base leading-none">{link.icon}</span>
                            <span className="text-[10px] font-mono leading-none">{link.label}</span>
                        </NavLink>
                    )
                })}
            </div>
        </nav>
    )
}
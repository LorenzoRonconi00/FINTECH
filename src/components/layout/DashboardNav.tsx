'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
    { href: '/', label: 'Dashboard' },
    { href: '/accounts', label: 'Conti' },
    { href: '/transactions', label: 'Transazioni' },
    { href: '/transfers', label: 'Trasferimenti' },
    { href: '/templates', label: 'Template' },
    { href: '/history', label: 'Storico' },
    { href: '/statistics', label: 'Statistiche' },
    { href: '/settings', label: 'Impostazioni' },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center gap-6">
            <div className="flex items-center gap-2 mr-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">F</span>
                </div>
                <span className="text-sm font-medium text-white/60 tracking-widest uppercase font-mono">
                    FinTech
                </span>
            </div>
            {NAV_LINKS.map((link) => {
                const isActive = link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm transition-colors font-mono ${isActive
                                ? 'text-white'
                                : 'text-white/40 hover:text-white/80'
                            }`}
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}
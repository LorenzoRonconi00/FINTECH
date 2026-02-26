'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'
import NProgress from 'nprogress'

export function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        NProgress.start()
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
            NProgress.done()
            return
        }

        router.refresh()
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nome@esempio.it"
                    required
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 font-mono"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-widest font-mono">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 font-mono"
                />
            </div>

            {error && (
                <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/40 text-white font-semibold text-sm py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed mt-2 tracking-wide"
            >
                {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>

            <p className="text-center text-xs text-white/30 font-mono">
                Non hai un account?{' '}
                <Link
                    href="/register"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                    Registrati
                </Link>
            </p>
        </form>
    )
}
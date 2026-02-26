import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
    title: 'Fintech - Dashboard',
    description: 'Personal Finance Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it">
            <body className="antialiased">
                <NextTopLoader
                    color="#10b981"
                    height={2}
                    showSpinner={false}
                    shadow="0 0 10px #10b981, 0 0 5px #10b981"
                />
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#0d1420',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '13px',
                        },
                    }}
                />
            </body>
        </html>
    )
}
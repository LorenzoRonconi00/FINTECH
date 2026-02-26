import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
    title: 'Finance Dashboard',
    description: 'Gestione finanze personali',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it">
            <body className="antialiased">
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
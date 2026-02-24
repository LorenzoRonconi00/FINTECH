import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Bentornato
                </h1>
                <p className="text-sm text-white/40 font-mono">
                    Accedi al tuo pannello finanziario
                </p>
            </div>
            <LoginForm />
        </div>
    )
}
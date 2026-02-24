import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Crea account
                </h1>
                <p className="text-sm text-white/40 font-mono">
                    Inizia a gestire le tue finanze
                </p>
            </div>
            <RegisterForm />
        </div>
    )
}
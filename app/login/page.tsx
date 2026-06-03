'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'



export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const supabase = createClient()
    const router = useRouter()
    const [error, setError] = useState('')


    async function handleSignIn() {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(error.message)
        } else {
            router.push('/dashboard')
        }
    }
    return (
        <div className="flex h-screen items-center justify-center">
            <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '28px', marginBottom: '6px', color: '#1A1A1A' }}>
                    Welcome back.
                </h1>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Sign in to your Kindrasa account.
                </p>
                <div className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#F5F0E8', width: '100%' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#F5F0E8', width: '100%' }}
                    />
                    <button
                        onClick={handleSignIn}
                        style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '4px' }}
                    >
                        Sign in
                    </button>
                    {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
                    <p style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>
                        Don't have an account? <a href="/signup" style={{ color: '#2C4A2E', fontWeight: 500 }}>Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [teamName, setTeamName] = useState('')
    const [error, setError] = useState('')
    const supabase = createClient()
    const router = useRouter()

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    team_name: teamName,
                },
            },
        })
        if (error) {
            setError(error.message)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '28px', marginBottom: '6px', color: '#1A1A1A' }}>
                    Create your account.
                </h1>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Get started with your free account.
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#F5F0E8', width: '100%' }}
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#F5F0E8', width: '100%' }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#F5F0E8', width: '100%' }}
                    />
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#F5F0E8', width: '100%' }}
                    />
                    <button
                        onClick={handleSignUp}
                        style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '4px' }}
                    >
                        Sign up
                    </button>
                    {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}

                </div>
            </div>
        </div>

    )
}
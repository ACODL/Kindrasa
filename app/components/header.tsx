'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'


export default function Header() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [agentId, setAgentId] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [gmailConnected, setGmailConnected] = useState(false)
    const [connectedEmail, setConnectedEmail] = useState('')

    // fetch the current user once when the header mounts
    useEffect(() => {
        async function loadUser() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email ?? '')
                setAgentId(user.id)
            }
        }
        loadUser()
    }, [])

    useEffect(() => {
        async function loadStatus() {
            const res = await fetch('/api/email-status')
            const data = await res.json()
            if (data.connected) {
                setGmailConnected(true)
                setConnectedEmail(data.email_address)
            }
        }
        loadStatus()
    }, [])

    // close the dropdown when clicking outside it
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleConnectGmail = () => {
        // full-page redirect to FastAPI's OAuth start endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/auth/google/start?agent_id=${agentId}`
    }

    // the agent's initials for the avatar
    const initials = userEmail ? userEmail[0].toUpperCase() : '?'

    return (
        <header style={{ backgroundColor: '#2C4A2E' }} className="px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard">
                <span style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8', fontSize: '20px', letterSpacing: '0.02em' }}>
                    Kindrasa
                </span>
            </Link>

            <nav className="flex gap-6">
                <Link href="/dashboard" className="nav-link text-sm tracking-wide">Dashboard</Link>
                <Link href="/dashboard/listings" className="nav-link text-sm tracking-wide">Listings</Link>
            </nav>

            {/* profile dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: '#e8f0e9', color: '#2C4A2E',
                        border: 'none', cursor: 'pointer',
                        fontSize: '14px', fontWeight: 500,
                    }}
                >
                    {initials}
                </button>

                {isOpen && (
                    <div style={{
                        position: 'absolute', right: 0, top: '44px',
                        background: '#fff', border: '0.5px solid #ddd8ce',
                        borderRadius: '10px', padding: '8px',
                        minWidth: '220px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        zIndex: 50,
                    }}>
                        <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #ddd8ce', marginBottom: '4px' }}>
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Signed in as</p>
                            <p style={{ fontSize: '13px', color: '#1A1A1A', margin: '2px 0 0', fontWeight: 500 }}>{userEmail}</p>
                        </div>

                        {gmailConnected ? (
                            <div style={{ padding: '8px 12px', fontSize: '13px', color: '#065f46' }}>
                                ✓ Gmail connected
                                <p style={{ fontSize: '11px', color: '#6B7280', margin: '2px 0 0' }}>{connectedEmail}</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectGmail}
                                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#1A1A1A', borderRadius: '6px' }}
                            >
                                Connect Gmail
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#B43E3E', borderRadius: '6px' }}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
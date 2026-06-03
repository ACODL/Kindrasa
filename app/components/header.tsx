'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
    const router = useRouter()
    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }
    return (
        <header style={{ backgroundColor: '#2C4A2E' }} className="px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard">
                <span style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8', fontSize: '20px', fontWeight: 400, letterSpacing: '0.02em' }}>
                    Kindrasa
                </span>

            </Link>
            <nav className="flex gap-6">
                <Link href="/dashboard" style={{ color: '#b5c9b6', fontSize: '13px', letterSpacing: '0.04em' }} className="hover:text-white transition-colors">
                    Dashboard
                </Link>
                <Link href="/dashboard/listings" style={{ color: '#b5c9b6', fontSize: '13px', letterSpacing: '0.04em' }} className="hover:text-white transition-colors">
                    <span>Listings</span>
                </Link>
            </nav>
            <button className="px-4 py-2 rounded-md bg-transparent hover:text-white transition-colors" onClick={handleLogout} style={{ border: '0.5px solid #4a6e4c', color: '#b5c9b6', fontSize: '12px', letterSpacing: '0.04em' }} >
                logout
            </button>
        </header>
    )
}
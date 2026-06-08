'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GmailConnectedBanner() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (searchParams.get('gmail') === 'connected') {
            setShow(true)
            // clean the ?gmail=connected out of the URL so it doesn't persist on refresh
            router.replace('/dashboard')
            // auto-hide after a few seconds
            const timer = setTimeout(() => setShow(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [searchParams, router])

    if (!show) return null

    return (
        <div style={{
            background: '#d1fae5', color: '#065f46',
            border: '0.5px solid #6ee7b7', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '20px',
            fontSize: '14px',
        }}>
            ✓ Gmail connected successfully. You can now send emails from your account.
        </div>
    )
}
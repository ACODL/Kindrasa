'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DraftButton({ leadId }: { leadId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleDraft() {
        setIsLoading(true)
        setError('')
        try {
            const response = await fetch('/api/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_id: leadId }),
            })
            if (!response.ok) {
                throw new Error('Failed to generate draft')
            }
            router.refresh()
        } catch (err) {
            setError('Could not generate draft. Try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handleDraft}
                disabled={isLoading}
                style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}
            >
                {isLoading ? 'Drafting...' : '✨ Draft follow-up'}
            </button>
            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        </div>
    )
}
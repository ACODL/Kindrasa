'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"


export default function DraftCard({ draft }: { draft: any }) {
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()
    const [error, setError] = useState('')
    const [status, setStatus] = useState('')
    const router = useRouter()



    async function handleAction(newStatus: string) {
        setIsSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('ai_drafts').update({
            status: newStatus
        }).eq('draft_id', draft.draft_id).eq('agent_id', user?.id)
        if (error) {
            setError(error.message)
        } else {
            router.refresh()
        }
        setIsSaving(false)

    }
    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '16px 18px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500, background: '#e8f0e9', color: '#2C4A2E' }}>
                    ✨ AI draft
                </span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{draft.channel}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#1A1A1A', margin: '0 0 14px' }}>{draft.message_content}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => handleAction('approved')}
                    disabled={isSaving}
                    style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                >
                    {isSaving ? 'Saving...' : 'Approve'}
                </button>
                <button
                    onClick={() => handleAction('rejected')}
                    disabled={isSaving}
                    style={{ background: '#B43E3E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                >
                    Reject
                </button>
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        </div>
    )
}

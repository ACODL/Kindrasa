'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DraftCard({ draft }: { draft: any }) {
    const supabase = createClient()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [subject, setSubject] = useState(draft.subject ?? '')
    const [body, setBody] = useState(draft.message_content ?? '')
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState('')

    async function handleSend() {
        setIsSending(true)
        setError('')
        try {
            const res = await fetch('/api/send-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft_id: draft.draft_id, subject, body }),
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Failed to send')
            }
            setIsOpen(false)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSending(false)
        }
    }

    async function handleReject() {
        await supabase.from('ai_drafts').update({ status: 'rejected' }).eq('draft_id', draft.draft_id)
        router.refresh()
    }

    const inputStyle = { border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%' }

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '16px 18px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500, background: '#e8f0e9', color: '#2C4A2E' }}>
                    ✨ AI draft
                </span>
                {draft.subject && <span style={{ fontSize: '12px', color: '#6B7280' }}>{draft.subject}</span>}
            </div>
            <p style={{ fontSize: '14px', color: '#1A1A1A', margin: '0 0 14px' }}>{draft.message_content}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                    Review & send
                </button>
                <button
                    onClick={handleReject}
                    style={{ background: '#B43E3E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                    Reject
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)', zIndex: 50 }}>
                    <div style={{ background: '#F5F0E8', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '520px', border: '0.5px solid #ddd8ce' }}>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', marginBottom: '20px', color: '#1A1A1A' }}>
                            Review & send
                        </h2>
                        <div className="flex flex-col gap-3">
                            <input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Subject"
                                style={inputStyle}
                            />
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={8}
                                placeholder="Message"
                                style={{ ...inputStyle, resize: 'none' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isSending}
                                style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px', fontSize: '14px', border: 'none', cursor: 'pointer', opacity: isSending ? 0.5 : 1, width: '100%' }}
                            >
                                {isSending ? 'Sending...' : 'Send email'}
                            </button>
                            {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ color: '#6B7280', fontSize: '12px', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AddActivityForm({ leadId }: { leadId: string }) {
    const [content, setContent] = useState('')
    const [type, setType] = useState('call')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoading(true)
        const { error } = await supabase.from('lead_activities').insert({
            performing_agent: user?.id,
            lead_id: leadId,
            content: content,
            type: type,
        })
        setIsLoading(false)
        if (error) {
            setError(error.message)
        } else {
            router.refresh()
            setContent('')
            setType('call')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '16px', marginBottom: '14px', color: '#1A1A1A' }}>
                Log activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', cursor: 'pointer' }}
                >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="note">Note</option>
                    <option value="text">Text</option>
                </select>
                <textarea
                    placeholder="What happened?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', resize: 'none', width: '100%' }}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}
                >
                    {isLoading ? 'Logging...' : 'Log activity'}
                </button>
                {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
            </div>
        </form>
    )
}
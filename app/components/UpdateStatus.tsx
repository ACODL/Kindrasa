'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"


export default function UpdatePipelineStage({ listing }: { listing: any }) {
    const [status, setStatus] = useState(listing.status)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleStatusChange(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('listings').update({
            status: status
        }).eq('listing_id', listing.listing_id).eq('agent_id', user?.id)
        if (error) {
            setError(error.message)
        } else {
            router.refresh()
        }
        setIsLoading(false)
    }
    return (
        <div>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '16px', marginBottom: '14px', color: '#1A1A1A' }}>
                Update status
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', cursor: 'pointer' }}
                >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                </select>
                <button
                    onClick={handleStatusChange}
                    disabled={isLoading}
                    style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}
                >
                    {isLoading ? 'Updating...' : 'Update'}
                </button>
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        </div>
    )
}   
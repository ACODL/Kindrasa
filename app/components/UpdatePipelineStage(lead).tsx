'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"


export default function UpdatePipelineStage({ lead }: { lead: any }) {
    const [pipelineStage, setPipelineStage] = useState(lead.pipeline_stage)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()
    const [error, setError] = useState('')
    const router = useRouter()

    async function handlePipelineStageChange(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('leads').update({
            pipeline_stage: pipelineStage
        }).eq('lead_id', lead.lead_id).eq('agent_id', user?.id)
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
                Update pipeline stage
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                    value={pipelineStage}
                    onChange={(e) => setPipelineStage(e.target.value)}
                    style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', cursor: 'pointer' }}
                >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                </select>
                <button
                    onClick={handlePipelineStageChange}
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
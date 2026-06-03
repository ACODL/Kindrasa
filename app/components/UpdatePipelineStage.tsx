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
            <h3 className="text-lg font-bold mb-2">Update Pipeline Stage</h3>
            <select
                value={pipelineStage}
                onChange={(e) => setPipelineStage(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
            </select>
            <button onClick={handlePipelineStageChange} disabled={isLoading} className="bg-blue-500 text-white p-2 rounded disabled:opacity-50">
                {isLoading ? 'Updating...' : 'Update'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}   
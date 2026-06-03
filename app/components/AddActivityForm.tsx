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
        <form onSubmit={handleSubmit} className="mt-4">
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="note">Note</option>
                <option value="text">Text</option>
            </select>
            <textarea
                placeholder="Activity description"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded mt-2 disabled:opacity-50">
                {isLoading ? 'Adding...' : 'Add Activity'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    )
}
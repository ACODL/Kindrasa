'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddListingForm() {
    const supabase = createClient()
    const [address, setAddress] = useState('')
    const [pipelineStage, setPipelineStage] = useState('prospecting')
    const [price, setPrice] = useState('')
    const [error, setError] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState('')




    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('listings').insert({
            agent_id: user?.id,
            address: address,
            price: parseFloat(price),
            status: status,
            pipeline_stage: pipelineStage
        })
        if (error) {
            setError(error.message)
        } else {
            setAddress('')
            setPrice('')
            setStatus('')
            setPipelineStage('')
            setError('')
            router.refresh()
            setIsOpen(false)
        }
        setIsLoading(false)
    }

    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="bg-green-500 text-white p-2 rounded">
                Add Listing
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Add New Listing</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                            </select>
                            <select value={pipelineStage} onChange={(e) => setPipelineStage(e.target.value)}>
                                <option value="prospecting">Prospecting</option>
                                <option value="listed">Listed</option>
                                <option value="under_contract">Under Contract</option>
                                <option value="closed">Closed</option>
                            </select>

                            <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded disabled:opacity-50">
                                {isLoading ? 'Adding...' : 'Add Listing'}
                            </button>
                            {error && <p className="text-red-500">{error}</p>}
                        </form>
                        <button onClick={() => setIsOpen(false)} className="mt-4 bg-gray-500 text-white p-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

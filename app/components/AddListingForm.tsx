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
    const [status, setStatus] = useState('active')
    const [isHovered, setIsHovered] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!address.trim()) {
            setError('Address is required')
            return
        }
        if (!price) {
            setError('Price is required')
            return
        }

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
            setStatus('active')
            setPipelineStage('prospecting')
            setError('')
            router.refresh()
            setIsOpen(false)
        }
        setIsLoading(false)
    }

    const inputStyle = { border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%' }

    return (
        <>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .modal-overlay { animation: fadeIn 0.2s ease; }
                .modal-card { animation: slideUp 0.25s ease; }
            `}</style>
            <button
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: isHovered ? '#1e3320' : '#2C4A2E',
                    color: '#F5F0E8',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                }}
            >
                + Add listing
            </button>
            {isOpen && (
                <div className="modal-overlay fixed inset-0 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-card" style={{ background: '#F5F0E8', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', border: '0.5px solid #ddd8ce' }}>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', marginBottom: '20px', color: '#1A1A1A' }}>
                            Add new listing
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Property address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                style={inputStyle}
                            />
                            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                            </select>
                            <select value={pipelineStage} onChange={(e) => setPipelineStage(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="prospecting">Prospecting</option>
                                <option value="listed">Listed</option>
                                <option value="under_contract">Under Contract</option>
                                <option value="closed">Closed</option>
                            </select>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ background: '#2C4A2E', color: '#F5F0E8' }}
                                className="text-sm px-4 py-2.5 rounded-lg disabled:opacity-50 w-full mt-1"
                            >
                                {isLoading ? 'Adding...' : 'Add listing'}
                            </button>
                            {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
                        </form>
                        <button onClick={() => setIsOpen(false)} style={{ color: '#6B7280', fontSize: '12px', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
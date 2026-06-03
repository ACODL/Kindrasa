'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddLeadForm() {
    const supabase = createClient()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pipelineStage, setPipelineStage] = useState('new')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')




    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!firstName.trim()) {
            setError('First name is required')
            return
        }
        if (!pipelineStage) {
            setError('Please select a pipeline stage')
            return
        }
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase.from('leads').insert({
            agent_id: user?.id,
            first_name: firstName,
            last_name: lastName.trim() || '',
            phone_number: phone,
            email: email,
            pipeline_stage: pipelineStage
        })
        if (error) {
            setError(error.message)
        } else {
            setFirstName('')
            setLastName('')
            setPhone('')
            setPipelineStage('')
            setError('')
            router.refresh()
            setIsOpen(false)
        }
        setIsLoading(false)
    }

    return (
        <>
            <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .modal-overlay {
        animation: fadeIn 0.2s ease;
      }
      .modal-card {
        animation: slideUp 0.25s ease;
      }
    `}</style>
            <button onClick={() => setIsOpen(true)} style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', marginBottom: '20px', color: '#1A1A1A' }}>
                Add new client
            </button>
            {isOpen && (
                <div className="modal-overlay fixed inset-0 bg-opacity-50 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-card" style={{ background: '#F5F0E8', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', border: '0.5px solid #ddd8ce' }}>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', marginBottom: '20px', color: '#1A1A1A' }}>
                            Add new client
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border p-2 rounded"
                            />

                            <select value={pipelineStage} onChange={(e) => setPipelineStage(e.target.value)} required>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="closed">Closed</option>
                            </select>

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ background: '#2C4A2E' }}
                                className="text-white text-sm px-4 py-2 rounded-md disabled:opacity-50 w-full mt-2"
                            >
                                {isLoading ? 'Adding...' : 'Add client'}
                            </button>
                        </form>
                        <button onClick={() => setIsOpen(false)} style={{ color: '#6B7280', fontSize: '12px', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

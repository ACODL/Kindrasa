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
    const [isHovered, setIsHovered] = useState(false)




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
            setPipelineStage('new')
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
            <button onClick={() => setIsOpen(true)}
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
                Add new client
            </button>
            {isOpen && (
                <div className="modal-overlay fixed inset-0 bg-opacity-50 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-card" style={{ background: '#F5F0E8', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', border: '0.5px solid #ddd8ce' }}>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', marginBottom: '20px', color: '#1A1A1A' }}>
                            Add new client
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%' }}
                            />
                            <input
                                type="text"
                                placeholder="Last name (optional)"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%' }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%' }}
                            />
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%' }}
                            />
                            <select
                                value={pipelineStage}
                                onChange={(e) => setPipelineStage(e.target.value)}
                                required
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%', cursor: 'pointer' }}
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="closed">Closed</option>
                            </select>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ background: '#2C4A2E', color: '#F5F0E8' }}
                                className="text-sm px-4 py-2.5 rounded-lg disabled:opacity-50 w-full mt-1"
                            >
                                {isLoading ? 'Adding...' : 'Add client'}
                            </button>
                            {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
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

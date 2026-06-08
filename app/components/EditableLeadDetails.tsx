'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdatePipelineStage from './UpdatePipelineStage(lead)'

export default function EditableLeadDetails({ lead }: { lead: any }) {
    const supabase = createClient()
    const router = useRouter()
    const [firstName, setFirstName] = useState(lead.first_name ?? '')
    const [lastName, setLastName] = useState(lead.last_name ?? '')
    const [email, setEmail] = useState(lead.email ?? '')
    const [phone, setPhone] = useState(lead.phone_number ?? '')
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        const { error } = await supabase.from('leads').update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone
        }).eq('lead_id', lead.lead_id)
        if (error) {
            setError(error.message)
        } else {
            router.refresh()
            setIsEditing(false)
        }
        setIsSaving(false)
    }

    function handleCancel() {
        setFirstName(lead.first_name)
        setLastName(lead.last_name)
        setEmail(lead.email)
        setPhone(lead.phone_number)
        setError('')
        setIsEditing(false)
    }

    const initials = `${lead.first_name[0].toUpperCase()}${lead.last_name?.[0]?.toUpperCase() ?? ''}`


    return (
        <div>
            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            value={firstName}
                            placeholder="First name"
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', flex: 1 }}
                        />
                        <input
                            value={lastName}
                            placeholder="Last name"
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', flex: 1 }}
                        />
                    </div>
                    <input
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A' }}
                    />
                    <input
                        value={phone}
                        placeholder="Phone number"
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            style={{ background: '#ddd8ce', color: '#1A1A1A', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                        >
                            Cancel
                        </button>
                    </div>
                    {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '24px', margin: '0 0 4px', textTransform: 'capitalize' }}>
                            {lead.first_name} {lead.last_name}
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                            Added {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div style={{ borderTop: '0.5px solid #ddd8ce', paddingTop: '20px', display: 'flex', gap: '12px' }}>
                        {lead.email && (
                            <div>
                                <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Email</p>
                                <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0 }}>{lead.email}</p>
                            </div>
                        )}
                        {lead.phone_number && (
                            <div style={{ marginLeft: lead.email ? '40px' : 0 }}>
                                <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Phone</p>
                                <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0 }}>{lead.phone_number}</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ marginLeft: 'auto', background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: 'none', cursor: 'pointer', width: 'fit-content' }}
                        >
                            Edit details
                        </button>
                    </div>
                </div>

            )}
        </div>
    )
}
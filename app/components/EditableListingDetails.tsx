'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdatePipelineStage from './UpdatePipelineStage'


export default function EditableLeadDetails({ listing }: { listing: any }) {
    const supabase = createClient()
    const router = useRouter()
    const [address, setAddress] = useState(listing.address)
    const [price, setPrice] = useState(listing.price)
    const [status, setStatus] = useState(listing.status)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        const { error } = await supabase.from('listings').update({
            address: address,
            price: price,
            status: status
        }).eq('listing_id', listing.listing_id)
        if (error) {
            setError(error.message)
        } else {
            router.refresh()
            setIsEditing(false)
        }
        setIsSaving(false)
    }

    function handleCancel() {
        setAddress(listing.address)
        setPrice(listing.price)
        setStatus(listing.status)
        setError('')
        setIsEditing(false)
    }

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(listing.price)


    return (
        <div>
            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', flex: 1 }}
                        />
                    </div>
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A' }}
                    />
                    <input
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
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
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', margin: '0 0 4px' }}>
                            {listing.address}
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                            Listed {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Price + Status grid */}
                    <div style={{ borderTop: '0.5px solid #ddd8ce', paddingTop: '20px', display: 'flex', flexDirection: 'row', gap: '12px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Price</p>
                            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', color: '#2C4A2E', margin: 0 }}>{formattedPrice}</p>
                        </div>
                        <div style={{ marginLeft: listing.price ? '40px' : 0 }}>
                            <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Status</p>
                            <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0, textTransform: 'capitalize' }}>{listing.status}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ marginLeft: 'auto', background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', border: 'none', cursor: 'pointer', width: 'fit-content', marginTop: '12px' }}
                        >
                            Edit details
                        </button>
                    </div>
                </div>



            )
            }
        </div >
    )
}
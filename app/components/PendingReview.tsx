'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const editInputStyle = { border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: '#fff', color: '#1A1A1A', width: '100%' }

export default function PendingReview() {
    const [pendingContacts, setPendingContacts] = useState<any[]>([])
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editBirthday, setEditBirthday] = useState('')

    async function loadPendingContacts() {
        const supabase = createClient()
        const { data } = await supabase
            .from('pending_contacts')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
        setPendingContacts(data ?? [])
    }

    useEffect(() => {
        loadPendingContacts()
    }, [])

    useEffect(() => {
        const newTotal = Math.ceil(pendingContacts.length / pageSize)
        if (currentPage > newTotal && newTotal > 0) {
            setCurrentPage(newTotal)
        }
    }, [pendingContacts, pageSize, currentPage])

    async function handleAccept(pendingId: string) {
        setError('')
        try {
            const res = await fetch('/api/accept-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pending_id: pendingId }),
            })
            if (!res.ok) throw new Error('Failed to accept')
            await loadPendingContacts()
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function handleReject(pendingId: string) {
        setError('')
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('pending_contacts')
                .update({ status: 'rejected' })
                .eq('pending_id', pendingId)
            if (error) throw new Error(error.message)
            await loadPendingContacts()
        } catch (err: any) {
            setError(err.message)
        }
    }

    function startEdit(contact: any) {
        setEditingId(contact.pending_id)
        setEditName(contact.name ?? '')
        setEditPhone(contact.phone ?? '')
        setEditEmail(contact.email ?? '')
        setEditBirthday(contact.birthday ?? '')
    }

    async function saveEdit(pendingId: string) {
        const supabase = createClient()
        const { error } = await supabase
            .from('pending_contacts')
            .update({ name: editName, phone: editPhone || null, email: editEmail || null, birthday: editBirthday || null })
            .eq('pending_id', pendingId)
        if (error) {
            setError(error.message)
        } else {
            setEditingId(null)
            await loadPendingContacts()
        }
    }

    if (pendingContacts.length === 0) return null

    const totalPages = Math.ceil(pendingContacts.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const visibleContacts = pendingContacts.slice(startIndex, startIndex + pageSize)

    return (
        <div style={{ maxWidth: '900px', marginTop: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px', marginBottom: '16px' }}>
                Review contacts ({pendingContacts.length})
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Show
                    <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }} style={{ border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', background: '#F5F0E8' }}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    per page
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background: 'none', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>← Prev</button>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background: 'none', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
            </div>

            {visibleContacts.map((contact) => (
                <div key={contact.pending_id} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    {editingId === contact.pending_id ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" style={editInputStyle} />
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone" style={editInputStyle} />
                                <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" style={editInputStyle} />
                                <input value={editBirthday} onChange={(e) => setEditBirthday(e.target.value)} placeholder="YYYY-MM-DD" style={editInputStyle} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p style={{ fontSize: '14px', color: '#1A1A1A', margin: '0 0 2px', fontWeight: 500 }}>{contact.name}</p>
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                                {contact.phone || 'No phone'}{contact.birthday ? ` · 🎂 ${contact.birthday}` : ''}
                            </p>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        {editingId === contact.pending_id ? (
                            <>
                                <button onClick={() => saveEdit(contact.pending_id)} style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>Save</button>
                                <button onClick={() => setEditingId(null)} style={{ background: '#fff', color: '#6B7280', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: '0.5px solid #ddd8ce', cursor: 'pointer' }}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => startEdit(contact)} style={{ background: '#fff', color: '#2C4A2E', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: '0.5px solid #2C4A2E', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleAccept(contact.pending_id)} style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>Accept</button>
                                <button onClick={() => handleReject(contact.pending_id)} style={{ background: '#fff', color: '#B43E3E', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: '0.5px solid #B43E3E', cursor: 'pointer' }}>Reject</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '12px' }}>{error}</p>}
        </div>
    )
}
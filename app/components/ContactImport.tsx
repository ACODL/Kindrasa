'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"



export default function ContactImport() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [pendingContacts, setPendingContacts] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setError('')
        }
    }

    useEffect(() => {
        const newTotal = Math.ceil(pendingContacts.length / pageSize)
        if (currentPage > newTotal && newTotal > 0) {
            setCurrentPage(newTotal)
        }
    }, [pendingContacts, pageSize, currentPage])

    async function handleUpload() {
        if (!selectedFile) {
            setError('Please choose a file first')
            return
        }
        setIsUploading(true)
        setError('')
        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            const res = await fetch('/api/parse_vcard', {
                method: 'POST',
                body: formData,
            })
            if (!res.ok) {
                throw new Error('Upload failed')
            }
            const data = await res.json()
            console.log('parsed:', data)
            await loadPendingContacts()
        } catch (err) {
            setError('Could not upload file. Try again.')
        } finally {
            setIsUploading(false)
        }
    }

    async function handleAccept(pendingId: string) {
        setError('')
        try {
            const res = await fetch('/api/accept-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pending_id: pendingId }),
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error('Failed to accept')
            }
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
            if (error) {
                throw new Error(error.message)
            }
            await loadPendingContacts()  // refresh
        } catch (err: any) {
            setError(err.message)
        }
    }

    const totalPages = Math.ceil(pendingContacts.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const visibleContacts = pendingContacts.slice(startIndex, startIndex + pageSize)

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '28px', maxWidth: '900px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '20px', marginBottom: '8px' }}>
                Import contacts
            </h2>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>
                Upload a .vcf file exported from your phone to add contacts as leads.
            </p>

            <input
                ref={fileInputRef}
                type="file"
                accept=".vcf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: '#F5F0E8', color: '#2C4A2E', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}
                >
                    Choose file
                </button>

                {selectedFile && (
                    <p style={{ fontSize: '13px', color: '#1A1A1A', marginBottom: '16px' }}>
                        Selected: {selectedFile.name}
                    </p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile}
                    style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: (isUploading || !selectedFile) ? 0.5 : 1 }}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>

            </div>


            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

            <>
                {pendingContacts.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px', marginBottom: '16px' }}>
                            Review contacts ({pendingContacts.length})
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            {/* page size dropdown */}
                            <label style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Show
                                <select
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
                                    style={{ border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', background: '#F5F0E8' }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                per page
                            </label>

                            {/* prev / next */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ background: 'none', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
                                >
                                    ← Prev
                                </button>
                                <span style={{ fontSize: '13px', color: '#6B7280' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ background: 'none', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                        {visibleContacts.map((contact) => (
                            <div key={contact.pending_id} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: '14px', color: '#1A1A1A', margin: '0 0 2px', fontWeight: 500 }}>
                                        {contact.name}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                                        {contact.phone || 'No phone'}{contact.birthday ? ` · 🎂 ${contact.birthday}` : ''}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleAccept(contact.pending_id)}
                                        style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(contact.pending_id)}
                                        style={{ background: '#fff', color: '#B43E3E', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', border: '0.5px solid #B43E3E', cursor: 'pointer' }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        </div>
    )
}
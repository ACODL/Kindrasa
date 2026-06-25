'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"



export default function ContactImport({ onImported }: { onImported?: () => void }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)


    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setError('')
        }
    }

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
            await res.json()
            setSelectedFile(null)
            onImported?.()   // tell the parent to refresh the review queue
        } catch (err) {
            setError('Could not upload file. Try again.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '28px', maxWidth: '900px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '20px', marginBottom: '8px' }}>
                Import from phone contacts
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





        </div>


    )
}


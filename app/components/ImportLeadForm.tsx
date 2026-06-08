'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ImportLeadForm() {
    const [error, setError] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [emailText, setEmailText] = useState('')
    const [isHovered, setIsHovered] = useState(false)




    async function handleImport(e: React.FormEvent) {
        e.preventDefault()

        if (!emailText.trim()) {
            setError('Please paste an email first')
            return
        }
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/parse-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_text: emailText }),
            })
            if (!response.ok) {
                throw new Error('Import failed')
            }
            setEmailText('')
            setIsOpen(false)
            router.refresh()
        } catch (err) {
            setError('Could not import lead. Check the email and try again.')
        } finally {
            setIsLoading(false)
        }
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
                Import from email
            </button>
            {isOpen && (
                <div className="modal-overlay fixed inset-0 bg-opacity-50 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-card" style={{ background: '#F5F0E8', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', border: '0.5px solid #ddd8ce' }}>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', marginBottom: '20px', color: '#1A1A1A' }}>
                            New Email
                        </h2>
                        <form onSubmit={handleImport} className="flex flex-col gap-3">
                            <textarea
                                placeholder="Paste the lead email here..."
                                value={emailText}
                                onChange={(e) => setEmailText(e.target.value)}
                                rows={8}
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', background: '#fff', width: '100%', resize: 'none' }}>
                            </textarea>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ background: '#2C4A2E', color: '#F5F0E8' }}
                                className="text-sm px-4 py-2.5 rounded-lg disabled:opacity-50 w-full mt-1"
                            >
                                {isLoading ? 'Importing...' : 'Import'}
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

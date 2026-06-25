'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STAGES = {
    sale: ['pre-offer', 'offer made', 'under contract', 'in escrow', 'closing', 'closed'],
    loan: ['application', 'processing', 'underwriting', 'clear to close', 'funded'],
}

export default function TransactionSection({ lead, transaction }: { lead: any; transaction: any }) {
    const supabase = createClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // if a transaction exists, prefill from it; otherwise sensible defaults
    const [type, setType] = useState<'sale' | 'loan'>(transaction?.type ?? 'sale')
    const [stage, setStage] = useState(transaction?.stage ?? STAGES['sale'][0])
    const [closeDate, setCloseDate] = useState(transaction?.close_date ?? '')
    const [note, setNote] = useState(transaction?.note ?? '')
    const [propertyAddress, setPropertyAddress] = useState(transaction?.property_address ?? '')

    // when type changes, reset stage to that type's first stage
    function handleTypeChange(newType: 'sale' | 'loan') {
        setType(newType)
        setStage(STAGES[newType][0])
    }

    async function handleSave() {
        setIsLoading(true)
        setError('')
        const { data: { user } } = await supabase.auth.getUser()

        const payload = {
            lead_id: lead.lead_id,
            agent_id: user?.id,
            type,
            stage,
            property_address: propertyAddress || null,
            close_date: closeDate || null,
            note: note || null,
            updated_at: new Date().toISOString(),
        }

        let result
        if (transaction) {
            // update existing
            result = await supabase.from('transactions').update(payload).eq('transaction_id', transaction.transaction_id)
        } else {
            // create new
            result = await supabase.from('transactions').insert(payload)
        }

        if (result.error) {
            setError(result.error.message)
        } else {
            router.refresh()
        }
        setIsLoading(false)
    }

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '16px', marginBottom: '16px', color: '#1A1A1A' }}>
                Transaction
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* type */}
                <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Type</label>
                    <select value={type} onChange={(e) => handleTypeChange(e.target.value as 'sale' | 'loan')} style={selectStyle}>
                        <option value="sale">Sale</option>
                        <option value="loan">Loan</option>
                    </select>
                </div>

                {/* stage — options depend on type */}
                <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Stage</label>
                    <select value={stage} onChange={(e) => setStage(e.target.value)} style={selectStyle}>
                        {STAGES[type].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* property address */}
                <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Property address</label>
                    <input type="text" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="123 Main St" style={inputStyle} />
                </div>

                {/* close date */}
                <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Close date</label>
                    <input type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} style={inputStyle} />
                </div>

                {/* note */}
                <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Note</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="e.g. waiting on appraisal" style={{ ...inputStyle, resize: 'none' }} />
                </div>

                <button onClick={handleSave} disabled={isLoading} style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isLoading ? 0.5 : 1, alignSelf: 'flex-start' }}>
                    {isLoading ? 'Saving...' : transaction ? 'Update transaction' : 'Create transaction'}
                </button>
                {error && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
            </div>
        </div>
    )
}

const selectStyle = { border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#F5F0E8', color: '#1A1A1A', cursor: 'pointer', width: '100%' }
const inputStyle = { border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#fff', color: '#1A1A1A', width: '100%' }
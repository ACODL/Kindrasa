import { House } from 'lucide-react'

export default function ListingCard({ listing }: { listing: any }) {
    const stageColors: Record<string, { bg: string; color: string; label: string }> = {
        prospecting: { bg: '#e0e7ff', color: '#3730a3', label: 'Prospecting' },
        listed: { bg: '#d1fae5', color: '#065f46', label: 'Listed' },
        under_contract: { bg: '#fef3c7', color: '#92400e', label: 'Under contract' },
        closed: { bg: '#f3f4f6', color: '#374151', label: 'Closed' },
    }
    const stage = stageColors[listing.pipeline_stage] ?? stageColors.closed

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(listing.price)

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fef9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    <House size={18} color="#8B6914" strokeWidth={1.5} />
                </div>
                <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', margin: '0 0 3px' }}>{listing.address}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                        {formattedPrice} · <span style={{ textTransform: 'capitalize' }}>{listing.status}</span>
                    </p>
                </div>
            </div>
            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500, background: stage.bg, color: stage.color }}>
                {stage.label}
            </span>
        </div>
    )
}
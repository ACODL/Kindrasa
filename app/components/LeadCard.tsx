export default function LeadCard({ lead }: { lead: any }) {
    const initials = `${lead.first_name[0]}${lead.last_name?.[0] || ''}`

    const tempColors: Record<string, string> = {
        new: '#9CA3AF',
        warm: '#E07A5F',
        cooling: '#E9B949',
        cool: '#6B9AC4',
        cold: '#4A6B8A',
    }
    const stripeColor = tempColors[lead.temperature] ?? '#9CA3AF'

    const contactText = lead.daysSinceContact === null
        ? 'Never contacted'
        : `${lead.daysSinceContact} days since contact`

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderLeft: `4px solid ${stripeColor}`, borderRadius: '10px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e8f0e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#2C4A2E', flexShrink: 0 }}>
                    {initials}
                </div>
                <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', margin: '0 0 3px' }}>
                        {lead.first_name} {lead.last_name || ''}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>{lead.email} · {lead.phone_number}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: stripeColor, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{contactText}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


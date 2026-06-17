import Link from 'next/link'

export default function NeedsAttention({ goingCold, upcomingBirthdays }: { goingCold: any[]; upcomingBirthdays: any[] }) {
    // don't render anything if there's nothing to surface
    if ((!goingCold || goingCold.length === 0) && (!upcomingBirthdays || upcomingBirthdays.length === 0)) {
        return null
    }

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px', marginBottom: '18px', color: '#1A1A1A' }}>
                Needs attention
            </h2>

            {/* Birthdays */}
            {upcomingBirthdays && upcomingBirthdays.length > 0 && (
                <div style={{ marginBottom: goingCold.length > 0 ? '20px' : 0 }}>
                    <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                        🎂 Birthdays this week
                    </p>
                    {upcomingBirthdays.map((lead) => (
                        <Link key={lead.lead_id} href={`/dashboard/leads/${lead.lead_id}`}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', marginBottom: '6px', background: '#faf8f3', cursor: 'pointer' }}>
                                <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
                                    {lead.first_name} {lead.last_name || ''}
                                </span>
                                <span style={{ fontSize: '12px', color: '#8B6914', fontWeight: 500 }}>
                                    {lead.daysUntilBday === 0 ? 'Today!' : lead.daysUntilBday === 1 ? 'Tomorrow' : `in ${lead.daysUntilBday} days`}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Going cold */}
            {goingCold && goingCold.length > 0 && (
                <div>
                    <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                        🔵 Going cold
                    </p>
                    {goingCold.map((lead) => (
                        <Link key={lead.lead_id} href={`/dashboard/leads/${lead.lead_id}`}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', marginBottom: '6px', background: '#faf8f3', cursor: 'pointer' }}>
                                <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
                                    {lead.first_name} {lead.last_name || ''}
                                </span>
                                <span style={{ fontSize: '12px', color: lead.temperature === 'cold' ? '#4A6B8A' : '#6B9AC4', fontWeight: 500 }}>
                                    {lead.daysSinceContact} days since contact
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
export default function TransactionCard({ transaction }: { transaction: any }) {
    const lead = transaction.leads
    const clientName = lead ? `${lead.first_name} ${lead.last_name || ''}`.trim() : 'Unknown client'

    const typeColors: Record<string, string> = {
        sale: '#8B6914',
        loan: '#2C4A2E',
    }
    const typeColor = typeColors[transaction.type] ?? '#6B7280'

    const closeText = transaction.close_date
        ? new Date(transaction.close_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No close date'

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderLeft: `4px solid ${typeColor}`, borderRadius: '10px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ fontWeight: 500, fontSize: '15px', margin: '0 0 4px', color: '#1A1A1A' }}>
                    {clientName}
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                    {transaction.property_address || 'No address'} · closes {closeText}
                </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: typeColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    {transaction.type}
                </span>
                <span style={{ background: '#f0ede5', color: '#1A1A1A', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>
                    {transaction.stage}
                </span>
            </div>
        </div>
    )
}
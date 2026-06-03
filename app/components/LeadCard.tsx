export default function LeadCard({ lead }: { lead: any }) {
    const initials = `${lead.first_name[0]}${lead.last_name?.[0] || ''}`
    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e8f0e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#2C4A2E', flexShrink: 0 }}>
                    {initials}
                </div>
                <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', margin: '0 0 3px' }}>
                        {lead.first_name} {lead.last_name || ''}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{lead.email} · {lead.phone_number}</p>
                </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.pipeline_stage === 'new' ? 'bg-indigo-100 text-indigo-800' :
                lead.pipeline_stage === 'contacted' ? 'bg-amber-100 text-amber-800' :
                    lead.pipeline_stage === 'qualified' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-700'
                }`}>
                {lead.pipeline_stage}
            </span>
        </div>
    )
}

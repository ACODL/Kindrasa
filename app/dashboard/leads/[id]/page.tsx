import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/app/components/header'
import UpdatePipelineStage from '@/app/components/UpdatePipelineStage(lead)'
import AddActivityForm from '@/app/components/AddActivityForm'
import EditableLeadDetails from '@/app/components/EditableLeadDetails'
import DraftButton from '@/app/components/DraftButton'
import DraftCard from '@/app/components/DraftCard'
import TransactionSection from '@/app/components/TransactionSection'


export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('lead_id', id)
        .single()
    const { data: activities } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', id)
        .order('created_at', { ascending: false })
    const { data: drafts } = await supabase
        .from('ai_drafts')
        .select('*')
        .eq('lead_id', id).eq('status', 'pending')
        .order('created_at', { ascending: false })

    const { data: transaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('lead_id', lead.lead_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()


    const initials = `${lead.first_name[0].toUpperCase()}${lead.last_name?.[0]?.toUpperCase() ?? ''}`

    const activityTypeColors: Record<string, { bg: string; color: string; label: string }> = {
        call: { bg: '#e0e7ff', color: '#3730a3', label: 'Call' },
        text: { bg: '#d1fae5', color: '#065f46', label: 'Text' },
        email: { bg: '#fef3c7', color: '#92400e', label: 'Email' },
        note: { bg: '#f3f4f6', color: '#374151', label: 'Note' },
    }

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <Link href="/dashboard" style={{ color: '#2C4A2E', fontSize: '13px' }} className="hover:underline">
                    ← Back to Dashboard
                </Link>

                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '28px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e8f0e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 500, color: '#2C4A2E', flexShrink: 0 }}>
                            {initials}
                        </div>
                        <span style={{
                            marginLeft: 'auto',
                            fontSize: '11px',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontWeight: 500,
                            background: lead.pipeline_stage === 'new' ? '#e0e7ff' :
                                lead.pipeline_stage === 'contacted' ? '#fef3c7' :
                                    lead.pipeline_stage === 'qualified' ? '#d1fae5' : '#f3f4f6',
                            color: lead.pipeline_stage === 'new' ? '#3730a3' :
                                lead.pipeline_stage === 'contacted' ? '#92400e' :
                                    lead.pipeline_stage === 'qualified' ? '#065f46' : '#374151'
                        }}>
                            {lead.pipeline_stage}
                        </span>
                    </div>
                    <EditableLeadDetails lead={lead} />
                </div>

                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
                    <UpdatePipelineStage lead={lead} />
                </div>

                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
                    <TransactionSection lead={lead} transaction={transaction} />
                </div>

                <div style={{ marginTop: '28px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px', marginBottom: '16px' }}>
                            Activity history
                        </h3>
                        <div style={{ marginLeft: 'auto' }}>
                            <DraftButton leadId={lead.lead_id} />
                        </div>
                    </div>

                    {activities?.length === 0 && (
                        <p style={{ color: '#6B7280', fontSize: '13px' }}>No activities logged yet.</p>
                    )}

                    {activities?.map((activity) => {
                        const typeStyle = activityTypeColors[activity.type] ?? activityTypeColors.note
                        return (
                            <div key={activity.activity_id} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '16px 18px', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500, background: typeStyle.bg, color: typeStyle.color }}>
                                        {typeStyle.label}
                                    </span>
                                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                                        {new Date(activity.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0 }}>{activity.content}</p>
                            </div>
                        )
                    })}

                    <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
                        <AddActivityForm leadId={lead.lead_id} />
                    </div>
                    <div>
                        {drafts && drafts.length > 0 && (
                            <div style={{ marginTop: '28px' }}>
                                <h3 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px', marginBottom: '16px' }}>
                                    Pending drafts
                                </h3>
                                {drafts.map((draft) => (
                                    <DraftCard key={draft.draft_id} draft={draft} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
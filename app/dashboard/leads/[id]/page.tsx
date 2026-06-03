import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/app/components/header'
import UpdatePipelineStage from '@/app/components/UpdatePipelineStage'
import AddActivityForm from '@/app/components/AddActivityForm'

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
    console.log('leads:', lead)
    console.log('activities:', activities)
    return (
        <div className="min-h-screen">
            <Header />
            <Link href="/dashboard" className="text-blue-500 hover:underline">← Back to Dashboard</Link>
            <div className="mt-6 border rounded p-6">
                <h2 className="text-2xl font-bold mb-4">{lead.first_name} {lead.last_name}</h2>
                <p className="mb-2">Email: {lead.email}</p>
                <p className="mb-2">Phone: {lead.phone_number}</p>
                <p className="mb-2">Created: {new Date(lead.created_at).toLocaleString()}</p>
                <span className={`px-2 py-1 rounded text-sm font-medium ${lead.pipeline_stage === 'new' ? 'bg-blue-500 text-white' :
                    lead.pipeline_stage === 'contacted' ? 'bg-yellow-500 text-white' :
                        lead.pipeline_stage === 'qualified' ? 'bg-green-500 text-white' :
                            'bg-gray-500 text-white'
                    }`}>
                    {lead.pipeline_stage}
                </span>
            </div>
            <UpdatePipelineStage lead={lead} />
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Activity History</h3>
                {activities?.length === 0 && <p>No activities yet.</p>}
                {activities?.map((activity) => (
                    <div key={activity.activity_id} className="border rounded p-4 mb-4">
                        <p>{activity.type}</p>
                        <p>{activity.content}</p>
                        <p className="text-gray-500 text-sm">{new Date(activity.created_at).toLocaleString()}</p>
                    </div>
                ))}
                <AddActivityForm leadId={lead.lead_id} />
            </div>
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/app/components/header'
import LeadCard from '@/app/components/LeadCard'
import AddLeadForm from '@/app/components/AddLeadForm'
import Link from 'next/link'
import Greeting from '@/app/components/Greeting'
import ImportLeadForm from '@/app/components/ImportLeadForm'
import { Suspense } from 'react'
import GmailConnectedBanner from '@/app/components/GmailConnectedBanner'


export default async function DashboardPage() {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    console.log('user:', user?.id)
    const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
    console.log('leads error:', leadsError)
    console.log('leads:', leads)

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <Suspense fallback={null}>
                    <GmailConnectedBanner />
                </Suspense>
                <Greeting />
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Here's what's happening with your clients today.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px' }}>Your clients</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <AddLeadForm />
                        <ImportLeadForm />
                    </div>
                </div>

                {leads?.map((lead) => (
                    <Link key={lead.lead_id} href={`/dashboard/leads/${lead.lead_id}`}>
                        <div className="mb-3">
                            <LeadCard lead={lead} />
                        </div>
                    </Link>
                ))}
            </div>
        </div >


    )

}
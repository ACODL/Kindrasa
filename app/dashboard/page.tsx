import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/app/components/header'
import LeadCard from '@/app/components/LeadCard'
import AddLeadForm from '@/app/components/AddLeadForm'
import Link from 'next/link'


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

    function getGreeting() {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '26px', marginBottom: '4px' }}>
                    {getGreeting()}.
                </h1>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Here's what's happening with your clients today.
                </p>
                <div className="flex justify-between items-center mb-4">
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px' }}>Your clients</h2>
                    <AddLeadForm />
                </div>

                {leads?.map((lead) => (
                    <Link key={lead.lead_id} href={`/dashboard/leads/${lead.lead_id}`}>
                        <div className="mb-3">
                            <LeadCard lead={lead} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>


    )

}
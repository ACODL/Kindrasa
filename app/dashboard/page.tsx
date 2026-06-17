import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/app/components/header'
import LeadCard from '@/app/components/LeadCard'
import Link from 'next/link'
import Greeting from '@/app/components/Greeting'
import ImportMenu from '@/app/components/ImportMenu'
import { Suspense } from 'react'
import GmailConnectedBanner from '@/app/components/GmailConnectedBanner'
import NeedsAttention from '@/app/components/NeedsAttention'


export default async function DashboardPage() {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }


    const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
    console.log('leads error:', leadsError)
    console.log('leads:', leads)

    const { data: agent } = await supabase
        .from('agents')
        .select('display_name')
        .eq('userid', user.id)
        .single()

    const { data: activities } = await supabase
        .from('lead_activities')
        .select('lead_id, created_at, type')
        .in('type', ['call', 'text', 'email', 'contact'])
        .order('created_at', { ascending: false })

    // helper: categorize a lead by days since last contact
    function getTemperature(lastContactDate: Date | null) {
        if (!lastContactDate) {
            return { label: 'new', days: null }   // never contacted
        }
        const days = Math.max(0, Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24)))
        if (days <= 60) return { label: 'warm', days }
        if (days <= 120) return { label: 'cooling', days }
        if (days <= 180) return { label: 'cool', days }
        return { label: 'cold', days }
    }

    // for each lead, find their most recent contact activity and compute temperature
    const leadsWithTemp = leads?.map((lead) => {
        // activities are already sorted newest-first, so the FIRST match is the most recent
        const lastContact = activities?.find((a) => a.lead_id === lead.lead_id)
        const lastContactDate = lastContact ? new Date(lastContact.created_at) : null
        const temp = getTemperature(lastContactDate)
        return { ...lead, temperature: temp.label, daysSinceContact: temp.days }
    })

    // leads that were contacted but are slipping — cold first, then cool, max 3
    const goingCold = leadsWithTemp
        ?.filter((l) => l.temperature === 'cool' || l.temperature === 'cold')
        .sort((a, b) => (b.daysSinceContact ?? 0) - (a.daysSinceContact ?? 0))  // most days first
        .slice(0, 3)
    // days until a birthday's next occurrence (ignoring year)
    console.log(goingCold)

    function daysUntilBirthday(birthday: string | null): number | null {
        if (!birthday) return null
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const bday = new Date(birthday)
        // build this year's occurrence
        let next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
        if (next < today) {
            // already passed this year → use next year
            next = new Date(today.getFullYear() + 1, bday.getMonth(), bday.getDate())
        }
        const days = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return days
    }



    // leads with a birthday in the next 7 days
    const upcomingBirthdays = leadsWithTemp
        ?.map((l) => ({ ...l, daysUntilBday: daysUntilBirthday(l.birthday) }))
        .filter((l) => l.daysUntilBday !== null && l.daysUntilBday <= 7)
        .sort((a, b) => (a.daysUntilBday ?? 0) - (b.daysUntilBday ?? 0))



    // log to verify before building visuals
    console.log('leads with temperature:', leadsWithTemp?.map(l => ({
        name: l.first_name,
        temp: l.temperature,
        days: l.daysSinceContact
    })))

    console.log('goingCold:', goingCold)
    console.log('upcomingBirthdays:', upcomingBirthdays)





    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <Suspense fallback={null}>
                    <GmailConnectedBanner />
                </Suspense>
                <Greeting name={agent?.display_name ?? ''} />
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Here's what's happening with your clients today.
                </p>
                <NeedsAttention goingCold={goingCold ?? []} upcomingBirthdays={upcomingBirthdays ?? []} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px' }}>Your clients</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <ImportMenu />
                    </div>
                </div>

                {leadsWithTemp?.map((lead) => (
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
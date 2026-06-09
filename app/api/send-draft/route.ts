import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const { draft_id, subject, body } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // look up the draft to get the lead it's for
    const { data: draft } = await supabase
        .from('ai_drafts')
        .select('*')
        .eq('draft_id', draft_id)
        .single()

    if (!draft) {
        return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    // look up the lead's email address
    const { data: lead } = await supabase
        .from('leads')
        .select('email, first_name')
        .eq('lead_id', draft.lead_id)
        .single()

    if (!lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (!lead.email) {
        return NextResponse.json({ error: 'This lead has no email address' }, { status: 400 })
    }

    // send via FastAPI
    const response = await fetch(`${process.env.FASTAPI_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            agent_id: user.id,
            to_email: lead.email,
            subject: subject,
            body: body,
        }),
    })

    const sendResult = await response.json()
    console.log('send-email response:', sendResult)


    if (!response.ok || sendResult.status === 'error') {
        return NextResponse.json({ error: sendResult.detail || 'Failed to send' }, { status: 500 })
    }

    // mark the draft as sent
    await supabase.from('ai_drafts').update({ status: 'sent' }).eq('draft_id', draft_id)

    // log it as an activity
    await supabase.from('lead_activities').insert({
        lead_id: draft.lead_id,
        performing_agent: user.id,
        type: 'email',
        content: `Sent email: ${subject}`,
    })

    return NextResponse.json({ status: 'sent' })
}
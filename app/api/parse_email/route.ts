import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const { email_text } = await request.json()

    // get the logged-in agent server-side
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // call FastAPI, attaching the authenticated agent's id
    const response = await fetch(`${process.env.FASTAPI_URL}/parse-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_text, agent_id: user.id }),
    })

    const data = await response.json()
    return NextResponse.json(data)
}
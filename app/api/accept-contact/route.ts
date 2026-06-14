import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { pending_id } = await request.json()

    const response = await fetch(`${process.env.FASTAPI_URL}/accept-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pending_id }),
    })

    const data = await response.json()
    return NextResponse.json(data)
}
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ connected: false }, { status: 401 })
    }

    const response = await fetch(
        `${process.env.FASTAPI_URL}/check-email-connection?agent_id=${user.id}`
    )
    const data = await response.json()
    return NextResponse.json(data)
}
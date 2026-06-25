import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const forwardData = new FormData()
    forwardData.append('file', file)

    const response = await fetch(`${process.env.FASTAPI_URL}/parse-csv`, {
        method: 'POST',
        body: forwardData,
    })
    const data = await response.json()
    return NextResponse.json(data)
}
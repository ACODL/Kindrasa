import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // grab the uploaded file from the incoming FormData
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // rebuild FormData to forward to FastAPI
    const forwardData = new FormData()
    forwardData.append('file', file)

    // FastAPI takes agent_id as a query param
    const response = await fetch(
        `${process.env.FASTAPI_URL}/parse-vcard?agent_id=${user.id}`,
        {
            method: 'POST',
            body: forwardData,
        }
    )

    const data = await response.json()
    return NextResponse.json(data)
}
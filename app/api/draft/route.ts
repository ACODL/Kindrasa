import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    // 1. read the lead_id sent from the browser
    const { lead_id } = await request.json()

    // 2. call your FastAPI endpoint, server-to-server
    const response = await fetch(`${process.env.FASTAPI_URL}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id }),
    })

    // 3. get FastAPI's JSON response
    const data = await response.json()

    // 4. send it back to the browser
    return NextResponse.json(data)
}
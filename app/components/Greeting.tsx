'use client'
import { useState, useEffect } from 'react'


export default function Greeting() {
    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good morning')
        else if (hour < 17) setGreeting('Good afternoon')
        else setGreeting('Good evening')
    }, [])

    return (
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '26px', marginBottom: '4px' }}>
            {greeting || 'Welcome'}, .
        </h1>
    )
}
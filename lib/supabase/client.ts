import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

    return createBrowserClient(supabaseUrl, supabaseKey)
}
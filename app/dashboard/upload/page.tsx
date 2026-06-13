// app/dashboard/import/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/app/components/header'
import ContactImport from '@/app/components/ContactImport'

export default async function ImportPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <ContactImport />
            </div>
        </div>
    )
}
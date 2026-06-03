
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/app/components/header'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    const { data: listing } = await supabase
        .from('listings')
        .select('*')
        .eq('listing_id', id)
        .single()
    console.log('listing:', listing)
    return (
        <div className="min-h-screen">
            <Header />
            <Link href="/dashboard/listings" className="text-blue-500 hover:underline">← Back to Listings</Link>
            <div className="mt-6 border rounded p-6">
                <h2 className="text-2xl font-bold mb-4">{listing.address}</h2>
                <p className="mb-2">Price: ${listing.price.toFixed(2)}</p>
                <p className="mb-2">Status: {listing.status}</p>
                <p className="mb-2">Created: {new Date(listing.created_at).toLocaleString()}</p>
                <span className={`px-2 py-1 rounded text-sm font-medium ${listing.pipeline_stage === 'prospecting' ? 'bg-blue-500 text-white' :
                    listing.pipeline_stage === 'listed' ? 'bg-yellow-500 text-white' :
                        listing.pipeline_stage === 'under_contract' ? 'bg-green-500 text-white' : listing.pipeline_stage === 'closed' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                    }`}>
                    {listing.pipeline_stage}
                </span>
            </div>
            <div className="mt-6">

            </div>
        </div>
    )
}
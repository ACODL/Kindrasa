import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/app/components/header'
import ListingCard from '@/app/components/ListingCard'
import Link from 'next/link'
import AddListingForm from '@/app/components/AddListingForm'

export default async function ListingsPage() {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    console.log('user:', user?.id)
    const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
    console.log('listings error:', listingsError)
    console.log('listings:', listings)

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '26px', marginBottom: '4px' }}>
                    Listings
                </h1>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Manage your property portfolio.
                </p>
                <div className="flex justify-between items-center mb-4">
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '18px' }}>Your listings</h2>
                    <AddListingForm />
                </div>

                {listings?.map((listing) => (
                    <Link key={listing.listing_id} href={`/dashboard/listings/${listing.listing_id}`}>
                        <div className="mb-3">
                            <ListingCard listing={listing} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )

}
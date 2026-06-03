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
                <h1 className="text-2xl font-bold mb-2">Listings</h1>
                <p className="text-gray-400 mb-6">Welcome to your listings!</p>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Listings</h2>
                    <AddListingForm />
                </div>

                {listings?.map((listing) => (
                    <Link key={listing.listing_id} href={`/dashboard/listings/${listing.listing_id}`}>
                        <div className="border rounded p-4 mb-4 hover:border-blue-500 cursor-pointer">
                            <ListingCard listing={listing} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>


    )

}
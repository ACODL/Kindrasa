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

    const stageColors: Record<string, { bg: string; color: string; label: string }> = {
        prospecting: { bg: '#e0e7ff', color: '#3730a3', label: 'Prospecting' },
        listed: { bg: '#d1fae5', color: '#065f46', label: 'Listed' },
        under_contract: { bg: '#fef3c7', color: '#92400e', label: 'Under contract' },
        closed: { bg: '#f3f4f6', color: '#374151', label: 'Closed' },
    }
    const stage = stageColors[listing.pipeline_stage] ?? stageColors.closed

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(listing.price)

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <Link href="/dashboard/listings" style={{ color: '#2C4A2E', fontSize: '13px' }} className="hover:underline">
                    ← Back to Listings
                </Link>

                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '28px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: '#fef9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                            🏠
                        </div>
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '22px', margin: '0 0 4px' }}>
                                {listing.address}
                            </h2>
                            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                                Listed {new Date(listing.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, background: stage.bg, color: stage.color }}>
                            {stage.label}
                        </span>
                    </div>

                    <div style={{ borderTop: '0.5px solid #ddd8ce', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Price</p>
                            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', color: '#2C4A2E', margin: 0 }}>{formattedPrice}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Status</p>
                            <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0, textTransform: 'capitalize' }}>{listing.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
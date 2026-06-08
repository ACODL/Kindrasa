import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/app/components/header'
import EditableListingDetails from '@/app/components/EditableListingDetails'
import { House } from 'lucide-react'
import UpdateStatus from '@/app/components/UpdateStatus'
import UpdatePipelineStage from '@/app/components/UpdatePipelineStage(listing)'

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

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <Link href="/dashboard/listings" style={{ color: '#2C4A2E', fontSize: '13px' }} className="hover:underline">
                    ← Back to Listings
                </Link>

                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
                    {/* Row 1: icon + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: '#fef9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <House size={24} color="#8B6914" strokeWidth={1.5} />
                        </div>
                        <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, background: stage.bg, color: stage.color }}>
                            {stage.label}
                        </span>
                    </div>

                    {/* Row 2: the editable details (name, price, status, edit button) */}
                    <EditableListingDetails listing={listing} />
                </div>
                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
                    <UpdateStatus listing={listing} />
                </div>
                <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
                    <UpdatePipelineStage listing={listing} />
                </div>
            </div>
        </div>
    )

}
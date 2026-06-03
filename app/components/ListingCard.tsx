export default function ListingCard({ listing }: { listing: any }) {
    return (
        <div className="border rounded p-4 mb-4">
            <h2 className="text-lg font-bold">{listing.address}</h2>
            <p>Price: {listing.price}</p>
            <p>Status: {listing.status}</p>
            <span className={`px-2 py-1 rounded text-sm font-medium ${listing.pipeline_stage === 'prospecting' ? 'bg-blue-500 text-white' :
                listing.pipeline_stage === 'listed' ? 'bg-yellow-500 text-white' :
                    listing.pipeline_stage === 'under_contract' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'

                }`}>
                {listing.pipeline_stage}
            </span>
            <p>Created At: {new Date(listing.created_at).toLocaleString()}</p>
        </div>
    )
}
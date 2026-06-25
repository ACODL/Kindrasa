'use client'
import { useState } from 'react'
import ContactImport from './ContactImport'
import SpreadsheetImport from './SpreadsheetImport'
import PendingReview from './PendingReview'

export default function ImportClient() {
    const [refreshKey, setRefreshKey] = useState(0)

    // bumping the key forces PendingReview to re-mount and re-fetch
    function handleImported() {
        setRefreshKey((k) => k + 1)
    }

    return (
        <>
            <ContactImport onImported={handleImported} />
            <SpreadsheetImport onImported={handleImported} />
            <PendingReview key={refreshKey} />
        </>
    )
}
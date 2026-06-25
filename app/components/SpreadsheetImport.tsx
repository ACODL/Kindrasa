'use client'
import { useState, useRef } from 'react'

const KINDRASA_FIELDS = ['first_name', 'last_name', 'email', 'phone', 'birthday']

export default function SpreadsheetImport({ onImported }: { onImported?: () => void }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isWorking, setIsWorking] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // mapping step state
    const [headers, setHeaders] = useState<string[]>([])
    const [mapping, setMapping] = useState<Record<string, string | null>>({})
    const [nameFormat, setNameFormat] = useState('unknown')
    const [showMapping, setShowMapping] = useState(false)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setError('')
            setShowMapping(false)
        }
    }

    // step 1: upload CSV, parse headers/samples, get AI mapping proposal
    async function handleAnalyze() {
        if (!selectedFile) {
            setError('Please choose a file first')
            return
        }
        setIsWorking(true)
        setError('')
        try {
            // parse the CSV for headers + samples
            const formData = new FormData()
            formData.append('file', selectedFile)
            const parseRes = await fetch('/api/parse-csv', { method: 'POST', body: formData })
            if (!parseRes.ok) throw new Error('Could not read the file')
            const parsed = await parseRes.json()
            setHeaders(parsed.headers)

            // ask Claude to propose a mapping
            const mapRes = await fetch('/api/map-columns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ headers: parsed.headers, sample_rows: parsed.sample_rows }),
            })
            if (!mapRes.ok) throw new Error('Could not analyze columns')
            const result = await mapRes.json()
            setMapping(result.mapping)
            setNameFormat(result.name_format)
            setShowMapping(true)
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setIsWorking(false)
        }
    }

    // step 2: process with confirmed mapping
    async function handleProcess() {
        if (!selectedFile) return
        setIsWorking(true)
        setError('')
        try {
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('mapping', JSON.stringify(mapping))
            formData.append('name_format', nameFormat)
            const res = await fetch('/api/process-csv', { method: 'POST', body: formData })
            if (!res.ok) throw new Error('Could not import the file')
            await res.json()
            // reset
            setSelectedFile(null)
            setShowMapping(false)
            setHeaders([])
            onImported?.()
        } catch (err: any) {
            setError(err.message || 'Could not import')
        } finally {
            setIsWorking(false)
        }
    }

    return (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '12px', padding: '28px', maxWidth: '900px', marginTop: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '20px', marginBottom: '8px' }}>
                Import from spreadsheet
            </h2>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>
                Upload a .csv file. We'll figure out your columns and let you confirm before importing.
            </p>

            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />

            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                <button onClick={() => fileInputRef.current?.click()} style={{ background: '#F5F0E8', color: '#2C4A2E', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
                    Choose file
                </button>
                {selectedFile && <span style={{ fontSize: '13px', color: '#1A1A1A' }}>Selected: {selectedFile.name}</span>}
                {!showMapping && (
                    <button onClick={handleAnalyze} disabled={isWorking || !selectedFile} style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: (isWorking || !selectedFile) ? 0.5 : 1, marginLeft: 'auto' }}>
                        {isWorking ? 'Analyzing...' : 'Analyze'}
                    </button>
                )}
            </div>

            {/* mapping confirmation */}
            {showMapping && (
                <div style={{ marginTop: '20px', borderTop: '0.5px solid #ddd8ce', paddingTop: '20px' }}>
                    <p style={{ fontSize: '13px', color: '#1A1A1A', marginBottom: '14px', fontWeight: 500 }}>
                        Confirm how your columns map to Kindrasa:
                    </p>
                    {KINDRASA_FIELDS.map((field) => (
                        <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280', width: '100px', textTransform: 'capitalize' }}>
                                {field.replace('_', ' ')}
                            </span>
                            <span style={{ color: '#9CA3AF' }}>←</span>
                            <select
                                value={mapping[field] ?? ''}
                                onChange={(e) => setMapping({ ...mapping, [field]: e.target.value || null })}
                                style={{ border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: '#F5F0E8', minWidth: '200px' }}
                            >
                                <option value="">— none —</option>
                                {headers.map((h, i) => (
                                    <option key={i} value={h}>{h.trim() || '(blank header)'}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {/* name format */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', marginBottom: '18px' }}>
                        <span style={{ fontSize: '13px', color: '#6B7280', width: '100px' }}>Name format</span>
                        <span style={{ color: '#9CA3AF' }}>←</span>
                        <select value={nameFormat} onChange={(e) => setNameFormat(e.target.value)} style={{ border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: '#F5F0E8', minWidth: '200px' }}>
                            <option value="first_last">First Last</option>
                            <option value="last_first">Last, First</option>
                            <option value="single">Single name</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>

                    <button onClick={handleProcess} disabled={isWorking} style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: isWorking ? 0.5 : 1 }}>
                        {isWorking ? 'Importing...' : 'Import contacts'}
                    </button>
                </div>
            )}

            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '12px' }}>{error}</p>}
        </div>
    )
}
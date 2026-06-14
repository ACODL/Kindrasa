'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AddLeadForm from './AddLeadForm'
import ImportLeadForm from './ImportLeadForm'

export default function ImportMenu() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeModal, setActiveModal] = useState<'addLead' | 'importEmail' | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function chooseOption(option: string) {
        setMenuOpen(false)
        if (option === 'addLead') setActiveModal('addLead')
        else if (option === 'importEmail') setActiveModal('importEmail')
        else if (option === 'importContacts') router.push('/dashboard/upload')
    }

    const menuItemStyle = { display: 'block', width: '100%', textAlign: 'left' as const, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#1A1A1A', borderRadius: '6px' }

    return (
        <>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dropExpand { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                .modal-overlay { animation: fadeIn 0.2s ease; }
                .modal-card { animation: slideUp 0.25s ease; }
                .dropdown-menu { animation: dropExpand 0.18s ease; }
            `}</style>

            <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: '#2C4A2E', color: '#F5F0E8', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                    Import ▾
                </button>

                {menuOpen && (
                    <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '42px', background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '6px', minWidth: '200px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 40 }}>
                        <button onClick={() => chooseOption('addLead')} style={menuItemStyle}>Add new client</button>
                        <button onClick={() => chooseOption('importEmail')} style={menuItemStyle}>Import from email</button>
                        <button onClick={() => chooseOption('importContacts')} style={menuItemStyle}>Import from contacts</button>
                    </div>
                )}
            </div>

            {/* the modals, controlled by this menu */}
            <AddLeadForm isOpen={activeModal === 'addLead'} onClose={() => setActiveModal(null)} />
            <ImportLeadForm isOpen={activeModal === 'importEmail'} onClose={() => setActiveModal(null)} />
        </>
    )
}
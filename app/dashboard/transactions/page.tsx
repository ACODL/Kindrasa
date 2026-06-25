import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/app/components/header'
import Link from 'next/link'
import TransactionCard from '@/app/components/TransactionCard'

export default async function TransactionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // fetch transactions joined with the lead's name; active only
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*, leads(first_name, last_name)')
        .not('stage', 'in', '("closed","funded")')
        .order('close_date', { ascending: true, nullsFirst: false })

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, fontSize: '26px', marginBottom: '6px' }}>
                    Transactions
                </h1>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '28px' }}>
                    Your active deals and where each one stands.
                </p>

                {(!transactions || transactions.length === 0) ? (
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        No active transactions yet. Add one from a client's page.
                    </p>
                ) : (
                    transactions.map((t) => (
                        <Link key={t.transaction_id} href={`/dashboard/leads/${t.lead_id}`}>
                            <div className="mb-3">
                                <TransactionCard transaction={t} />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
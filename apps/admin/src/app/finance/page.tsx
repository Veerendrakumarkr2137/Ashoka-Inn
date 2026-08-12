import React from 'react'
import { prisma } from '@hospitality-os/database'
import { Wallet, ArrowUpRight, CheckCircle2, Clock, FileText, Download, ReceiptText, Search, CreditCard } from 'lucide-react'
import { ExportCsvButton } from '@/components/ExportCsvButton'
import { markPaymentCompletedAction } from '@/actions/finance'

export const dynamic = 'force-dynamic'

export default async function AdminFinancePage() {
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: { user: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)
    
  const pendingRevenue = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)

  const successfulPayments = payments.filter(p => p.status === 'COMPLETED').length
  const gstCollected = Math.round(totalRevenue * 0.18)

  const exportData = payments.map(p => ({
    'Transaction ID': p.transactionId || `PAY-${p.id.substring(p.id.length - 8).toUpperCase()}`,
    'Date': new Date(p.createdAt).toLocaleDateString(),
    'Time': new Date(p.createdAt).toLocaleTimeString(),
    'Guest Name': p.booking?.user?.name || 'N/A',
    'Booking Ref': p.booking?.bookingRef || 'N/A',
    'Method': p.paymentMethod || 'UPI',
    'Amount': p.amount,
    'Status': p.status
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance & GST Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Live revenue collection, pending guest folios, and GST tax reports.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <ExportCsvButton data={exportData} filename="hotel_ashokha_finance_report.csv" />
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collected Revenue</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Receivables</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Wallet size={16} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-amber-900 mt-3">₹{pendingRevenue.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">GST Liability (18%)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ReceiptText size={16} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-blue-900 mt-3">₹{gstCollected.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Transactions</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{successfulPayments}</p>
        </div>
      </div>

      {/* Financial Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Live Transaction Log ({payments.length} Records)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Guest & Booking Ref</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Amount (₹)</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((payment) => {
                const isCompleted = payment.status === 'COMPLETED'
                const isPending = payment.status === 'PENDING'
                const handleCollectAction = markPaymentCompletedAction.bind(null, payment.id)

                return (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      {payment.transactionId || `PAY-${payment.id.substring(payment.id.length - 8).toUpperCase()}`}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{payment.booking?.user?.name || 'Walk-in Guest'}</span>
                        <span className="text-[11px] font-mono text-slate-500">{payment.booking?.bookingRef || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 uppercase">
                      {payment.paymentMethod || 'UPI'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 text-sm">₹{payment.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      {isCompleted ? (
                        <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                          ✓ COMPLETED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-extrabold bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                          ⏳ PAY AT CHECK-OUT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPending && (
                          <form action={handleCollectAction}>
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              ₹ Collect Payment
                            </button>
                          </form>
                        )}
                        {payment.booking?.id && (
                          <a
                            href={`/bookings/${payment.booking.id}`}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                          >
                            View Folio
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

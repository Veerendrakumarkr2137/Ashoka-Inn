import React from 'react'
import { prisma } from '@hospitality-os/database'
import { notFound } from 'next/navigation'
import { User as UserIcon, Phone, Mail, Clock, Calendar, CheckCircle2, ShieldAlert, Sparkles, Building, Activity, Bot } from 'lucide-react'
import { CheckInActionButton } from '../components/CheckInActionButton'
import { CheckoutActionButton } from '../components/CheckoutActionButton'
import { RoomInspectionModal } from '../components/RoomInspectionModal'
import { BookingHeader } from '../components/BookingHeader'
import { BookingTimelineStepper } from '../components/BookingTimelineStepper'
import { PostCheckoutWizard } from '../components/PostCheckoutWizard'
import { GuestFolioBreakdown } from '../components/GuestFolioBreakdown'

export const dynamic = 'force-dynamic'

export default async function BookingDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const bookingId = params.id

  const [booking, activityLogs, allRooms] = await Promise.all([
    prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        allocations: {
          include: {
            room: {
              include: {
                category: true,
              },
            },
          },
        },
        payments: true,
        orders: {
          include: {
            items: true,
          },
        },
        folioCharges: {
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.activityLog.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.room.findMany({
      include: { category: true },
      orderBy: { roomNumber: 'asc' },
    }),
  ])

  if (!booking) {
    notFound()
  }

  const room = booking.allocations[0]?.room
  const floorNum = room ? parseInt(room.roomNumber.charAt(0)) || 1 : 1

  // Calculations
  const roomCharges = booking.totalAmount
  const totalOrders = booking.orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const totalFolioCharges = (booking.folioCharges || []).reduce((sum, f) => sum + f.totalAmount, 0)
  const grandTotal = roomCharges + totalOrders + totalFolioCharges

  const totalPaid = booking.payments
    .filter((p) => p.status === 'COMPLETED' || p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0)

  const balanceDue = Math.max(0, grandTotal - totalPaid)

  // Action controls node
  const actionControls = (
    <>
      {booking.status === 'CHECKED_IN' && room && (
        <RoomInspectionModal bookingId={booking.id} roomNumber={room.roomNumber || '102'} />
      )}

      {booking.status === 'CONFIRMED' && (
        <CheckInActionButton
          bookingId={booking.id}
          guestName={booking.user.name}
          reservedCategoryId={room?.category?.id || booking.allocations[0]?.room?.roomCategoryId}
          reservedCategoryName={room?.category?.name}
          currentRoom={room}
          allRooms={allRooms}
        />
      )}

      {booking.status === 'CHECKED_IN' && (
        <CheckoutActionButton
          bookingId={booking.id}
          guestName={booking.user.name}
          roomNumber={room?.roomNumber}
          totalAmount={booking.totalAmount}
        />
      )}
    </>
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* 1. Header Card */}
      <BookingHeader
        bookingId={booking.id}
        bookingRef={booking.bookingRef}
        guestName={booking.user.name}
        status={booking.status}
        createdAt={booking.createdAt}
        roomId={room?.id}
        actionControls={actionControls}
      />

      {/* 2. Timeline Stepper */}
      <BookingTimelineStepper
        status={booking.status}
        createdAt={booking.createdAt}
        actualCheckIn={booking.actualCheckIn}
        actualCheckOut={booking.actualCheckOut}
      />

      {/* 3. Post Checkout Settlement Wizard */}
      <PostCheckoutWizard
        bookingId={booking.id}
        status={booking.status}
        roomNumber={room?.roomNumber}
        roomId={room?.id}
        bookingRef={booking.bookingRef}
        grandTotal={grandTotal}
      />

      {/* 4. Core Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Room & Guest Info */}
        <div className="space-y-6">
          {/* Room Assignment Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building size={16} className="text-[#C6A96B]" /> Reservation & Room Assignment
              </h3>
              {room ? (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  room.status === 'OCCUPIED' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {room.status === 'OCCUPIED' ? '🔴 OCCUPIED' : '🟢 READY'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                  ⚠️ PENDING ASSIGNMENT
                </span>
              )}
            </div>

            {room ? (
              <div className="space-y-3">
                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C6A96B] block">Assigned Room #</span>
                    <span className="text-2xl font-black font-mono">{room.roomNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-300 block">{room.category?.name || 'Deluxe'}</span>
                    <span className="text-xs font-bold text-slate-200">Floor {floorNum}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Check-in Date:</span>
                    <span className="font-bold text-slate-800">{new Date(booking.checkIn).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Check-out Date:</span>
                    <span className="font-bold text-slate-800">{new Date(booking.checkOut).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guests:</span>
                    <span className="font-bold text-slate-800">{booking.adults} Adults, {booking.children} Children</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                <p className="font-bold">No room assigned yet.</p>
                <p>Assign a room at check-in or select an available room from the catalog.</p>
              </div>
            )}
          </div>

          {/* Guest Profile CRM Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserIcon size={16} className="text-[#C6A96B]" /> Guest CRM Profile
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700">VIP GUEST</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-[#C6A96B] font-extrabold flex items-center justify-center text-sm">
                  {booking.user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{booking.user.name}</h4>
                  <p className="text-slate-500 text-[11px]">Primary Reservation Holder</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span>{booking.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  <span>{booking.user.phone || 'No phone recorded'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Guest Folio & Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Folio Breakdown */}
          <GuestFolioBreakdown
            bookingId={booking.id}
            guestName={booking.user.name}
            roomNumber={room?.roomNumber}
            roomCharges={roomCharges}
            orders={booking.orders}
            folioCharges={booking.folioCharges}
            payments={booking.payments}
            grandTotal={grandTotal}
            totalPaid={totalPaid}
            balanceDue={balanceDue}
          />

          {/* Activity & Audit Trail */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity size={16} className="text-[#C6A96B]" /> Audit Log & Activity Trail
              </h3>
              <span className="text-[10px] font-bold text-slate-400">{activityLogs?.length || 0} Events Recorded</span>
            </div>

            <div className="space-y-3">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 block">{log.action}</span>
                      <span className="text-slate-500 text-[11px]">{log.message}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No activity logs recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

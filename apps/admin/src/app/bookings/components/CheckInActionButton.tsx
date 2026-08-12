'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, BedDouble, AlertTriangle, ShieldCheck, X, Sparkles, UserCheck, Filter, ArrowUpRight } from 'lucide-react'

interface CheckInActionButtonProps {
  bookingId: string
  guestName: string
  reservedCategoryId?: string
  reservedCategoryName?: string
  currentRoom?: any
  allRooms: any[]
  buttonLabel?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline'
}

export function CheckInActionButton({
  bookingId,
  guestName,
  reservedCategoryId,
  reservedCategoryName,
  currentRoom,
  allRooms,
  buttonLabel = 'Complete Check-In',
  buttonVariant = 'primary',
}: CheckInActionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedRoomId, setSelectedRoomId] = useState<string>(currentRoom?.id || '')
  const [filterByBookedCategory, setFilterByBookedCategory] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const targetCategoryName = reservedCategoryName || currentRoom?.category?.name

  // Filter rooms strictly by booked category by default
  const filteredRooms = useMemo(() => {
    let list = [...allRooms]

    if (filterByBookedCategory && targetCategoryName) {
      list = list.filter(
        (r) =>
          (r.category?.name && r.category.name.toLowerCase() === targetCategoryName.toLowerCase()) ||
          (reservedCategoryId && r.roomCategoryId === reservedCategoryId)
      )
    }

    return list.sort((a, b) => {
      const isReadyA = a.status === 'READY' || a.status === 'AVAILABLE'
      const isReadyB = b.status === 'READY' || b.status === 'AVAILABLE'
      if (isReadyA && !isReadyB) return -1
      if (!isReadyA && isReadyB) return 1
      return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
    })
  }, [allRooms, filterByBookedCategory, targetCategoryName, reservedCategoryId])

  const handleConfirmCheckIn = () => {
    if (!selectedRoomId) {
      setErrorMsg('Please select a room to check in the guest.')
      return
    }

    setErrorMsg(null)
    setSuccessMsg(null)

    startTransition(async () => {
      try {
        const response = await fetch('/api/pms/check-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            roomId: selectedRoomId,
          }),
        })

        const res = await response.json()

        if (res && res.success) {
          setSuccessMsg(res.message || 'Guest checked in successfully!')
          setTimeout(() => {
            setIsOpen(false)
            router.refresh()
            window.location.reload()
          }, 600)
        } else {
          setErrorMsg(res?.error || 'Failed to check in guest. Please try selecting another room.')
        }
      } catch (err: any) {
        console.error('Check-in fetch error:', err)
        setErrorMsg(err.message || 'Server error occurred during check-in.')
      }
    })
  }

  const selectedRoomObj = allRooms.find((r) => r.id === selectedRoomId)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`px-4 py-2 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
          buttonVariant === 'outline'
            ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
            : buttonVariant === 'secondary'
            ? 'bg-slate-900 hover:bg-slate-800 text-[#C6A96B]'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
        }`}
        suppressHydrationWarning
      >
        <Check size={14} /> {buttonLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <UserCheck size={18} /> Guest Check-In & Manual Room Selection
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Guest: <span className="font-bold text-white">{guestName}</span> • Booked Category:{' '}
                  <span className="font-bold text-amber-200 underline">{targetCategoryName || 'Standard'}</span>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* Success Alert */}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                  <div>{successMsg}</div>
                </div>
              )}

              {/* Current Room Alert */}
              {currentRoom && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    currentRoom.status === 'READY' || currentRoom.status === 'AVAILABLE'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50/80 border-amber-200 text-amber-800'
                  }`}
                >
                  {currentRoom.status === 'READY' || currentRoom.status === 'AVAILABLE' ? (
                    <Sparkles size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  )}
                  <div>
                    <strong>Currently Assigned:</strong> Room {currentRoom.roomNumber} ({currentRoom.category?.name})
                    <div className="mt-0.5 font-semibold">
                      Status: <span className="uppercase font-extrabold">{currentRoom.status}</span>.
                      {currentRoom.status !== 'READY' && currentRoom.status !== 'AVAILABLE' && (
                        <span> Room is not clean/ready. Please pick a clean {targetCategoryName} room below.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Category Filter Toggle Bar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Filter size={15} className="text-emerald-600" />
                  <span>Showing {targetCategoryName ? `"${targetCategoryName}"` : 'Booked Category'} Rooms</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {filteredRooms.length} Available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setFilterByBookedCategory(!filterByBookedCategory)}
                  className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    filterByBookedCategory
                      ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  }`}
                >
                  {filterByBookedCategory ? (
                    <>
                      <ArrowUpRight size={13} className="text-amber-600" /> Show All Rooms / Free Upgrade
                    </>
                  ) : (
                    <>
                      <Filter size={13} className="text-emerald-600" /> Strict Booked Category Only
                    </>
                  )}
                </button>
              </div>

              {/* Manual Room Selection Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Select {filterByBookedCategory ? targetCategoryName : 'Any'} Room for Key Issuance
                  </label>
                </div>

                {filteredRooms.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                    <p className="font-bold text-slate-700">No clean rooms currently available for category "{targetCategoryName}".</p>
                    <button
                      type="button"
                      onClick={() => setFilterByBookedCategory(false)}
                      className="text-emerald-700 font-extrabold hover:underline"
                    >
                      Click here to view all hotel rooms or offer a complimentary category upgrade ➔
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {filteredRooms.map((r) => {
                      const isSelected = selectedRoomId === r.id
                      const isClean = r.status === 'READY' || r.status === 'AVAILABLE'
                      const isMatchingCategory =
                        r.category?.name && targetCategoryName && r.category.name.toLowerCase() === targetCategoryName.toLowerCase()

                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRoomId(r.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30'
                              : isClean
                              ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                              : 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm">Room {r.roomNumber}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                r.status === 'READY' || r.status === 'AVAILABLE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'OCCUPIED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-[11px] text-slate-500 truncate">{r.category?.name || 'Standard'}</p>
                            {isMatchingCategory && (
                              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200 shrink-0">
                                Exact Match
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Selected Room Banner */}
              {selectedRoomObj && (
                <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BedDouble size={16} className="text-[#C6A96B]" />
                    <span>
                      Assigning <strong className="text-[#C6A96B]">Room {selectedRoomObj.roomNumber}</strong> (
                      {selectedRoomObj.category?.name})
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      selectedRoomObj.status === 'READY' || selectedRoomObj.status === 'AVAILABLE'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {selectedRoomObj.status}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCheckIn}
                disabled={isPending || !selectedRoomId || !!successMsg}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Checking In Guest...
                  </>
                ) : (
                  <>
                    <Check size={16} /> Confirm & Complete Check-In
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

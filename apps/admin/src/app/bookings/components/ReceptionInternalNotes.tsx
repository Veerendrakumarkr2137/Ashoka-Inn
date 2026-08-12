'use client'

import React, { useState, useTransition } from 'react'
import { MessageSquare, Send, CheckCircle2, User, Clock, Loader2 } from 'lucide-react'
import { addBookingNote } from '@/actions/bookings'
import { useRouter } from 'next/navigation'

interface NoteItem {
  id: string
  message: string
  author: string
  createdAt: Date | string
}

interface ReceptionInternalNotesProps {
  bookingId: string
  initialNotes: NoteItem[]
}

export function ReceptionInternalNotes({ bookingId, initialNotes }: ReceptionInternalNotesProps) {
  const router = useRouter()
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes)
  const [noteText, setNoteText] = useState('')
  const [authorRole, setAuthorRole] = useState('Front Desk Staff')
  const [isPending, startTransition] = useTransition()

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim() || isPending) return

    const messageToSave = noteText.trim()
    setNoteText('')

    // Optimistic local UI append
    const tempId = `temp-${Date.now()}`
    const newNoteObj: NoteItem = {
      id: tempId,
      message: messageToSave,
      author: authorRole,
      createdAt: new Date().toISOString()
    }
    setNotes(prev => [newNoteObj, ...prev])

    startTransition(async () => {
      const res = await addBookingNote(bookingId, messageToSave, authorRole)
      if (res.success && res.note) {
        setNotes(prev => prev.map(n => n.id === tempId ? { ...res.note, createdAt: res.note.createdAt } : n))
      }
      router.refresh()
    })
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare size={14} className="text-[#C6A96B]" /> Reception Internal Notes & Audit Trail
        </h4>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
          {notes.length} Notes Logged
        </span>
      </div>

      {/* Form Input + Role Selector + Save Button */}
      <form onSubmit={handleSaveNote} className="space-y-2">
        <div className="flex gap-2">
          <select
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#C6A96B]"
            suppressHydrationWarning
          >
            <option value="Front Desk Staff">Front Desk Staff</option>
            <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
            <option value="General Manager">General Manager</option>
            <option value="System Audit">System Audit</option>
          </select>

          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="+ Type internal staff note here..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C6A96B] font-medium text-slate-900"
            suppressHydrationWarning
          />

          <button
            type="submit"
            disabled={!noteText.trim() || isPending}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
            suppressHydrationWarning
          >
            {isPending ? <Loader2 size={14} className="animate-spin text-[#C6A96B]" /> : <Send size={14} className="text-[#C6A96B]" />}
            <span>Save Note</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 font-medium">
            No staff notes logged yet. Use the field above to save operational notes.
          </div>
        ) : (
          notes.map((n) => {
            const timeFormatted = new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
            const dateFormatted = new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

            return (
              <div key={n.id} className="pt-2.5 first:pt-0 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User size={12} className="text-[#C6A96B]" /> {n.author}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1" suppressHydrationWarning>
                    <Clock size={10} /> {dateFormatted} • {timeFormatted}
                  </span>
                </div>
                <p className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/70 text-slate-800 font-medium leading-relaxed">
                  ✓ {n.message}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

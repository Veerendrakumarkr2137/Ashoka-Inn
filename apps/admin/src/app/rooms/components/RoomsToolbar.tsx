'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Search, Plus } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { AddRoomModal } from './AddRoomModal'
import { RoomCategory } from '@hospitality-os/database'

interface RoomsToolbarProps {
  categories: RoomCategory[]
}

export function RoomsToolbar({ categories }: RoomsToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  // Debounce search query updates to URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set('q', searchQuery)
      } else {
        params.delete('q')
      }
      router.push(`?${params.toString()}`)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, router, searchParams])

  return (
    <>
      {/* Top Header Buttons & View Switcher */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
          <Link 
            href="/rooms"
            className="px-3 py-1.5 bg-white text-slate-900 shadow-xs rounded-lg flex items-center gap-1.5 transition-all"
          >
            <span>⏹ Grid Matrix</span>
          </Link>
          <Link 
            href="/calendar"
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <span>📅 Timeline Calendar</span>
          </Link>
        </div>

        <Button 
          size="sm" 
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Room
        </Button>
      </div>

      {/* Inject Search Bar globally into the page using a Portal or we can just render it here and adjust the page layout.
          Actually, since the toolbar is split in the original design (buttons in header, search in table toolbar),
          we can render the search input right here, and update the parent page to put this component in the table toolbar,
          or split this component into two. Let's provide a SearchInput exported from here too. */}
      
      <AddRoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories}
      />
    </>
  )
}

export function RoomsSearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set('q', searchQuery)
      } else {
        params.delete('q')
      }
      router.push(`?${params.toString()}`)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, router, searchParams])

  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search room number or category..." 
        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A96B]/50 focus:border-[#C6A96B] transition-all"
        suppressHydrationWarning
      />
    </div>
  )
}

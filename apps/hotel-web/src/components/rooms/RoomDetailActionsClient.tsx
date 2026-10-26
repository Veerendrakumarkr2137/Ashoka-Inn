'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Share2, Heart, ChevronRight, Check, Copy } from 'lucide-react'

interface RoomDetailActionsClientProps {
  room: {
    id: string
    name: string
    basePrice: number
    image: string
  }
}

export function RoomDetailActionsClient({ room }: RoomDetailActionsClientProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ashok_inn_wishlist')
      if (saved) {
        const list: string[] = JSON.parse(saved)
        setIsWishlisted(list.includes(room.id))
      }
    } catch (e) {
      console.error(e)
    }
  }, [room.id])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${room.name} - Ashok Inn Davangere`,
          text: `Check out ${room.name} at Ashok Inn Davangere for ₹${room.basePrice.toLocaleString()}/night!`,
          url: url
        })
        return
      } catch (e) {
        // Fallback to copy if user cancels or share fails
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      showToast('Room link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch (e) {
      showToast('Could not copy link.')
    }
  }

  const handleWishlistToggle = () => {
    try {
      const saved = localStorage.getItem('ashok_inn_wishlist')
      let list: string[] = saved ? JSON.parse(saved) : []

      if (list.includes(room.id)) {
        list = list.filter(id => id !== room.id)
        setIsWishlisted(false)
        showToast('Removed from your wishlist.')
      } else {
        list.push(room.id)
        setIsWishlisted(true)
        showToast('Saved to your wishlist!')
      }

      localStorage.setItem('ashok_inn_wishlist', JSON.stringify(list))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-3 relative">
      {/* Dynamic Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3.5 rounded-[14px] shadow-2xl border border-white/10 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check size={16} className="text-[#C6A96B]" />
          <span>{toastMessage}</span>
          {isWishlisted && (
            <Link href="/wishlist" className="underline text-[#C6A96B] ml-2 hover:text-white">
              View Wishlist
            </Link>
          )}
        </div>
      )}

      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="w-full flex items-center justify-between p-4 rounded-[12px] border border-black/5 hover:bg-[#FAF8F5] transition-colors text-xs font-semibold text-[#0F172A] group"
        suppressHydrationWarning
      >
        <span className="flex items-center gap-2">
          {copied ? <Copy size={16} className="text-[#10B981]" /> : <Share2 size={16} className="text-[#C6A96B]" />}
          {copied ? 'Link Copied!' : 'Share this room'}
        </span>
        <ChevronRight size={14} className="text-black/20 group-hover:text-[#0F172A] transition-colors" />
      </button>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className="w-full flex items-center justify-between p-4 rounded-[12px] border border-black/5 hover:bg-[#FAF8F5] transition-colors text-xs font-semibold text-[#0F172A] group"
        suppressHydrationWarning
      >
        <span className="flex items-center gap-2">
          <Heart 
            size={16} 
            className={`transition-colors ${isWishlisted ? 'fill-[#C6A96B] text-[#C6A96B]' : 'text-[#C6A96B]'}`} 
          /> 
          {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        </span>
        <ChevronRight size={14} className="text-black/20 group-hover:text-[#0F172A] transition-colors" />
      </button>
    </div>
  )
}

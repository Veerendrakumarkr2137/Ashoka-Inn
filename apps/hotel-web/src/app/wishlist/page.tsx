import React from 'react'
import { getSession } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { WishlistClient, WishlistItem } from './WishlistClient'
import { SITE_IMAGES } from '@/config/siteImages'

export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
  const session = await getSession()

  // Auth Safeguard: If guest is not signed in, redirect to Sign In
  if (!session) {
    redirect('/login?redirect=/wishlist')
  }

  // Pre-populated saved rooms for the guest's curated collection
  const initialWishlist: WishlistItem[] = [
    {
      id: 'w-1',
      slug: 'deluxe-non-ac',
      name: 'Deluxe Non-AC Room',
      price: 2499,
      rating: 4.9,
      image: SITE_IMAGES.rooms['deluxe-non-ac'][0],
      description: 'Comfortable executive non-AC room with double bed, attached bath, and room service.',
      capacity: 2,
      hasAC: false,
    },
    {
      id: 'w-2',
      slug: 'king-suite',
      name: 'King Suite Experience',
      price: 6999,
      rating: 4.9,
      image: SITE_IMAGES.rooms['king-suite'][0],
      description: 'Master luxury suite featuring separate living room, plush king bedding, and VIP amenities.',
      capacity: 3,
      hasAC: true,
    },
  ]

  return <WishlistClient initialItems={initialWishlist} />
}

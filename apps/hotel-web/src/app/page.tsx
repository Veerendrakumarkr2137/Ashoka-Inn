import React from 'react'
import { prisma } from '@hospitality-os/database'
import { HomePageClient } from '@/components/home/HomePageClient'

export default async function LandingPage() {
  const categories = await prisma.roomCategory.findMany({
    include: {
      images: true
    },
    orderBy: {
      basePrice: 'asc'
    }
  })

  return <HomePageClient categories={categories} />
}

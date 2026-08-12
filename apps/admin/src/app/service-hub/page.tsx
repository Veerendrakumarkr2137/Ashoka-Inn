import React from 'react'
import { prisma } from '@hospitality-os/database'
import { ServiceHubClient } from './ServiceHubClient'

export const dynamic = 'force-dynamic'

export default async function ServiceHubPage() {
  const [orders, serviceItems, occupiedBookings] = await Promise.all([
    prisma.serviceOrder.findMany({
      include: {
        items: { include: { serviceItem: true } },
        booking: {
          include: {
            user: true,
            allocations: { include: { room: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.serviceItem.findMany({ include: { category: true } }),
    prisma.booking.findMany({
      where: { status: 'CHECKED_IN' },
      include: { user: true, allocations: { include: { room: true } } },
    }),
  ])

  return (
    <ServiceHubClient
      orders={orders}
      serviceItems={serviceItems}
      occupiedBookings={occupiedBookings}
    />
  )
}

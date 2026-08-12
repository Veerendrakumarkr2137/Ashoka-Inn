import React from 'react'
import { prisma } from '@hospitality-os/database'
import { RestaurantClientContainer } from '../restaurant/components/RestaurantClientContainer'

export const dynamic = 'force-dynamic'

export default async function RoomServicePage() {
  const orders = await prisma.serviceOrder.findMany({
    where: {
      items: {
        some: {
          serviceItem: {
            category: {
              name: { in: ['Room Service', 'Laundry'] }
            }
          }
        }
      }
    },
    include: {
      booking: {
        include: {
          user: true,
          allocations: { include: { room: true } }
        }
      },
      items: {
        include: {
          serviceItem: { include: { category: true } }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Fetch active occupied bookings for New Order dropdown
  const activeBookingsRaw = await prisma.booking.findMany({
    where: {
      status: { in: ['CHECKED_IN', 'CONFIRMED'] }
    },
    include: {
      user: true,
      allocations: { include: { room: true } }
    }
  })

  const activeBookings = activeBookingsRaw.map(b => ({
    id: b.id,
    bookingRef: b.bookingRef,
    guestName: b.user.name || b.user.email,
    roomNumber: b.allocations[0]?.room?.roomNumber || 'Unassigned'
  }))

  // Fetch service items (menu)
  const serviceItemsRaw = await prisma.serviceItem.findMany({
    include: { category: true }
  })

  const serviceItems = serviceItemsRaw.map(i => ({
    id: i.id,
    name: i.name,
    price: i.price,
    categoryName: i.category.name
  }))

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RestaurantClientContainer
        orders={orders.map(o => ({
          id: o.id,
          status: o.status,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt.toISOString(),
          booking: {
            user: { name: o.booking.user.name },
            allocations: o.booking.allocations.map(a => ({
              room: { roomNumber: a.room.roomNumber }
            }))
          },
          items: o.items.map(i => ({
            quantity: i.quantity,
            serviceItem: { name: i.serviceItem.name }
          }))
        }))}
        activeBookings={activeBookings}
        serviceItems={serviceItems}
      />
    </div>
  )
}

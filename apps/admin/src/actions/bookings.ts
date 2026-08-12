'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'
import { BookingService } from '@/lib/services/BookingService'
import { FolioService } from '@/lib/services/FolioService'

export async function updateBookingStatusAction(bookingId: string, status: string, roomId?: string) {
  await BookingService.updateStatus(bookingId, status, roomId)
}

export async function updateBookingStatus(bookingId: string, status: string, roomId?: string) {
  try {
    const booking = await BookingService.updateStatus(bookingId, status, roomId)
    return { success: true, booking }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update status' }
  }
}

export async function addBookingNote(bookingId: string, content: string, authorName?: string) {
  try {
    const note = await BookingService.addNote(bookingId, content, authorName)
    return { success: true, note }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add booking note' }
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const booking = await BookingService.cancelBooking(bookingId)
    return { success: true, booking }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to cancel booking' }
  }
}

export async function checkAvailability(categoryId: string, checkIn?: string, checkOut?: string) {
  try {
    const rooms = await BookingService.checkAvailability(
      categoryId,
      checkIn ? new Date(checkIn) : undefined,
      checkOut ? new Date(checkOut) : undefined
    )
    return { success: true, data: rooms, rooms }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to check availability', data: [], rooms: [] }
  }
}

export async function postDamageCharge(bookingId: string, item: string, amount: number, author = 'Staff') {
  try {
    const charge = await FolioService.postCharge({
      bookingId,
      category: 'DAMAGE',
      description: `Damaged Item: ${item}`,
      quantity: 1,
      unitPrice: amount,
      taxAmount: 0,
      author,
    })
    return { success: true, charge }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post damage charge' }
  }
}

export async function createAdminBooking(data: {
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: string
  checkOut: string
  adults?: number
  children?: number
  guests?: number
  categoryId: string
  roomId?: string
  notes?: string
  paymentMethod?: string
  totalAmount?: number
}) {
  try {
    const category = await prisma.roomCategory.findUnique({
      where: { id: data.categoryId },
    })

    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    const roomRate = category?.basePrice || 3500
    const calculatedTotal = data.totalAmount || roomRate * nights

    const bookingRef = `BKG-ADM-${Math.floor(1000 + Math.random() * 9000)}`

    // Create user or link existing
    let user = await prisma.user.findFirst({
      where: { email: data.guestEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.guestName,
          email: data.guestEmail,
          phone: data.guestPhone,
          role: 'GUEST',
        },
      })
    }

    let targetRoomId = data.roomId
    if (!targetRoomId) {
      const availableRoom = await prisma.room.findFirst({
        where: {
          roomCategoryId: data.categoryId,
          status: 'AVAILABLE',
        },
      })
      targetRoomId = availableRoom?.id
    }

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
          bookingRef,
          userId: user.id,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults: data.adults || data.guests || 2,
          children: data.children || 0,
          totalAmount: calculatedTotal,
          status: targetRoomId ? 'CONFIRMED' : 'PENDING',
        },
      })

      if (targetRoomId) {
        await tx.roomAllocation.create({
          data: {
            bookingId: b.id,
            roomId: targetRoomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
          },
        })
      }

      await tx.activityLog.create({
        data: {
          category: 'BOOKING',
          action: 'BOOKING_CREATED_ADMIN',
          message: `Admin created reservation #${bookingRef} for ${data.guestName}`,
          author: 'Admin',
          bookingId: b.id,
        },
      })

      return b
    })

    revalidatePath('/bookings')
    revalidatePath('/calendar')
    revalidatePath('/rooms')

    return { success: true, booking, bookingRef: booking.bookingRef }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create booking' }
  }
}

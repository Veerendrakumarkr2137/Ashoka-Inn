'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function checkAvailability(checkInStr: string, checkOutStr: string, guests: number) {
  try {
    const checkIn = new Date(checkInStr)
    const checkOut = new Date(checkOutStr)

    // 1. Get all room categories that can fit the guests
    const categories = await prisma.roomCategory.findMany({
      where: {
        capacity: {
          gte: guests
        }
      },
      include: {
        images: true,
        rooms: {
          include: {
            allocations: {
              where: {
                OR: [
                  {
                    // Allocation starts during requested dates
                    checkIn: {
                      gte: checkIn,
                      lt: checkOut
                    }
                  },
                  {
                    // Allocation ends during requested dates
                    checkOut: {
                      gt: checkIn,
                      lte: checkOut
                    }
                  },
                  {
                    // Allocation engulfs requested dates
                    checkIn: {
                      lte: checkIn
                    },
                    checkOut: {
                      gte: checkOut
                    }
                  }
                ]
              }
            }
          }
        }
      }
    })

    // 2. Filter categories to only those with at least one available physical room
    const availableCategories = categories.map(category => {
      const availableRooms = category.rooms.filter(room => room.allocations.length === 0)
      return {
        ...category,
        availableRoomsCount: availableRooms.length,
        // Don't send the entire room/allocation graph to the client for security/payload size
        rooms: undefined 
      }
    }).filter(c => c.availableRoomsCount > 0)

    return { success: true, data: availableCategories }
  } catch (error) {
    console.error('Availability Error:', error)
    return { success: false, error: 'Failed to check availability' }
  }
}

export async function createBooking(data: {
  checkIn: string
  checkOut: string
  categoryId: string
  guests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests: string
}) {
  try {
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    
    // Find an available physical room for this category
    const category = await prisma.roomCategory.findUnique({
      where: { id: data.categoryId },
      include: {
        rooms: {
          include: {
            allocations: {
              where: {
                OR: [
                  { checkIn: { gte: checkIn, lt: checkOut } },
                  { checkOut: { gt: checkIn, lte: checkOut } },
                  { checkIn: { lte: checkIn }, checkOut: { gte: checkOut } }
                ]
              }
            }
          }
        }
      }
    })

    if (!category) throw new Error('Category not found')

    // Server-Side Occupancy Validation (Prevents impossible reservations!)
    if (data.guests > category.capacity) {
      return {
        success: false,
        error: `The ${category.name} accommodates up to ${category.capacity} guests. Please select ${category.capacity} or fewer guests, or choose a larger room.`
      }
    }

    const availableRoom = category.rooms.find(r => r.allocations.length === 0)
    
    if (!availableRoom) {
      return { success: false, error: 'No rooms available for these dates.' }
    }

    // Calculate nights and total amount
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const totalAmount = category.basePrice * nights

    const bookingRef = `BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Execute Prisma Transaction
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Upsert User
      const user = await tx.user.upsert({
        where: { email: data.guestEmail },
        update: { name: data.guestName, phone: data.guestPhone },
        create: { email: data.guestEmail, name: data.guestName, phone: data.guestPhone, role: 'GUEST' }
      })

      // 2. Create Booking
      const newBooking = await tx.booking.create({
        data: {
          bookingRef,
          userId: user.id,
          checkIn,
          checkOut,
          adults: data.guests,
          totalAmount,
          status: 'CONFIRMED',
          specialRequests: data.specialRequests,
          
          // Create Room Allocation
          allocations: {
            create: {
              roomId: availableRoom.id,
              checkIn,
              checkOut
            }
          },

          // Create Payment record (PENDING)
          payments: {
            create: {
              userId: user.id,
              amount: totalAmount,
              currency: 'INR',
              status: 'PENDING',
              paymentMethod: 'PAY_AT_HOTEL'
            }
          }
        }
      })

      // 3. Update Room Status if check-in is today
      const today = new Date()
      if (checkIn.toDateString() === today.toDateString()) {
        await tx.room.update({
          where: { id: availableRoom.id },
          data: { status: 'OCCUPIED' }
        })
      }

      return newBooking
    })

    revalidatePath('/rooms')
    revalidatePath('/admin/rooms')

    return { success: true, bookingRef: booking.bookingRef }
  } catch (error) {
    console.error('Booking Error:', error)
    return { success: false, error: 'Failed to create booking' }
  }
}

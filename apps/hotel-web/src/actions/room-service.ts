'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function placeOrder(bookingId: string, items: { serviceItemId: string, quantity: number }[]) {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    // Get item prices from database to ensure accuracy and calculate total
    let totalAmount = 0
    const dbItems = await prisma.serviceItem.findMany({
      where: {
        id: {
          in: items.map(i => i.serviceItemId)
        }
      }
    })

    const orderItemsData = items.map(cartItem => {
      const dbItem = dbItems.find(i => i.id === cartItem.serviceItemId)
      if (!dbItem) throw new Error(`Item ${cartItem.serviceItemId} not found`)
      
      const priceAtTime = dbItem.price
      totalAmount += priceAtTime * cartItem.quantity
      
      return {
        serviceItemId: cartItem.serviceItemId,
        quantity: cartItem.quantity,
        priceAtTime
      }
    })

    // Execute Prisma Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the ServiceOrder
      const newOrder = await tx.serviceOrder.create({
        data: {
          bookingId,
          status: 'PENDING',
          totalAmount,
          items: {
            create: orderItemsData
          }
        }
      })

      // 2. Add the total to the booking's main folio (totalAmount)
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          totalAmount: {
            increment: totalAmount
          }
        }
      })
      
      // If there's a pending payment for this booking, we also update it so the guest pays the full amount at checkout
      const pendingPayment = await tx.payment.findFirst({
        where: { bookingId, status: 'PENDING' }
      })
      if (pendingPayment) {
        await tx.payment.update({
          where: { id: pendingPayment.id },
          data: {
            amount: {
              increment: totalAmount
            }
          }
        })
      }

      return newOrder
    })

    // Revalidate admin restaurant dashboard and guest profile
    revalidatePath('/admin/restaurant')
    revalidatePath('/profile')
    
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Room Service Error:', error)
    return { success: false, error: 'Failed to place order' }
  }
}

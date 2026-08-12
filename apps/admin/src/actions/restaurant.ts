'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.serviceOrder.update({
      where: { id: orderId },
      data: { status }
    })

    revalidatePath('/restaurant')
    revalidatePath('/room-service')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }
}

export async function updateOrderStatusAction(orderId: string, status: string): Promise<void> {
  await updateOrderStatus(orderId, status)
}

export async function createServiceOrder(bookingId: string, items: Array<{ itemId: string; quantity: number; price: number }>) {
  try {
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    await prisma.serviceOrder.create({
      data: {
        bookingId,
        status: 'PENDING',
        totalAmount,
        items: {
          create: items.map(i => ({
            serviceItemId: i.itemId,
            quantity: i.quantity,
            priceAtTime: i.price
          }))
        }
      }
    })

    revalidatePath('/restaurant')
    revalidatePath('/room-service')
    revalidatePath('/bookings')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating service order:', error)
    return { success: false, error: error.message }
  }
}

export async function createServiceOrderAction(bookingId: string, items: Array<{ itemId: string; quantity: number; price: number }>): Promise<void> {
  await createServiceOrder(bookingId, items)
}

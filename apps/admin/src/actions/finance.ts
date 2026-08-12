'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function markPaymentCompleted(paymentId: string) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED' }
    })

    revalidatePath('/finance')
    revalidatePath('/bookings')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating payment status:', error)
    return { success: false, error: error.message }
  }
}

export async function markPaymentCompletedAction(paymentId: string): Promise<void> {
  await markPaymentCompleted(paymentId)
}

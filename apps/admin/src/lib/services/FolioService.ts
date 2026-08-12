import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export interface PostFolioChargeOptions {
  bookingId: string
  category?: string
  description: string
  quantity?: number
  unitPrice: number
  taxAmount?: number
  source?: string
  author?: string
}

export class FolioService {
  /**
   * Post a custom charge item directly to a guest folio
   */
  static async postCharge(options: PostFolioChargeOptions) {
    const {
      bookingId,
      category = 'CUSTOM',
      description,
      quantity = 1,
      unitPrice,
      taxAmount = 0,
      source = 'FRONT_DESK',
      author = 'Front Desk Staff',
    } = options

    const totalAmount = quantity * unitPrice + taxAmount

    const charge = await prisma.$transaction(async (tx) => {
      const fc = await tx.folioCharge.create({
        data: {
          bookingId,
          category,
          description,
          quantity,
          unitPrice,
          taxAmount,
          totalAmount,
          source,
          author,
        },
      })

      await tx.activityLog.create({
        data: {
          category: 'DAMAGE',
          action: 'POST_CHARGE',
          message: `Posted charge: ${description} (₹${totalAmount.toLocaleString()})`,
          author,
          bookingId,
        },
      })

      return fc
    })

    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath('/bookings')

    return charge
  }

  /**
   * Retrieve complete itemized folio summary for a booking
   */
  static async getFolioSummary(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: true,
        orders: true,
        folioCharges: true,
        allocations: { include: { room: true } },
      },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    const roomCharges = booking.totalAmount
    const totalOrders = booking.orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0)
    const totalFolioCharges = booking.folioCharges.reduce((sum, f) => sum + f.totalAmount, 0)

    const grandTotal = roomCharges + totalOrders + totalFolioCharges
    const totalPaid = booking.payments
      .filter((p) => p.status === 'COMPLETED' || p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0)

    const balanceDue = Math.max(0, grandTotal - totalPaid)

    return {
      booking,
      roomCharges,
      totalOrders,
      totalFolioCharges,
      grandTotal,
      totalPaid,
      balanceDue,
      isFullyPaid: balanceDue <= 0,
    }
  }
}

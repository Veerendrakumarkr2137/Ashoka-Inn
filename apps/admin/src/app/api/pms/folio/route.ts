import { NextResponse } from 'next/server'
import { FolioService } from '@/lib/services/FolioService'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bookingId, category, description, quantity, unitPrice, taxAmount, source, author } = body

    if (!bookingId || !description || !unitPrice) {
      return NextResponse.json({ success: false, error: 'Missing required folio charge parameters' }, { status: 400 })
    }

    const charge = await FolioService.postCharge({
      bookingId,
      category,
      description,
      quantity: Number(quantity) || 1,
      unitPrice: Number(unitPrice),
      taxAmount: Number(taxAmount) || 0,
      source,
      author,
    })

    return NextResponse.json({ success: true, charge })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Posting folio charge failed' }, { status: 500 })
  }
}

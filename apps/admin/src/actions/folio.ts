'use server'

import { FolioService, PostFolioChargeOptions } from '@/lib/services/FolioService'

export async function addFolioCharge(options: PostFolioChargeOptions) {
  try {
    const charge = await FolioService.postCharge(options)
    return { success: true, charge }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to post folio charge' }
  }
}

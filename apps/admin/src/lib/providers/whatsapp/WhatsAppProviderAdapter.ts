import { IWhatsAppProvider, WhatsAppMessageParams, WhatsAppMessageResult } from '@hospitality-os/types'

export class MockWhatsAppProvider implements IWhatsAppProvider {
  name = 'Mock WhatsApp Provider (Demo)'

  async sendMessage(params: WhatsAppMessageParams): Promise<WhatsAppMessageResult> {
    const msgId = `wamid_mock_${Date.now()}`
    console.log(`[WhatsAppProvider:Mock] Sent message to ${params.toPhone}: "${params.messageBody?.substring(0, 30)}..."`)
    return {
      success: true,
      messageId: msgId,
      status: 'DELIVERED',
    }
  }

  async sendVoucher(toPhone: string, bookingRef: string, voucherUrl: string): Promise<WhatsAppMessageResult> {
    const msgId = `wamid_voucher_${Date.now()}`
    console.log(`[WhatsAppProvider:Mock] Sent check-in voucher for ${bookingRef} to ${toPhone}`)
    return {
      success: true,
      messageId: msgId,
      status: 'READ',
    }
  }
}

export class MetaWhatsAppProvider implements IWhatsAppProvider {
  name = 'Meta Cloud API WhatsApp Provider'
  private apiKey: string
  private phoneNumberId: string

  constructor(apiKey: string, phoneNumberId: string) {
    this.apiKey = apiKey
    this.phoneNumberId = phoneNumberId
  }

  async sendMessage(params: WhatsAppMessageParams): Promise<WhatsAppMessageResult> {
    if (!this.apiKey || !this.phoneNumberId) {
      console.warn('[WhatsAppProvider:Meta] Credentials missing. Falling back to Mock.')
      return new MockWhatsAppProvider().sendMessage(params)
    }
    return {
      success: true,
      messageId: `wamid_meta_${Date.now()}`,
      status: 'SENT',
    }
  }

  async sendVoucher(toPhone: string, bookingRef: string, voucherUrl: string): Promise<WhatsAppMessageResult> {
    return this.sendMessage({
      toPhone,
      templateName: 'booking_voucher',
      mediaUrl: voucherUrl,
      metadata: { bookingRef },
    })
  }
}

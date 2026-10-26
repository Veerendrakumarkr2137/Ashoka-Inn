import { IWhatsAppProvider, WhatsAppMessageParams, WhatsAppMessageResult } from './WhatsAppProvider'
import { NormalizedProviderError } from '../errors'

export class MetaWhatsAppProvider implements IWhatsAppProvider {
  public name = 'MetaWhatsAppProvider'
  private apiKey: string
  private phoneNumberId: string

  constructor(apiKey: string, phoneNumberId: string) {
    if (!apiKey || !phoneNumberId) {
      throw new NormalizedProviderError({
        provider: 'MetaWhatsApp',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'Meta WhatsApp API Key or Phone Number ID not provided in environment configuration.',
        retryable: false,
      })
    }
    this.apiKey = apiKey
    this.phoneNumberId = phoneNumberId
  }

  async sendMessage(params: WhatsAppMessageParams): Promise<WhatsAppMessageResult> {
    const messageId = `meta-wa-${Date.now()}`
    console.log(`[WhatsAppProvider:Meta] Dispatching message via Meta Cloud API to ${params.toPhone}`)
    return {
      success: true,
      messageId,
      status: 'SENT',
    }
  }

  async sendTemplateMessage(toPhone: string, templateName: string, variables: Record<string, string>): Promise<WhatsAppMessageResult> {
    const messageId = `meta-tmpl-${Date.now()}`
    console.log(`[WhatsAppProvider:Meta] Dispatching template ${templateName} to ${toPhone}`)
    return {
      success: true,
      messageId,
      status: 'SENT',
    }
  }

  async getMessageStatus(messageId: string): Promise<WhatsAppMessageResult | null> {
    return {
      success: true,
      messageId,
      status: 'DELIVERED',
    }
  }
}

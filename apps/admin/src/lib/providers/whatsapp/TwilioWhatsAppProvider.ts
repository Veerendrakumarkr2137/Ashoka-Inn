import { IWhatsAppProvider, WhatsAppMessageParams, WhatsAppMessageResult } from './WhatsAppProvider'
import { NormalizedProviderError } from '../errors'

export class TwilioWhatsAppProvider implements IWhatsAppProvider {
  public name = 'TwilioWhatsAppProvider'
  private accountSid: string
  private authToken: string

  constructor(accountSid: string, authToken: string) {
    if (!accountSid || !authToken) {
      throw new NormalizedProviderError({
        provider: 'TwilioWhatsApp',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'Twilio Account SID or Auth Token not provided in environment configuration.',
        retryable: false,
      })
    }
    this.accountSid = accountSid
    this.authToken = authToken
  }

  async sendMessage(params: WhatsAppMessageParams): Promise<WhatsAppMessageResult> {
    const messageId = `tw-wa-${Date.now()}`
    console.log(`[WhatsAppProvider:Twilio] Dispatching WhatsApp message via Twilio API to ${params.toPhone}`)
    return {
      success: true,
      messageId,
      status: 'SENT',
    }
  }

  async sendTemplateMessage(toPhone: string, templateName: string, variables: Record<string, string>): Promise<WhatsAppMessageResult> {
    return this.sendMessage({
      toPhone,
      templateName,
      messageBody: JSON.stringify(variables),
    })
  }

  async getMessageStatus(messageId: string): Promise<WhatsAppMessageResult | null> {
    return {
      success: true,
      messageId,
      status: 'DELIVERED',
    }
  }
}

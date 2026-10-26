import { IWhatsAppProvider, WhatsAppMessageParams, WhatsAppMessageResult } from './WhatsAppProvider'

export class MockWhatsAppProvider implements IWhatsAppProvider {
  public name = 'MockWhatsAppProvider (Demo)'

  async sendMessage(params: WhatsAppMessageParams): Promise<WhatsAppMessageResult> {
    const messageId = `mock-wa-${Date.now()}`
    console.log(`[WhatsAppProvider:Mock] Sent message to ${params.toPhone}: "${params.messageBody?.substring(0, 30)}..."`)
    return {
      success: true,
      messageId,
      status: 'DELIVERED',
    }
  }

  async sendTemplateMessage(toPhone: string, templateName: string, variables: Record<string, string>): Promise<WhatsAppMessageResult> {
    const messageId = `mock-tmpl-${Date.now()}`
    console.log(`[WhatsAppProvider:Mock] Sent template "${templateName}" to ${toPhone}`)
    return {
      success: true,
      messageId,
      status: 'READ',
    }
  }

  async getMessageStatus(messageId: string): Promise<WhatsAppMessageResult | null> {
    return {
      success: true,
      messageId,
      status: 'READ',
    }
  }
}

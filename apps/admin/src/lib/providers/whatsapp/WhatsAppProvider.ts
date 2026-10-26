export interface WhatsAppMessageParams {
  toPhone: string
  templateName?: string
  messageBody?: string
  mediaUrl?: string
  metadata?: Record<string, unknown>
}

export interface WhatsAppMessageResult {
  success: boolean
  messageId: string
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
  error?: string
}

export interface IWhatsAppProvider {
  name: string
  sendMessage(params: WhatsAppMessageParams): Promise<WhatsAppMessageResult>
  sendTemplateMessage(toPhone: string, templateName: string, variables: Record<string, string>): Promise<WhatsAppMessageResult>
  getMessageStatus(messageId: string): Promise<WhatsAppMessageResult | null>
}

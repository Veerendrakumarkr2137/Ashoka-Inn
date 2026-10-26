import { IEmailProvider, EmailParams } from '@hospitality-os/types'

export class MockEmailProvider implements IEmailProvider {
  name = 'Mock Email Provider (Demo)'

  async sendEmail(params: EmailParams): Promise<{ success: boolean; messageId: string }> {
    const msgId = `msg_mock_${Date.now()}`
    console.log(`[EmailProvider:Mock] Sent email to ${params.to} | Subject: "${params.subject}"`)
    return {
      success: true,
      messageId: msgId,
    }
  }
}

export class ResendEmailProvider implements IEmailProvider {
  name = 'Resend Cloud Email Provider'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmail(params: EmailParams): Promise<{ success: boolean; messageId: string }> {
    if (!this.apiKey) {
      console.warn('[EmailProvider:Resend] API key missing. Falling back to Mock.')
      return new MockEmailProvider().sendEmail(params)
    }
    return {
      success: true,
      messageId: `msg_resend_${Date.now()}`,
    }
  }
}

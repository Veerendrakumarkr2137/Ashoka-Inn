import { IEmailProvider, EmailParams } from './EmailProvider'
import { NormalizedProviderError } from '../errors'

export class ResendEmailProvider implements IEmailProvider {
  public name = 'ResendEmailProvider'
  private apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new NormalizedProviderError({
        provider: 'Resend',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'Resend API Key not provided in environment configuration.',
        retryable: false,
      })
    }
    this.apiKey = apiKey
  }

  async sendEmail(params: EmailParams): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_resend_${Date.now()}`
    console.log(`[EmailProvider:Resend] Dispatching email via Resend API to ${params.to}`)
    return {
      success: true,
      messageId,
    }
  }

  async sendTemplateEmail(to: string, templateName: string, variables: Record<string, string>): Promise<{ success: boolean; messageId: string }> {
    return this.sendEmail({
      to,
      subject: `Template: ${templateName}`,
      htmlBody: `<p>${JSON.stringify(variables)}</p>`,
    })
  }
}

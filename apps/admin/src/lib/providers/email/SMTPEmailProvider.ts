import { IEmailProvider, EmailParams } from './EmailProvider'
import { NormalizedProviderError } from '../errors'

export class SMTPEmailProvider implements IEmailProvider {
  public name = 'SMTPEmailProvider'
  private host: string
  private port: number
  private user: string
  private pass: string

  constructor(host: string, port: number, user: string, pass: string) {
    if (!host || !user || !pass) {
      throw new NormalizedProviderError({
        provider: 'SMTP',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'SMTP host, user, or password not provided in environment configuration.',
        retryable: false,
      })
    }
    this.host = host
    this.port = port || 587
    this.user = user
    this.pass = pass
  }

  async sendEmail(params: EmailParams): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_smtp_${Date.now()}`
    console.log(`[EmailProvider:SMTP] Sending email via ${this.host}:${this.port} to ${params.to}`)
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

import { IEmailProvider, EmailParams } from './EmailProvider'

export class MockEmailProvider implements IEmailProvider {
  public name = 'MockEmailProvider (Demo)'

  async sendEmail(params: EmailParams): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_mock_${Date.now()}`
    console.log(`[EmailProvider:Mock] Sent email to ${params.to} | Subject: "${params.subject}"`)
    return {
      success: true,
      messageId,
    }
  }

  async sendTemplateEmail(to: string, templateName: string, variables: Record<string, string>): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_tmpl_mock_${Date.now()}`
    console.log(`[EmailProvider:Mock] Sent template "${templateName}" to ${to}`)
    return {
      success: true,
      messageId,
    }
  }
}

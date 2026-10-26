export interface EmailParams {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
  fromName?: string
  templateName?: string
  variables?: Record<string, string>
}

export interface IEmailProvider {
  name: string
  sendEmail(params: EmailParams): Promise<{ success: boolean; messageId: string }>
  sendTemplateEmail(to: string, templateName: string, variables: Record<string, string>): Promise<{ success: boolean; messageId: string }>
}

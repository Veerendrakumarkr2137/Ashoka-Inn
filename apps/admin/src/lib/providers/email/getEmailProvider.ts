import { IEmailProvider } from './EmailProvider'
import { MockEmailProvider } from './MockEmailProvider'
import { ResendEmailProvider } from './ResendEmailProvider'
import { SMTPEmailProvider } from './SMTPEmailProvider'

export function getEmailProvider(): IEmailProvider {
  const providerType = (process.env.EMAIL_PROVIDER || 'mock').toLowerCase()

  switch (providerType) {
    case 'resend':
      return new ResendEmailProvider(process.env.EMAIL_API_KEY || '')

    case 'smtp':
      return new SMTPEmailProvider(
        process.env.SMTP_HOST || '',
        parseInt(process.env.SMTP_PORT || '587', 10),
        process.env.SMTP_USER || '',
        process.env.SMTP_PASS || ''
      )

    case 'mock':
    default:
      return new MockEmailProvider()
  }
}

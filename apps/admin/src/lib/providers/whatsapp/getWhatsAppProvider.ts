import { IWhatsAppProvider } from './WhatsAppProvider'
import { MockWhatsAppProvider } from './MockWhatsAppProvider'
import { MetaWhatsAppProvider } from './MetaWhatsAppProvider'
import { TwilioWhatsAppProvider } from './TwilioWhatsAppProvider'

export function getWhatsAppProvider(): IWhatsAppProvider {
  const providerType = (process.env.WHATSAPP_PROVIDER || 'mock').toLowerCase()

  switch (providerType) {
    case 'meta':
      return new MetaWhatsAppProvider(
        process.env.WHATSAPP_API_KEY || '',
        process.env.WHATSAPP_PHONE_NUMBER_ID || ''
      )

    case 'twilio':
      return new TwilioWhatsAppProvider(
        process.env.TWILIO_ACCOUNT_SID || '',
        process.env.TWILIO_AUTH_TOKEN || ''
      )

    case 'mock':
    default:
      return new MockWhatsAppProvider()
  }
}

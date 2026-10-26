import { IPaymentProvider } from './PaymentProvider'
import { MockPaymentProvider } from './MockPaymentProvider'
import { RazorpayPaymentProvider } from './RazorpayPaymentProvider'
import { StripePaymentProvider } from './StripePaymentProvider'

export function getPaymentProvider(): IPaymentProvider {
  const providerType = (process.env.PAYMENT_PROVIDER || 'mock').toLowerCase()

  switch (providerType) {
    case 'razorpay':
      return new RazorpayPaymentProvider(process.env.PAYMENT_SECRET || '')

    case 'stripe':
      return new StripePaymentProvider(process.env.PAYMENT_SECRET || '')

    case 'mock':
    default:
      return new MockPaymentProvider()
  }
}

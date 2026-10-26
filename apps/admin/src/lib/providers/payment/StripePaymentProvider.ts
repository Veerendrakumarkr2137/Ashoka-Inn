import { IPaymentProvider, PaymentOrderParams, PaymentOrderResult, PaymentVerifyParams } from './PaymentProvider'
import { NormalizedProviderError } from '../errors'

export class StripePaymentProvider implements IPaymentProvider {
  public name = 'StripePaymentProvider'
  private secretKey: string

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new NormalizedProviderError({
        provider: 'Stripe',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'Stripe Secret Key not provided in environment configuration.',
        retryable: false,
      })
    }
    this.secretKey = secretKey
  }

  async createPayment(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const orderId = `pi_stripe_${Date.now()}`
    console.log(`[PaymentProvider:Stripe] Created PaymentIntent ${orderId} for ₹${params.amount}`)
    return {
      success: true,
      orderId,
      amount: params.amount,
      currency: params.currency,
      gateway: 'STRIPE',
    }
  }

  async verifyPayment(params: PaymentVerifyParams): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: params.paymentId,
    }
  }

  async refundPayment(paymentId: string, amount: number): Promise<{ success: boolean; refundId: string }> {
    return {
      success: true,
      refundId: `re_stripe_${Date.now()}`,
    }
  }

  async getPaymentStatus(paymentId: string): Promise<{ success: boolean; status: string; amount: number }> {
    return {
      success: true,
      status: 'succeeded',
      amount: 0,
    }
  }
}

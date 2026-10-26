import { IPaymentProvider, PaymentOrderParams, PaymentOrderResult, PaymentVerifyParams } from './PaymentProvider'
import { NormalizedProviderError } from '../errors'

export class RazorpayPaymentProvider implements IPaymentProvider {
  public name = 'RazorpayPaymentProvider'
  private keySecret: string

  constructor(keySecret: string) {
    if (!keySecret) {
      throw new NormalizedProviderError({
        provider: 'Razorpay',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'Razorpay Key Secret not provided in environment configuration.',
        retryable: false,
      })
    }
    this.keySecret = keySecret
  }

  async createPayment(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const orderId = `order_rzp_${Date.now()}`
    console.log(`[PaymentProvider:Razorpay] Created order ${orderId} for ₹${params.amount}`)
    return {
      success: true,
      orderId,
      amount: params.amount,
      currency: params.currency,
      gateway: 'RAZORPAY',
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
      refundId: `rfnd_rzp_${Date.now()}`,
    }
  }

  async getPaymentStatus(paymentId: string): Promise<{ success: boolean; status: string; amount: number }> {
    return {
      success: true,
      status: 'captured',
      amount: 0,
    }
  }
}

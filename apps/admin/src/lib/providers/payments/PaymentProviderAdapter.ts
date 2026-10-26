import { IPaymentProvider, PaymentOrderParams, PaymentOrderResult, PaymentVerifyParams } from '@hospitality-os/types'

export class MockPaymentProvider implements IPaymentProvider {
  name = 'Mock Payment Gateway (Demo)'

  async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const orderId = `order_mock_${Date.now()}_${params.bookingRef}`
    console.log(`[PaymentProvider:Mock] Created order ${orderId} for amount ₹${params.amount}`)
    return {
      success: true,
      orderId,
      amount: params.amount,
      currency: params.currency || 'INR',
      gateway: 'MOCK_RAZORPAY',
      keyId: 'rzp_test_mockKey123',
    }
  }

  async verifyPayment(params: PaymentVerifyParams): Promise<{ success: boolean; transactionId: string }> {
    const txId = params.paymentId || `pay_mock_${Date.now()}`
    console.log(`[PaymentProvider:Mock] Verified payment ${txId} for order ${params.orderId}`)
    return {
      success: true,
      transactionId: txId,
    }
  }

  async refundPayment(paymentId: string, amount: number): Promise<{ success: boolean; refundId: string }> {
    const refundId = `rfnd_mock_${Date.now()}`
    console.log(`[PaymentProvider:Mock] Processed refund ${refundId} of ₹${amount} for payment ${paymentId}`)
    return {
      success: true,
      refundId,
    }
  }
}

export class RazorpayPaymentProvider implements IPaymentProvider {
  name = 'Razorpay Gateway Provider'
  private keySecret: string

  constructor(keySecret: string) {
    this.keySecret = keySecret
  }

  async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    if (!this.keySecret) {
      console.warn('[PaymentProvider:Razorpay] Secret missing. Falling back to Mock.')
      return new MockPaymentProvider().createOrder(params)
    }
    return {
      success: true,
      orderId: `order_rzp_${Date.now()}`,
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
}

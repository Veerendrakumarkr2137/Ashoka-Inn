import { IPaymentProvider, PaymentOrderParams, PaymentOrderResult, PaymentVerifyParams } from './PaymentProvider'

export class MockPaymentProvider implements IPaymentProvider {
  public name = 'MockPaymentProvider (Demo)'

  async createPayment(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const orderId = `order_mock_${Date.now()}_${params.bookingRef}`
    console.log(`[PaymentProvider:Mock] Created payment order ${orderId} for ₹${params.amount}`)
    return {
      success: true,
      orderId,
      amount: params.amount,
      currency: params.currency || 'INR',
      gateway: 'MOCK_GATEWAY',
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

  async getPaymentStatus(paymentId: string): Promise<{ success: boolean; status: string; amount: number }> {
    return {
      success: true,
      status: 'CAPTURED',
      amount: 1000,
    }
  }
}

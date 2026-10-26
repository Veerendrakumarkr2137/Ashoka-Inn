export interface PaymentOrderParams {
  amount: number
  currency: string
  bookingRef: string
  customerEmail: string
  customerPhone?: string
  idempotencyKey?: string
}

export interface PaymentOrderResult {
  success: boolean
  orderId: string
  amount: number
  currency: string
  gateway: string
  keyId?: string
  error?: string
}

export interface PaymentVerifyParams {
  orderId: string
  paymentId: string
  signature?: string
}

export interface IPaymentProvider {
  name: string
  createPayment(params: PaymentOrderParams): Promise<PaymentOrderResult>
  verifyPayment(params: PaymentVerifyParams): Promise<{ success: boolean; transactionId: string }>
  refundPayment(paymentId: string, amount: number): Promise<{ success: boolean; refundId: string }>
  getPaymentStatus(paymentId: string): Promise<{ success: boolean; status: string; amount: number }>
}

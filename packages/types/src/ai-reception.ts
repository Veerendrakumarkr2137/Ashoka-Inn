export type AiCallStatus =
  | 'CREATED'
  | 'STARTING'
  | 'RINGING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NO_ANSWER'
  | 'BUSY'
  | 'FAILED'
  | 'CANCELLED'
  | 'ESCALATED'

export interface SafeBookingContext {
  bookingId: string
  bookingRef: string
  guestName: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  roomCategory: string
  roomNumber?: string
  status: string
  paymentStatus: string
  totalAmount: number
  hotelName: string
  hotelContact: string
  expectedArrivalTime?: string
  specialRequests?: string
}

export interface AiToolInvocation<T = Record<string, any>> {
  toolName:
    | 'getBooking'
    | 'confirmBooking'
    | 'saveArrivalTime'
    | 'addGuestRequest'
    | 'createCallbackRequest'
    | 'saveCallResult'
  args: T
}

export interface SaveCallResultParams {
  sessionId?: string
  bookingId: string
  callStatus: AiCallStatus
  outcome: string
  language?: string
  duration?: number
  summary: string
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED'
  arrivalTime?: string
  guestRequest?: string
  escalationRequired?: boolean
  failureReason?: string
}

export interface CallbackRequestParams {
  bookingId?: string
  guestName?: string
  phone?: string
  reason: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

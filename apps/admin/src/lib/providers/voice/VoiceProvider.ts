export interface VoiceCallParams {
  toPhone: string
  bookingRef?: string
  guestName?: string
  promptMessage?: string
}

export interface VoiceCallResult {
  success: boolean
  callId: string
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  recordingUrl?: string
  transcript?: string
  error?: string
}

export interface IVoiceProvider {
  name: string
  startOutboundCall(params: VoiceCallParams): Promise<VoiceCallResult>
  getCallStatus(callId: string): Promise<VoiceCallResult | null>
  endCall(callId: string): Promise<boolean>
}

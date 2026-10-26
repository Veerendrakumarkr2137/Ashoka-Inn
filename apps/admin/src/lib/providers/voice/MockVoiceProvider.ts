import { IVoiceProvider, VoiceCallParams, VoiceCallResult } from './VoiceProvider'

export class MockVoiceProvider implements IVoiceProvider {
  public name = 'MockVoiceProvider (Demo)'

  async startOutboundCall(params: VoiceCallParams): Promise<VoiceCallResult> {
    const callId = `mock-call-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    console.log(`[VoiceProvider:Mock] Initiating call to ${params.toPhone} for Ref: ${params.bookingRef || 'N/A'}`)
    return {
      success: true,
      callId,
      status: 'QUEUED',
      transcript: 'Mock voice receptionist session initialized for local demo.',
    }
  }

  async getCallStatus(callId: string): Promise<VoiceCallResult | null> {
    return {
      success: true,
      callId,
      status: 'COMPLETED',
      recordingUrl: `https://demo.hotelpms.local/recordings/${callId}.mp3`,
      transcript: 'Guest confirmed check-in arrival time at 4:00 PM.',
    }
  }

  async endCall(callId: string): Promise<boolean> {
    console.log(`[VoiceProvider:Mock] Ended call ${callId}`)
    return true
  }
}

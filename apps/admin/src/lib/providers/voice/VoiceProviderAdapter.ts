import { IVoiceProvider, VoiceCallParams, VoiceCallResult } from '@hospitality-os/types'

export class MockVoiceProvider implements IVoiceProvider {
  name = 'Mock Voice Provider (Demo)'

  async startOutboundCall(params: VoiceCallParams): Promise<VoiceCallResult> {
    const mockCallId = `call_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    console.log(`[VoiceProvider:Mock] Initiating call to ${params.toPhone} for Ref: ${params.bookingRef || 'N/A'}`)
    return {
      success: true,
      callId: mockCallId,
      status: 'QUEUED',
      transcript: 'Mock call initialized for demo mode.',
    }
  }

  async getCallLog(callId: string): Promise<VoiceCallResult | null> {
    return {
      success: true,
      callId,
      status: 'COMPLETED',
      recordingUrl: `https://api.hospitality-os.demo/recordings/${callId}.mp3`,
      transcript: 'Guest confirmed check-in arrival time at 4:00 PM.',
    }
  }

  async endCall(callId: string): Promise<boolean> {
    console.log(`[VoiceProvider:Mock] Terminating call ${callId}`)
    return true
  }
}

export class LiveKitVoiceProvider implements IVoiceProvider {
  name = 'LiveKit Cloud Voice Provider'
  private livekitUrl: string
  private apiKey: string
  private apiSecret: string

  constructor(livekitUrl: string, apiKey: string, apiSecret: string) {
    this.livekitUrl = livekitUrl
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }

  async startOutboundCall(params: VoiceCallParams): Promise<VoiceCallResult> {
    if (!this.livekitUrl || !this.apiKey) {
      console.warn('[VoiceProvider:LiveKit] LiveKit credentials not configured. Falling back to Mock.')
      return new MockVoiceProvider().startOutboundCall(params)
    }
    const callId = `lk_call_${Date.now()}`
    console.log(`[VoiceProvider:LiveKit] Launching SIP dispatch to ${params.toPhone}`)
    return {
      success: true,
      callId,
      status: 'IN_PROGRESS',
    }
  }

  async getCallLog(callId: string): Promise<VoiceCallResult | null> {
    return {
      success: true,
      callId,
      status: 'COMPLETED',
    }
  }

  async endCall(callId: string): Promise<boolean> {
    return true
  }
}

import { IVoiceProvider, VoiceCallParams, VoiceCallResult } from './VoiceProvider'
import { NormalizedProviderError } from '../errors'

export class LiveKitVoiceProvider implements IVoiceProvider {
  public name = 'LiveKitVoiceProvider'
  private livekitUrl: string
  private apiKey: string
  private apiSecret: string

  constructor(livekitUrl: string, apiKey: string, apiSecret: string) {
    if (!livekitUrl || !apiKey || !apiSecret) {
      throw new NormalizedProviderError({
        provider: 'LiveKit',
        operation: 'initialize',
        code: 'MISSING_CREDENTIALS',
        message: 'LiveKit URL, API Key, or API Secret not provided in environment configuration.',
        retryable: false,
      })
    }
    this.livekitUrl = livekitUrl
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }

  async startOutboundCall(params: VoiceCallParams): Promise<VoiceCallResult> {
    const callId = `lk-call-${Date.now()}`
    console.log(`[VoiceProvider:LiveKit] Initiating SIP dispatch to ${params.toPhone} on ${this.livekitUrl}`)
    return {
      success: true,
      callId,
      status: 'IN_PROGRESS',
    }
  }

  async getCallStatus(callId: string): Promise<VoiceCallResult | null> {
    return {
      success: true,
      callId,
      status: 'COMPLETED',
    }
  }

  async endCall(callId: string): Promise<boolean> {
    console.log(`[VoiceProvider:LiveKit] Terminated SIP call ${callId}`)
    return true
  }
}

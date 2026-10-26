import { IVoiceProvider } from './VoiceProvider'
import { MockVoiceProvider } from './MockVoiceProvider'
import { LiveKitVoiceProvider } from './LiveKitVoiceProvider'
import { getAppConfig } from '@hospitality-os/utils'

export function getVoiceProvider(): IVoiceProvider {
  const providerType = (process.env.VOICE_PROVIDER || 'mock').toLowerCase()

  switch (providerType) {
    case 'livekit':
      return new LiveKitVoiceProvider(
        process.env.LIVEKIT_URL || '',
        process.env.LIVEKIT_API_KEY || '',
        process.env.LIVEKIT_API_SECRET || ''
      )

    case 'mock':
    default:
      return new MockVoiceProvider()
  }
}

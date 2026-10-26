export interface ProviderErrorParams {
  provider: string
  operation: string
  code: string
  message: string
  retryable?: boolean
  details?: Record<string, unknown>
}

export class NormalizedProviderError extends Error {
  public provider: string
  public operation: string
  public code: string
  public retryable: boolean
  public details?: Record<string, unknown>

  constructor(params: ProviderErrorParams) {
    super(`[${params.provider}:${params.operation}] ${params.message} (Code: ${params.code})`)
    this.name = 'NormalizedProviderError'
    this.provider = params.provider
    this.operation = params.operation
    this.code = params.code
    this.retryable = params.retryable ?? false
    this.details = params.details
  }
}

export interface ActivationCode {
  code: string
  createdAt: string
  remainingUses: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ListCodesResponse extends ApiResponse {
  data?: ActivationCode[]
}

export interface AddCodesResponse extends ApiResponse {
  data?: string[]
}

export interface ValidateCodeResponse extends ApiResponse {
  message?: string
  data?: {
    remainingUses: number
  }
}

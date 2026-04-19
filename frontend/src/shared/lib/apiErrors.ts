interface ApiErrorPayload {
  response?: {
    data?: {
      message?: string | string[]
      error?: {
        message?: string | string[]
        details?: string[]
      }
    }
  }
}

function firstMessage(value?: string | string[]) {
  if (Array.isArray(value)) return value[0]
  return value
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  const payload = error as ApiErrorPayload
  const apiError = payload.response?.data?.error

  return (
    apiError?.details?.[0] ??
    firstMessage(apiError?.message) ??
    firstMessage(payload.response?.data?.message) ??
    fallback
  )
}

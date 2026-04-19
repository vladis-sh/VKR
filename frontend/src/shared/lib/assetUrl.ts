import { API_URL } from '@/shared/constants'

export function resolveAssetUrl(src?: string | null) {
  if (!src) return undefined

  if (/^(blob:|data:|https?:\/\/)/i.test(src)) {
    return src
  }

  const apiUrl = new URL(API_URL, window.location.origin)
  const apiOrigin = apiUrl.origin

  if (src.startsWith('/uploads/')) {
    return `${apiOrigin}${src}`
  }

  return new URL(src, apiUrl).toString()
}

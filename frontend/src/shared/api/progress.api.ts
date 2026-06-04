import { apiClient } from './axios'

export interface ServerProgress<T> {
  exists: boolean
  data: T
}

/** Per-account progress blobs, keyed by namespace (test-catalog / roadmap / live-coding). */
export const progressApi = {
  get: <T>(namespace: string) =>
    apiClient.get<ServerProgress<T>>(`/progress/${namespace}`),

  put: <T>(namespace: string, data: T) =>
    apiClient.put<{ data: T }>(`/progress/${namespace}`, { data }),
}

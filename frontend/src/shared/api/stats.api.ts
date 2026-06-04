import { apiClient } from './axios'
import type { UserStats } from '@/entities/types'

export const statsApi = {
  getStats: () =>
    apiClient.get<UserStats>('/stats'),
}

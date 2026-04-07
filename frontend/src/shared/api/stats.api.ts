import { apiClient } from './axios'
import type { UserStats, LeaderboardEntry } from '@/entities/types'

export const statsApi = {
  getStats: () =>
    apiClient.get<UserStats>('/stats'),

  getLeaderboard: (params: { sort?: string; limit?: number } = {}) =>
    apiClient.get<LeaderboardEntry[]>('/stats/leaderboard', { params }),
}

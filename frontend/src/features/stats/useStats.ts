import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/shared/api/stats.api'
import { QUERY_KEYS } from '@/shared/constants'

export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: () => statsApi.getStats().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useLeaderboard(sort: 'correctAnswers' | 'studyTime' = 'correctAnswers') {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERBOARD(sort),
    queryFn: () => statsApi.getLeaderboard({ sort, limit: 20 }).then((r) => r.data),
    staleTime: 1000 * 60 * 1,
  })
}

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

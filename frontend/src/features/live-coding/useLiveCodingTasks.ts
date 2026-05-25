import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants'
import { contentApi } from '@/shared/api/content.api'

export function useLiveCodingTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.LIVE_CODING_TASKS,
    queryFn: () => contentApi.listLiveCodingTasks().then((response) => response.data),
  })
}

export function useLiveCodingTask(slug: string | undefined) {
  return useQuery({
    queryKey: slug ? QUERY_KEYS.LIVE_CODING_TASK(slug) : ['live-coding', 'none'],
    queryFn: () => contentApi.getLiveCodingTask(slug!).then((response) => response.data),
    enabled: !!slug,
  })
}

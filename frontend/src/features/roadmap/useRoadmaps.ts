import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants'
import { contentApi } from '@/shared/api/content.api'

export function useRoadmaps() {
  return useQuery({
    queryKey: QUERY_KEYS.ROADMAPS,
    queryFn: () => contentApi.listRoadmaps().then((response) => response.data),
  })
}

export function useRoadmap(slug: string | undefined) {
  return useQuery({
    queryKey: slug ? QUERY_KEYS.ROADMAP(slug) : ['roadmaps', 'none'],
    queryFn: () => contentApi.getRoadmap(slug!).then((response) => response.data),
    enabled: !!slug,
  })
}

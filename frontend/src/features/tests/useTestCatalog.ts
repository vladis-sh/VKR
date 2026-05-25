import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants'
import { contentApi } from '@/shared/api/content.api'

export function useTestCatalogThemes() {
  return useQuery({
    queryKey: QUERY_KEYS.TEST_CATALOG_THEMES,
    queryFn: () => contentApi.listTestCatalogThemes().then((response) => response.data),
  })
}

export function useTestCatalogTheme(slug: string | undefined) {
  return useQuery({
    queryKey: slug ? QUERY_KEYS.TEST_CATALOG_THEME(slug) : ['test-catalog', 'themes', 'none'],
    queryFn: () => contentApi.getTestCatalogTheme(slug!).then((response) => response.data),
    enabled: !!slug,
  })
}

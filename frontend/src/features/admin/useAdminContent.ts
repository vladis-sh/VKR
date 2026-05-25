import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  contentApi,
  type AdminContentParams,
  type CreateContentEntryPayload,
  type UpdateContentEntryPayload,
} from '@/shared/api/content.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'

export function useAdminContentEntries(params: AdminContentParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_CONTENT_ENTRIES, params],
    queryFn: () => contentApi.listAdminEntries(params).then((response) => response.data),
  })
}

export function useAdminContentEntry(id: string | undefined) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.ADMIN_CONTENT_ENTRY(id) : ['admin', 'content', 'entries', 'none'],
    queryFn: () => contentApi.getAdminEntry(id!).then((response) => response.data),
    enabled: !!id,
  })
}

function invalidateContent(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_ENTRIES })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROADMAPS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVE_CODING_TASKS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEST_CATALOG_THEMES })
}

export function useCreateContentEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContentEntryPayload) =>
      contentApi.createAdminEntry(data).then((response) => response.data),
    onSuccess: () => {
      invalidateContent(queryClient)
      toast.success('Контент создан')
    },
    onError: () => toast.error('Не удалось создать контент'),
  })
}

export function useUpdateContentEntry(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateContentEntryPayload) =>
      contentApi.updateAdminEntry(id, data).then((response) => response.data),
    onSuccess: (entry) => {
      invalidateContent(queryClient)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_ENTRY(id) })

      if (entry.type === 'roadmap') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROADMAP(entry.slug) })
      }
      if (entry.type === 'live_coding_task') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVE_CODING_TASK(entry.slug) })
      }
      if (entry.type === 'test_catalog_theme') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEST_CATALOG_THEME(entry.slug) })
      }

      toast.success('Контент обновлён')
    },
    onError: () => toast.error('Не удалось сохранить контент'),
  })
}

export function useDeleteContentEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentApi.deleteAdminEntry(id).then((response) => response.data),
    onSuccess: () => {
      invalidateContent(queryClient)
      toast.info('Контент удалён')
    },
    onError: () => toast.error('Не удалось удалить контент'),
  })
}

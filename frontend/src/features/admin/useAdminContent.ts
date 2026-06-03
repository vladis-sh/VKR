import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  contentApi,
  type AdminContentCandidateParams,
  type AdminContentParams,
  type AdminContentSourceParams,
  type CreateContentCandidatePayload,
  type CreateContentEntryPayload,
  type CreateContentSourcePayload,
  type UpdateContentEntryPayload,
  type UpdateContentSourcePayload,
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

export function useAdminContentSources(params: AdminContentSourceParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_CONTENT_SOURCES, params],
    queryFn: () => contentApi.listAdminSources(params).then((response) => response.data),
  })
}

export function useAdminContentSource(id: string | undefined) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.ADMIN_CONTENT_SOURCE(id) : ['admin', 'content', 'sources', 'none'],
    queryFn: () => contentApi.getAdminSource(id!).then((response) => response.data),
    enabled: !!id,
  })
}

export function useAdminContentCandidates(params: AdminContentCandidateParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_CONTENT_CANDIDATES, params],
    queryFn: () => contentApi.listAdminCandidates(params).then((response) => response.data),
  })
}

function invalidateContent(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_ENTRIES })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_CANDIDATES })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROADMAPS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVE_CODING_TASKS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEST_CATALOG_THEMES })
}

function invalidateSources(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_SOURCES })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_CANDIDATES })
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

export function useCreateContentSource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContentSourcePayload) =>
      contentApi.createAdminSource(data).then((response) => response.data),
    onSuccess: () => {
      invalidateSources(queryClient)
      toast.success('Источник создан')
    },
    onError: () => toast.error('Не удалось создать источник'),
  })
}

export function useUpdateContentSource(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateContentSourcePayload) =>
      contentApi.updateAdminSource(id, data).then((response) => response.data),
    onSuccess: () => {
      invalidateSources(queryClient)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_SOURCE(id) })
      toast.success('Источник обновлен')
    },
    onError: () => toast.error('Не удалось сохранить источник'),
  })
}

export function useDeleteContentSource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentApi.deleteAdminSource(id).then((response) => response.data),
    onSuccess: () => {
      invalidateSources(queryClient)
      toast.info('Источник удален')
    },
    onError: () => toast.error('Не удалось удалить источник'),
  })
}

export function useRunContentSource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentApi.runAdminSource(id).then((response) => response.data),
    onSuccess: (result) => {
      invalidateSources(queryClient)
      toast.success(`Импорт завершен: создано ${result.created}, пропущено ${result.skipped}`)
    },
    onError: () => toast.error('Не удалось запустить источник'),
  })
}

export function useCreateContentCandidate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContentCandidatePayload) =>
      contentApi.createAdminCandidate(data).then((response) => response.data),
    onSuccess: () => {
      invalidateSources(queryClient)
      toast.success('Кандидат создан')
    },
    onError: () => toast.error('Не удалось создать кандидата'),
  })
}

export function usePublishContentCandidate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentApi.publishAdminCandidate(id).then((response) => response.data),
    onSuccess: () => {
      invalidateContent(queryClient)
      toast.success('Кандидат опубликован')
    },
    onError: () => toast.error('Не удалось опубликовать кандидата'),
  })
}

export function useRejectContentCandidate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentApi.rejectAdminCandidate(id).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CONTENT_CANDIDATES })
      toast.info('Кандидат отклонен')
    },
    onError: () => toast.error('Не удалось отклонить кандидата'),
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminApi,
  type AdminQuestionsParams,
  type CreateQuestionPayload,
  type UpdateQuestionPayload,
} from '@/shared/api/admin.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'

export function useAdminQuestions(params: AdminQuestionsParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_QUESTIONS, params],
    queryFn: () => adminApi.listQuestions(params).then((r) => r.data),
  })
}

export function useAdminQuestion(id: string | undefined) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.ADMIN_QUESTION(id) : ['admin', 'question', 'none'],
    queryFn: () => adminApi.getQuestion(id!).then((r) => r.data),
    enabled: !!id,
  })
}

function invalidateQuestions(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_QUESTIONS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEST_TOPICS })
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuestionPayload) =>
      adminApi.createQuestion(data).then((r) => r.data),
    onSuccess: () => {
      invalidateQuestions(queryClient)
      toast.success('Вопрос создан')
    },
    onError: () => toast.error('Не удалось создать вопрос'),
  })
}

export function useUpdateQuestion(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateQuestionPayload) =>
      adminApi.updateQuestion(id, data).then((r) => r.data),
    onSuccess: () => {
      invalidateQuestions(queryClient)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_QUESTION(id) })
      toast.success('Вопрос обновлён')
    },
    onError: () => toast.error('Не удалось сохранить вопрос'),
  })
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteQuestion(id).then((r) => r.data),
    onSuccess: () => {
      invalidateQuestions(queryClient)
      toast.info('Вопрос удалён')
    },
    onError: () => toast.error('Не удалось удалить вопрос'),
  })
}

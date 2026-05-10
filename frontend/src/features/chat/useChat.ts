import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { chatApi } from '@/shared/api/chat.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'
import type { ChatMessage } from '@/entities/types'

// ── Helpers ────────────────────────────────────────────────────────────────────

interface BackendError {
  success?: false
  error?: { code?: number; message?: string }
}

/** Map backend / network errors to a short user-facing string. */
function describeAssistantError(err: unknown): string {
  if (err instanceof AxiosError) {
    const status = err.response?.status
    const data = err.response?.data as BackendError | undefined
    const backendMsg = data?.error?.message

    if (status === 429) {
      return 'Сейчас превышен лимит запросов к ассистенту. Попробуйте позже.'
    }
    if (status === 502 || status === 503 || status === 504) {
      return 'Не удалось получить ответ ассистента. Попробуйте ещё раз.'
    }
    if (status === 400 && backendMsg) {
      return backendMsg
    }
    if (!err.response) {
      return 'Нет связи с сервером. Проверьте подключение и попробуйте ещё раз.'
    }
  }
  return 'Не удалось получить ответ ассистента. Попробуйте ещё раз.'
}

// ── Queries ────────────────────────────────────────────────────────────────────

export function useChatSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT_SESSIONS,
    queryFn: () => chatApi.getSessions().then((r) => r.data),
  })
}

export function useChatSession(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT_SESSION(id),
    queryFn: () => chatApi.getSession(id).then((r) => r.data),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
}

export function useCreateChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title?: string; assistantRole: string }) =>
      chatApi.createSession(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSIONS })
    },
    onError: () => {
      toast.error('Не удалось создать чат')
    },
  })
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => chatApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSIONS })
      toast.success('Чат удалён')
    },
    onError: () => {
      toast.error('Не удалось удалить чат')
    },
  })
}

// ── Send message hook ──────────────────────────────────────────────────────────

export interface PendingMessage extends ChatMessage {
  /** True when the request for this message has failed. UI marks it visually. */
  failed?: boolean
}

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient()
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      // Optimistically render the user message immediately.
      const tempId = `temp-${Date.now()}`
      const userMessage: PendingMessage = {
        id: tempId,
        sessionId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      }
      setPendingMessages((prev) => [
        // Drop any previous failed messages with same content to avoid stacking duplicates.
        ...prev.filter((m) => !(m.failed && m.content === content)),
        userMessage,
      ])
      setIsTyping(true)
      setError(null)

      try {
        const response = await chatApi.sendMessage(sessionId, content)
        return { tempId, assistantMessage: response.data, userMessage }
      } finally {
        setIsTyping(false)
      }
    },
    onSuccess: ({ tempId, userMessage, assistantMessage }) => {
      // Remove the optimistic copy and write the confirmed pair into the cache.
      setPendingMessages((prev) => prev.filter((m) => m.id !== tempId))
      queryClient.setQueryData(
        QUERY_KEYS.CHAT_SESSION(sessionId),
        (old: { messages: ChatMessage[] } | undefined) => {
          if (!old) return old
          return {
            ...old,
            messages: [
              ...old.messages,
              { ...userMessage, id: `${tempId}-confirmed` },
              assistantMessage,
            ],
          }
        },
      )
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSION(sessionId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSIONS })
    },
    onError: (err) => {
      // Keep the optimistic user message on screen, mark it as failed.
      setPendingMessages((prev) =>
        prev.map((m, i, arr) =>
          i === arr.length - 1 ? { ...m, failed: true } : m,
        ),
      )
      const message = describeAssistantError(err)
      setError(message)
      toast.error(message)
    },
  })

  return {
    sendMessage: (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || mutation.isPending) return
      mutation.mutate(trimmed)
    },
    retry: (content: string) => {
      if (mutation.isPending) return
      mutation.mutate(content.trim())
    },
    clearError: () => setError(null),
    isLoading: mutation.isPending,
    isTyping,
    error,
    /** Backwards-compatible alias used by ChatPage. */
    optimisticMessages: pendingMessages,
  }
}

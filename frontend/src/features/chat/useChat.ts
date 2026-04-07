import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '@/shared/api/chat.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'
import type { ChatMessage } from '@/entities/types'

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

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient()
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      // Optimistically add user message
      const tempId = `temp-${Date.now()}`
      const userMessage: ChatMessage = {
        id: tempId,
        sessionId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      }
      setOptimisticMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      try {
        const response = await chatApi.sendMessage(sessionId, content)
        return {
          userMessage,
          assistantMessage: response.data,
        }
      } finally {
        setIsTyping(false)
      }
    },
    onSuccess: ({ userMessage, assistantMessage }) => {
      setOptimisticMessages([])
      queryClient.setQueryData(QUERY_KEYS.CHAT_SESSION(sessionId), (old: { messages: ChatMessage[] } | undefined) => {
        if (!old) return old
        return {
          ...old,
          messages: [...old.messages, userMessage, assistantMessage],
        }
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSION(sessionId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSIONS })
    },
    onError: () => {
      setOptimisticMessages([])
      toast.error('Не удалось отправить сообщение')
    },
  })

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    isTyping,
    optimisticMessages,
  }
}

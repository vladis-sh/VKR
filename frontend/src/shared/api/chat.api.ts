import { apiClient } from './axios'
import type { ChatSession, ChatSessionDetail, ChatMessage } from '@/entities/types'

export const chatApi = {
  getSessions: () =>
    apiClient.get<ChatSession[]>('/chat/sessions'),

  createSession: (data: { title?: string; assistantRole: string }) =>
    apiClient.post<ChatSession>('/chat/sessions', data),

  deleteAllSessions: () =>
    apiClient.delete<void>('/chat/sessions'),

  getSession: (id: string) =>
    apiClient.get<ChatSessionDetail>(`/chat/sessions/${id}`),

  deleteSession: (id: string) =>
    apiClient.delete<void>(`/chat/sessions/${id}`),

  sendMessage: (sessionId: string, content: string) =>
    apiClient.post<ChatMessage>(`/chat/sessions/${sessionId}/messages`, { content }),
}

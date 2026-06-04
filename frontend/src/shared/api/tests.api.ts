import { apiClient } from './axios'
import type {
  TestTopic,
  TestQuestion,
  TestSession,
  TestSessionResult,
  TestAnswer,
} from '@/entities/types'

export interface TestQuestionsParams {
  topic?: string
  limit?: number
  difficulty?: string
}

export interface CreateTestSessionPayload {
  mode: string
  topic?: string
  timeLimit?: number
}

export interface CompleteTestSessionPayload {
  answers: Omit<TestAnswer, 'isCorrect'>[]
  durationSeconds: number
}

export interface RecordCatalogResultPayload {
  topic: string
  correctCount: number
  totalQuestions: number
  durationSeconds: number
}

export const testsApi = {
  getTopics: () =>
    apiClient.get<TestTopic[]>('/tests/topics'),

  getQuestions: (params: TestQuestionsParams = {}) =>
    apiClient.get<TestQuestion[]>('/tests/questions', { params }),

  getAIQuestions: (params: { topic?: string; count?: number; difficulty?: string } = {}) =>
    apiClient.get<TestQuestion[]>('/tests/questions/ai', { params }),

  checkAnswer: (questionId: string, selectedAnswerIndex: number) =>
    apiClient.post<{ isCorrect: boolean; correctIndex: number; explanation: string }>(
      `/tests/questions/${questionId}/check`,
      { selectedAnswerIndex }
    ),

  createSession: (data: CreateTestSessionPayload) =>
    apiClient.post<TestSession>('/tests/sessions', data),

  completeSession: (id: string, data: CompleteTestSessionPayload) =>
    apiClient.post<TestSessionResult>(`/tests/sessions/${id}/complete`, {
      answers: data.answers.map((answer) => ({
        questionId: answer.questionId,
        selectedAnswerIndex: answer.selectedIndex,
      })),
      durationSeconds: data.durationSeconds,
    }),

  getSession: (id: string) =>
    apiClient.get<TestSessionResult>(`/tests/sessions/${id}`),

  recordCatalogResult: (data: RecordCatalogResultPayload) =>
    apiClient.post<{ id: string; correctAnswers: number; totalQuestions: number; percentage: number }>(
      '/tests/sessions/catalog-result',
      data
    ),
}

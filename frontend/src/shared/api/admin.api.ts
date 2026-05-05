import { apiClient } from './axios'
import type { Material, AdminQuestion, MaterialsPagination, KnowledgeLevel } from '@/entities/types'

export interface AdminListParams {
  search?: string
  level?: string
  page?: number
  limit?: number
}

export interface AdminQuestionsParams {
  topic?: string
  difficulty?: string
  search?: string
  page?: number
  limit?: number
}

export interface AdminListResponse<T> {
  items: T[]
  pagination: MaterialsPagination
}

export interface CreateMaterialPayload {
  title: string
  shortDescription: string
  content: string
  tags: string[]
  level: KnowledgeLevel
  isPublished?: boolean
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload>

export interface CreateQuestionPayload {
  topic: string
  text: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  difficulty: KnowledgeLevel
  isPublished?: boolean
}

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>

export const adminApi = {
  // Materials
  listMaterials: (params: AdminListParams = {}) =>
    apiClient.get<AdminListResponse<Material>>('/materials/admin', { params }),

  getMaterial: (id: string) =>
    apiClient.get<Material>(`/materials/admin/${id}`),

  createMaterial: (data: CreateMaterialPayload) =>
    apiClient.post<Material>('/materials', data),

  updateMaterial: (id: string, data: UpdateMaterialPayload) =>
    apiClient.patch<Material>(`/materials/${id}`, data),

  deleteMaterial: (id: string) =>
    apiClient.delete<{ message: string }>(`/materials/${id}`),

  // Questions
  listQuestions: (params: AdminQuestionsParams = {}) =>
    apiClient.get<AdminListResponse<AdminQuestion>>('/tests/questions/admin', { params }),

  getQuestion: (id: string) =>
    apiClient.get<AdminQuestion>(`/tests/questions/admin/${id}`),

  createQuestion: (data: CreateQuestionPayload) =>
    apiClient.post<AdminQuestion>('/tests/questions', data),

  updateQuestion: (id: string, data: UpdateQuestionPayload) =>
    apiClient.patch<AdminQuestion>(`/tests/questions/${id}`, data),

  deleteQuestion: (id: string) =>
    apiClient.delete<{ message: string }>(`/tests/questions/${id}`),
}

import { apiClient } from './axios'
import type { LiveCodingTask } from '@/entities/liveCoding'
import type { Roadmap } from '@/entities/roadmap'
import type { TestTheme } from '@/entities/testCatalog'
import type {
  ContentEntry,
  ContentEntryType,
  ContentOrigin,
  MaterialsPagination,
} from '@/entities/types'

export interface AdminContentParams {
  type?: ContentEntryType
  search?: string
  page?: number
  limit?: number
}

export interface AdminContentListResponse {
  items: ContentEntry[]
  pagination: MaterialsPagination
}

export interface CreateContentEntryPayload {
  type: ContentEntryType
  slug: string
  title: string
  payload: Record<string, unknown>
  origin?: ContentOrigin
  sourceUrl?: string
  isPublished?: boolean
}

export type UpdateContentEntryPayload = Partial<CreateContentEntryPayload>

export const contentApi = {
  listRoadmaps: () => apiClient.get<Roadmap[]>('/roadmaps'),
  getRoadmap: (slug: string) => apiClient.get<Roadmap>(`/roadmaps/${slug}`),

  listLiveCodingTasks: () => apiClient.get<LiveCodingTask[]>('/live-coding'),
  getLiveCodingTask: (slug: string) =>
    apiClient.get<LiveCodingTask>(`/live-coding/${slug}`),

  listTestCatalogThemes: () => apiClient.get<TestTheme[]>('/test-catalog/themes'),
  getTestCatalogTheme: (slug: string) =>
    apiClient.get<TestTheme>(`/test-catalog/themes/${slug}`),

  listAdminEntries: (params: AdminContentParams = {}) =>
    apiClient.get<AdminContentListResponse>('/content/admin/entries', { params }),

  getAdminEntry: (id: string) =>
    apiClient.get<ContentEntry>(`/content/admin/entries/${id}`),

  createAdminEntry: (data: CreateContentEntryPayload) =>
    apiClient.post<ContentEntry>('/content/admin/entries', data),

  updateAdminEntry: (id: string, data: UpdateContentEntryPayload) =>
    apiClient.patch<ContentEntry>(`/content/admin/entries/${id}`, data),

  deleteAdminEntry: (id: string) =>
    apiClient.delete<{ message: string }>(`/content/admin/entries/${id}`),
}

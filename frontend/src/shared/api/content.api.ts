import { apiClient } from './axios'
import type { LiveCodingTask } from '@/entities/liveCoding'
import type { Roadmap } from '@/entities/roadmap'
import type { TestTheme } from '@/entities/testCatalog'
import type {
  ContentEntry,
  ContentEntryType,
  ContentImportCandidate,
  ContentImportSource,
  ContentImportStatus,
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

export interface AdminContentSourceParams {
  type?: ContentEntryType
  adapter?: string
  search?: string
  page?: number
  limit?: number
}

export interface AdminContentSourceListResponse {
  items: ContentImportSource[]
  pagination: MaterialsPagination
}

export interface AdminContentCandidateParams {
  type?: ContentEntryType
  status?: ContentImportStatus
  search?: string
  page?: number
  limit?: number
}

export interface AdminContentCandidateListResponse {
  items: ContentImportCandidate[]
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

export interface CreateContentSourcePayload {
  name: string
  url: string
  type: ContentEntryType
  adapter: string
  enabled?: boolean
  config?: Record<string, unknown>
}

export type UpdateContentSourcePayload = Partial<CreateContentSourcePayload>

export interface CreateContentCandidatePayload {
  type: ContentEntryType
  slug?: string
  title: string
  payload: Record<string, unknown>
  sourceUrl?: string
  raw?: Record<string, unknown>
}

export interface RunContentSourceResponse {
  created: number
  skipped: number
  candidates: ContentImportCandidate[]
  message: string
}

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

  listAdminSources: (params: AdminContentSourceParams = {}) =>
    apiClient.get<AdminContentSourceListResponse>('/content/admin/sources', { params }),

  getAdminSource: (id: string) =>
    apiClient.get<ContentImportSource>(`/content/admin/sources/${id}`),

  createAdminSource: (data: CreateContentSourcePayload) =>
    apiClient.post<ContentImportSource>('/content/admin/sources', data),

  updateAdminSource: (id: string, data: UpdateContentSourcePayload) =>
    apiClient.patch<ContentImportSource>(`/content/admin/sources/${id}`, data),

  deleteAdminSource: (id: string) =>
    apiClient.delete<{ message: string }>(`/content/admin/sources/${id}`),

  runAdminSource: (id: string) =>
    apiClient.post<RunContentSourceResponse>(`/content/admin/sources/${id}/run`),

  listAdminCandidates: (params: AdminContentCandidateParams = {}) =>
    apiClient.get<AdminContentCandidateListResponse>('/content/admin/candidates', { params }),

  createAdminCandidate: (data: CreateContentCandidatePayload) =>
    apiClient.post<ContentImportCandidate>('/content/admin/candidates', data),

  publishAdminCandidate: (id: string) =>
    apiClient.post<ContentEntry>(`/content/admin/candidates/${id}/publish`),

  rejectAdminCandidate: (id: string) =>
    apiClient.post<ContentImportCandidate>(`/content/admin/candidates/${id}/reject`),
}

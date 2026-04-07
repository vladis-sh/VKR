import { apiClient } from './axios'
import type { ProfileData, TestHistoryResponse } from '@/entities/types'

export interface UpdateProfilePayload {
  fullName?: string
  knowledgeLevel?: string
}

export const profileApi = {
  getProfile: () =>
    apiClient.get<ProfileData>('/profile'),

  updateProfile: (data: UpdateProfilePayload) =>
    apiClient.patch<ProfileData>('/profile', data),

  uploadAvatar: (formData: FormData) =>
    apiClient.post<{ avatarUrl: string }>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getTestHistory: (params: { page?: number; limit?: number } = {}) =>
    apiClient.get<TestHistoryResponse>('/profile/test-history', { params }),
}

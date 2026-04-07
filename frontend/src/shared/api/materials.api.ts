import { apiClient } from './axios'
import type { Material, MaterialsResponse } from '@/entities/types'

export interface MaterialsParams {
  search?: string
  level?: string
  page?: number
  limit?: number
}

export const materialsApi = {
  getAll: (params: MaterialsParams = {}) =>
    apiClient.get<MaterialsResponse>('/materials', { params }),

  getById: (id: string) =>
    apiClient.get<Material>(`/materials/${id}`),

  getFavorites: () =>
    apiClient.get<Material[]>('/materials/favorites'),

  addFavorite: (id: string) =>
    apiClient.post<void>(`/materials/${id}/favorite`),

  removeFavorite: (id: string) =>
    apiClient.delete<void>(`/materials/${id}/favorite`),
}

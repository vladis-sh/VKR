import { apiClient } from './axios'
import type { NotificationSettings } from '@/entities/types'

export const notificationsApi = {
  getSettings: () =>
    apiClient.get<NotificationSettings>('/notifications'),

  updateSettings: (data: NotificationSettings) =>
    apiClient.put<NotificationSettings>('/notifications', data),
}

import { apiClient } from './axios'
import type { User } from '@/entities/types'

export interface RegisterStep1Payload {
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterStep2Payload {
  fullName: string
}

export interface RegisterStep3Payload {
  knowledgeLevel: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: (data: RegisterStep1Payload) =>
    apiClient.post<{ user: User }>('/auth/register', data),

  registerProfile: (data: RegisterStep2Payload) =>
    apiClient.post<{ user: User }>('/auth/register/profile', data),

  registerLevel: (data: RegisterStep3Payload) =>
    apiClient.post<{ user: User }>('/auth/register/level', data),

  login: (data: LoginPayload) =>
    apiClient.post<{ user: User }>('/auth/login', data),

  logout: () =>
    apiClient.post<void>('/auth/logout'),

  refresh: () =>
    apiClient.post<{ user: User }>('/auth/refresh'),

  me: () =>
    apiClient.get<{ user: User }>('/auth/me'),

  verifyEmail: (token: string) =>
    apiClient.post<{ user: User }>('/auth/verify-email', { token }),

  resendVerification: () =>
    apiClient.post<{ message: string }>('/auth/resend-verification'),

  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; password: string; confirmPassword: string }) =>
    apiClient.post<{ message: string }>('/auth/reset-password', data),
}

import { create } from 'zustand'
import type { ToastVariant } from '@/shared/ui/Toast'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  add: (message: string, variant?: ToastVariant) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message, variant = 'info') => {
    const id = Math.random().toString(36).slice(2, 9)
    set((state) => ({
      toasts: [...state.toasts.slice(-4), { id, message, variant }],
    }))
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export const toast = {
  success: (message: string) => useToastStore.getState().add(message, 'success'),
  error: (message: string) => useToastStore.getState().add(message, 'error'),
  info: (message: string) => useToastStore.getState().add(message, 'info'),
}

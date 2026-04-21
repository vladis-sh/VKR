import { create } from 'zustand'

interface RegisterData {
  email: string
  password: string
  fullName: string
  avatarFile?: File
}

interface RegisterState {
  data: Partial<RegisterData>
  currentStep: number
  setStep1: (data: { email: string; password: string }) => void
  setStep2: (data: { fullName: string; avatarFile?: File }) => void
  reset: () => void
}

export const useRegisterStore = create<RegisterState>((set) => ({
  data: {},
  currentStep: 1,

  setStep1: (data) =>
    set((state) => ({
      data: { ...state.data, ...data },
      currentStep: 2,
    })),

  setStep2: (data) =>
    set((state) => ({
      data: { ...state.data, ...data },
    })),

  reset: () => set({ data: {}, currentStep: 1 }),
}))

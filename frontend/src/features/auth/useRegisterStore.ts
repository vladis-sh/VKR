import { create } from 'zustand'

interface RegisterData {
  email: string
  password: string
  fullName: string
  avatarFile?: File
  knowledgeLevel: string
}

interface RegisterState {
  data: Partial<RegisterData>
  currentStep: number
  setStep1: (data: { email: string; password: string }) => void
  setStep2: (data: { fullName: string; avatarFile?: File }) => void
  setStep3: (data: { knowledgeLevel: string }) => void
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
      currentStep: 3,
    })),

  setStep3: (data) =>
    set((state) => ({
      data: { ...state.data, ...data },
    })),

  reset: () => set({ data: {}, currentStep: 1 }),
}))

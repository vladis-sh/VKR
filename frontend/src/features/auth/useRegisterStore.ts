import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Step 1 creates the account server-side and sets auth cookies, so the store
// only needs to remember that step 1 happened (and for which email) — step 2
// uses it to redirect back if opened directly. Never store the password here.
interface RegisterState {
  data: { email?: string }
  setStep1: (data: { email: string }) => void
  reset: () => void
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      data: {},
      setStep1: (data) => set({ data }),
      reset: () => set({ data: {} }),
    }),
    {
      name: 'app.register',
      storage: createJSONStorage(() => sessionStorage),
      // v1 drops the old shape that persisted the plaintext password.
      version: 1,
    }
  )
)

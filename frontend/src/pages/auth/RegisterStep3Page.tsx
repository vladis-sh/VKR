import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { useRegisterStore } from '@/features/auth/useRegisterStore'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { authApi } from '@/shared/api/auth.api'
import { KNOWLEDGE_LEVELS } from '@/shared/constants'
import { cn } from '@/shared/lib/cn'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'
import { toast } from '@/features/theme/useToastStore'

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            n <= current ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2 shrink-0">Шаг 3 из 3</span>
    </div>
  )
}

export default function RegisterStep3Page() {
  const navigate = useNavigate()
  const { data: regData, setStep3, reset } = useRegisterStore()
  const { setUser } = useAuthStore()
  const [selected, setSelected] = useState<string>('junior')
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleFinish = async () => {
    if (!regData.email) {
      navigate('/register')
      return
    }

    setIsLoading(true)
    setServerError('')
    try {
      const res = await authApi.registerLevel({ knowledgeLevel: selected })
      setStep3({ knowledgeLevel: selected })
      setUser(res.data.user)
      reset()
      toast.success('Добро пожаловать в PrepAI!')
      navigate('/app/materials', { replace: true })
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Ошибка при завершении регистрации'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-bold text-foreground mb-1">Ваш уровень</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Укажите текущий уровень подготовки
          </p>

          <StepDots current={3} />

          <div className="space-y-3 mb-6">
            {KNOWLEDGE_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setSelected(level.value)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                  selected === level.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:border-primary/40'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selected === level.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-secondary text-muted-foreground'
                  )}
                >
                  {selected === level.value ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span className="text-xs font-bold">{level.label[0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
              </button>
            ))}
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2"
            >
              <p className="text-sm font-medium text-destructive">
                Не удалось завершить регистрацию
              </p>
              <p className="mt-0.5 text-xs text-destructive/90">{serverError}</p>
            </div>
          )}

          <Button className="w-full" loading={isLoading} onClick={handleFinish}>
            Начать подготовку
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full mt-2 text-muted-foreground"
            onClick={() => navigate('/register/profile')}
          >
            Назад
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BrainCircuit } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useRegisterStore } from '@/features/auth/useRegisterStore'
import { authApi } from '@/shared/api/auth.api'

const schema = z
  .object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

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
      <span className="text-xs text-muted-foreground ml-2 shrink-0">Шаг 1 из 3</span>
    </div>
  )
}

export default function RegisterStep1Page() {
  const navigate = useNavigate()
  const { setStep1 } = useRegisterStore()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError('')
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      setStep1({ email: data.email, password: data.password })
      navigate('/register/profile')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string; details?: string[] } } } }
      const details = error.response?.data?.error?.details
      const message = details?.[0] ?? error.response?.data?.error?.message ?? 'Ошибка при регистрации'
      setServerError(message)
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
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">PrepAI</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-bold text-foreground mb-1">Создать аккаунт</h1>
          <p className="text-sm text-muted-foreground mb-5">Бесплатно. Без карты.</p>

          <StepDots current={1} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Подтвердите пароль"
              type="password"
              placeholder="Повторите пароль"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {serverError && (
              <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              Продолжить
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

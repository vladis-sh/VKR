import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useRegisterStore } from '@/features/auth/useRegisterStore'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { authApi } from '@/shared/api/auth.api'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'
import { isRussianEmail, RUSSIAN_EMAIL_MESSAGE } from '@/shared/lib/russianEmail'

const schema = z
  .object({
    email: z
      .string()
      .email('Некорректный email')
      .refine(isRussianEmail, RUSSIAN_EMAIL_MESSAGE),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .max(100, 'Максимум 100 символов')
      .regex(/[A-Z]/, 'Добавьте хотя бы одну заглавную букву')
      .regex(/[a-z]/, 'Добавьте хотя бы одну строчную букву')
      .regex(/\d/, 'Добавьте хотя бы одну цифру')
      .regex(/[^A-Za-z0-9]/, 'Добавьте хотя бы один специальный символ'),
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
      {[1, 2].map((n) => (
        <div
          key={n}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            n <= current ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2 shrink-0">Шаг 1 из 2</span>
    </div>
  )
}

export default function RegisterStep1Page() {
  const navigate = useNavigate()
  const { setStep1 } = useRegisterStore()
  const { setUser } = useAuthStore()
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
      const res = await authApi.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      setUser(res.data.user)
      setStep1({ email: data.email })
      navigate('/register/profile')
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Ошибка при регистрации'))
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
          <h1 className="text-xl font-bold text-foreground mb-5">Создать аккаунт</h1>

          <StepDots current={1} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="ivan@yandex.ru"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Пароль"
              type="password"
              placeholder="Password123!"
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
              <div
                role="alert"
                className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2"
              >
                <p className="text-sm font-medium text-destructive">
                  Не удалось создать аккаунт
                </p>
                <p className="mt-0.5 text-xs text-destructive/90">{serverError}</p>
              </div>
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

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { authApi } from '@/shared/api/auth.api'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'
import { toast } from '@/features/theme/useToastStore'

const schema = z
  .object({
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

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
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
      await authApi.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success('Пароль изменён. Войдите с новым паролем.')
      navigate('/login', { replace: true })
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Не удалось сбросить пароль'))
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
          <h1 className="text-xl font-bold text-foreground mb-1">Новый пароль</h1>

          {!token ? (
            <p className="mt-4 text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
              Ссылка некорректна — в ней нет токена. Запросите сброс пароля заново.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Придумайте новый пароль для входа.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                  label="Новый пароль"
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
                  <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
                    {serverError}
                  </p>
                )}

                <Button type="submit" className="w-full" loading={isLoading}>
                  Сохранить пароль
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline font-medium">
            Вернуться ко входу
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { authApi } from '@/shared/api/auth.api'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'

const schema = z.object({
  email: z.string().email('Некорректный email'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
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
      await authApi.forgotPassword(data.email)
      setSent(true)
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Не удалось отправить письмо'))
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
          <h1 className="text-xl font-bold text-foreground mb-1">Восстановление пароля</h1>

          {sent ? (
            <div className="mt-4 rounded-lg border border-primary/25 bg-primary/10 px-3 py-3">
              <p className="text-sm text-foreground">
                Если аккаунт с таким email существует, мы отправили письмо со ссылкой для сброса
                пароля. Проверьте почту.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Введите email — пришлём ссылку для сброса пароля.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                {serverError && (
                  <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
                    {serverError}
                  </p>
                )}

                <Button type="submit" className="w-full" loading={isLoading}>
                  Отправить ссылку
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

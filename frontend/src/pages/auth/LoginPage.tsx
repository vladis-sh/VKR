import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BrainCircuit } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { authApi } from '@/shared/api/auth.api'
import { toast } from '@/features/theme/useToastStore'

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/app/materials', { replace: true })
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError('')
    try {
      const res = await authApi.login(data)
      setUser(res.data.user)
      toast.success('Добро пожаловать!')
      navigate('/app/materials', { replace: true })
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const raw = e?.response?.data?.message
      const msg = Array.isArray(raw) ? raw[0] : (raw ?? 'Неверный email или пароль')
      setServerError(msg)
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
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">PrepAI</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-bold text-foreground mb-1">Войти</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Введите свои данные для входа
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

            {/* Input has built-in password toggle via type="password" */}
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              Войти
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

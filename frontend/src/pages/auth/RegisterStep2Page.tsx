import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useRegisterStore } from '@/features/auth/useRegisterStore'
import { authApi } from '@/shared/api/auth.api'
import { profileApi } from '@/shared/api/profile.api'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'
import { resizeAvatarFile } from '@/shared/lib/avatarImage'

const schema = z.object({
  fullName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
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
      <span className="text-xs text-muted-foreground ml-2 shrink-0">Шаг 2 из 3</span>
    </div>
  )
}

export default function RegisterStep2Page() {
  const navigate = useNavigate()
  const { data: regData, setStep2 } = useRegisterStore()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarScale, setAvatarScale] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setServerError('Только изображения')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setServerError('Файл слишком большой (макс. 5 МБ)')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setServerError('')
  }

  const onSubmit = async (formData: FormData) => {
    if (!regData.email) {
      navigate('/register')
      return
    }

    setIsLoading(true)
    setServerError('')
    try {
      await authApi.registerProfile({ fullName: formData.fullName })

      if (avatarFile) {
        const avatarForm = new FormData()
        const preparedAvatar = await resizeAvatarFile(avatarFile, avatarScale / 100)
        avatarForm.append('file', preparedAvatar)
        await profileApi.uploadAvatar(avatarForm)
      }

      setStep2({ fullName: formData.fullName, avatarFile: avatarFile ?? undefined })
      navigate('/register/level')
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Ошибка при сохранении профиля'))
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
          <h1 className="text-xl font-bold text-foreground mb-1">Ваш профиль</h1>
          <p className="text-sm text-muted-foreground mb-5">Как вас зовут?</p>

          <StepDots current={2} />

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="h-20 w-20 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                    style={{ transform: `scale(${avatarScale / 100})` }}
                  />
                ) : (
                  <Camera size={24} className="text-muted-foreground" />
                )}
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
                  onClick={() => {
                    setAvatarPreview(null)
                    setAvatarFile(null)
                    setAvatarScale(100)
                  }}
                >
                  <X size={11} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {avatarPreview && (
            <div className="mb-6 rounded-lg border border-border bg-secondary/40 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-foreground">Размер фото</span>
                <span className="text-xs text-muted-foreground">{avatarScale}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="150"
                step="5"
                value={avatarScale}
                onChange={(event) => setAvatarScale(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Имя"
              type="text"
              placeholder="Иван Иванов"
              autoComplete="name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            {serverError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2"
              >
                <p className="text-sm font-medium text-destructive">Не удалось сохранить профиль</p>
                <p className="mt-0.5 text-xs text-destructive/90">{serverError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              Продолжить
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => navigate('/register')}
            >
              Назад
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

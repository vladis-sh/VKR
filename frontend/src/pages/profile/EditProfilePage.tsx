import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Camera, X, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { profileApi } from '@/shared/api/profile.api'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { KNOWLEDGE_LEVELS } from '@/shared/constants'
import { cn } from '@/shared/lib/cn'
import { toast } from '@/features/theme/useToastStore'

const schema = z.object({
  fullName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  knowledgeLevel: z.enum(['junior', 'middle', 'senior']),
})

type FormData = z.infer<typeof schema>

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      knowledgeLevel: user?.knowledgeLevel ?? 'junior',
    },
  })

  const selectedLevel = watch('knowledgeLevel')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Только изображения'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Файл слишком большой (макс. 5 МБ)'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      let avatarUrl = user?.avatarUrl
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        const uploadRes = await profileApi.uploadAvatar(formData)
        avatarUrl = uploadRes.data.avatarUrl
      }
      const res = await profileApi.updateProfile({
        fullName: data.fullName,
        knowledgeLevel: data.knowledgeLevel,
      })
      setUser({ ...user!, ...res.data, avatarUrl })
      toast.success('Профиль обновлён')
      navigate('/app/profile')
    } catch {
      toast.error('Не удалось сохранить профиль')
    } finally {
      setIsSaving(false)
    }
  }

  const currentAvatar = avatarPreview

  return (
    <div className="mx-auto max-w-md space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/app/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Редактировать профиль</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="h-24 w-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera size={22} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Фото</span>
                </div>
              )}
            </div>
            {avatarFile && (
              <button
                type="button"
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
                onClick={() => { setAvatarPreview(user?.avatarUrl ?? null); setAvatarFile(null) }}
              >
                <X size={11} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            Изменить фото
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <Input
            label="Имя"
            placeholder="Иван Иванов"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          {/* Knowledge level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Уровень подготовки</label>
            <div className="space-y-2">
              {KNOWLEDGE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setValue('knowledgeLevel', level.value as 'junior' | 'middle' | 'senior', { shouldDirty: true })}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all',
                    selectedLevel === level.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selectedLevel === level.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-border text-muted-foreground'
                  )}>
                    {selectedLevel === level.value
                      ? <CheckCircle size={14} />
                      : <span className="text-[10px] font-bold">{level.label[0]}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{level.label}</p>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            loading={isSaving}
            disabled={!isDirty && !avatarFile}
          >
            Сохранить изменения
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => navigate('/app/profile')}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}


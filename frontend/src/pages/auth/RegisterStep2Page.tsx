import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Move, RotateCcw, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useRegisterStore } from '@/features/auth/useRegisterStore'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { authApi } from '@/shared/api/auth.api'
import { profileApi } from '@/shared/api/profile.api'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'
import { cropAvatarFile } from '@/shared/lib/avatarImage'
import { toast } from '@/features/theme/useToastStore'
const CROP_VIEWPORT_SIZE = 220
const MIN_CROP_ZOOM = 1
const MAX_CROP_ZOOM = 3

const schema = z.object({
  fullName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
})
type FormData = z.infer<typeof schema>

interface CropOffset {
  x: number
  y: number
}

interface ImageSize {
  width: number
  height: number
}

interface CropDragState {
  pointerId: number
  startX: number
  startY: number
  startOffset: CropOffset
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getCropMetrics(imageSize: ImageSize, zoom: number) {
  const baseScale = CROP_VIEWPORT_SIZE / Math.min(imageSize.width, imageSize.height)
  const renderedWidth = imageSize.width * baseScale * zoom
  const renderedHeight = imageSize.height * baseScale * zoom

  return {
    renderedWidth,
    renderedHeight,
    maxX: Math.max(0, (renderedWidth - CROP_VIEWPORT_SIZE) / 2),
    maxY: Math.max(0, (renderedHeight - CROP_VIEWPORT_SIZE) / 2),
  }
}

function readImageSize(src: string) {
  return new Promise<ImageSize>((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      })
    }
    image.onerror = () => reject(new Error('Не удалось прочитать изображение'))
    image.src = src
  })
}

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
      <span className="text-xs text-muted-foreground ml-2 shrink-0">Шаг 2 из 2</span>
    </div>
  )
}

export default function RegisterStep2Page() {
  const navigate = useNavigate()
  const { data: regData, setStep2, reset } = useRegisterStore()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarImageSize, setAvatarImageSize] = useState<ImageSize | null>(null)
  const [cropZoom, setCropZoom] = useState(MIN_CROP_ZOOM)
  const [cropOffset, setCropOffset] = useState<CropOffset>({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const dragStateRef = useRef<CropDragState | null>(null)
  // Track which server-side steps succeeded so retry doesn't redo completed work
  // (e.g. avoid re-posting registerProfile which would 409 "already registered").
  const profileCreatedRef = useRef(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  const clearObjectPreview = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }
  }

  const clampCropOffset = (
    nextOffset: CropOffset,
    zoom = cropZoom,
    imageSize = avatarImageSize
  ) => {
    if (!imageSize) {
      return nextOffset
    }

    const metrics = getCropMetrics(imageSize, zoom)

    return {
      x: clamp(nextOffset.x, -metrics.maxX, metrics.maxX),
      y: clamp(nextOffset.y, -metrics.maxY, metrics.maxY),
    }
  }

  const resetAvatarSelection = () => {
    clearObjectPreview()
    setAvatarPreview(null)
    setAvatarFile(null)
    setAvatarImageSize(null)
    setCropZoom(MIN_CROP_ZOOM)
    setCropOffset({ x: 0, y: 0 })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFilePicker = () => {
    if (!fileInputRef.current) return

    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setServerError('Только изображения')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerError('Файл слишком большой (макс. 5 МБ)')
      event.target.value = ''
      return
    }

    clearObjectPreview()

    const previewUrl = URL.createObjectURL(file)

    previewObjectUrlRef.current = previewUrl
    setAvatarFile(file)
    setAvatarPreview(previewUrl)
    setAvatarImageSize(null)
    setCropZoom(MIN_CROP_ZOOM)
    setCropOffset({ x: 0, y: 0 })
    setServerError('')

    readImageSize(previewUrl)
      .then((size) => {
        if (previewObjectUrlRef.current !== previewUrl) return
        setAvatarImageSize(size)
      })
      .catch(() => {
        if (previewObjectUrlRef.current !== previewUrl) return
        setServerError('Не удалось прочитать изображение')
        resetAvatarSelection()
      })
  }

  const handleZoomChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextZoom = Number(event.target.value)

    setCropZoom(nextZoom)
    setCropOffset((current) => clampCropOffset(current, nextZoom))
  }

  const handleCropPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!avatarFile || !avatarImageSize) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: cropOffset,
    }
  }

  const handleCropPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) return

    const nextOffset = {
      x: dragState.startOffset.x + event.clientX - dragState.startX,
      y: dragState.startOffset.y + event.clientY - dragState.startY,
    }

    setCropOffset(clampCropOffset(nextOffset))
  }

  const handleCropPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = null
  }

  const onSubmit = async (formData: FormData) => {
    if (!regData.email) {
      navigate('/register')
      return
    }

    setIsLoading(true)
    setServerError('')

    // Step 1: save name. Skip if a previous attempt already succeeded.
    if (!profileCreatedRef.current) {
      try {
        await authApi.registerProfile({ fullName: formData.fullName })
        profileCreatedRef.current = true
      } catch (err: unknown) {
        setServerError(getApiErrorMessage(err, 'Не удалось сохранить имя'))
        setIsLoading(false)
        return
      }
    }

    // Step 2: avatar is optional — a failure here must not block registration.
    if (avatarFile) {
      try {
        const avatarForm = new FormData()
        const preparedAvatar = await cropAvatarFile(avatarFile, {
          zoom: cropZoom,
          offsetX: cropOffset.x,
          offsetY: cropOffset.y,
          viewportSize: CROP_VIEWPORT_SIZE,
        })
        avatarForm.append('file', preparedAvatar)
        await profileApi.uploadAvatar(avatarForm)
      } catch {
        toast.error('Не удалось загрузить аватар. Вы сможете добавить его позже в профиле.')
      }
    }
    setStep2({ fullName: formData.fullName, avatarFile: avatarFile ?? undefined })
    setUser({ ...regData, fullName: formData.fullName } as any) // подстрой под свою структуру
    reset()
    toast.success('Добро пожаловать!')
    navigate('/app/roadmaps', { replace: true })

    setIsLoading(false)

    // Step 3: knowledge level. If this fails the user can retry — step 1 won't re-run.
    // try {
    //   const res = await authApi.registerLevel({})
    //   setStep2({ fullName: formData.fullName, avatarFile: avatarFile ?? undefined })
    //   setUser(res.data.user)
    //   reset()
    //   toast.success('Добро пожаловать!')
    //   navigate('/app/roadmaps', { replace: true })
    // } catch (err: unknown) {
    //   setServerError(getApiErrorMessage(err, 'Не удалось сохранить уровень'))
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const isAvatarPreparing = Boolean(avatarFile && !avatarImageSize)
  const cropMetrics = avatarImageSize ? getCropMetrics(avatarImageSize, cropZoom) : null
  const cropImageStyle = cropMetrics
    ? {
        width: `${cropMetrics.renderedWidth}px`,
        height: `${cropMetrics.renderedHeight}px`,
        transform: `translate3d(${
          (CROP_VIEWPORT_SIZE - cropMetrics.renderedWidth) / 2 + cropOffset.x
        }px, ${(CROP_VIEWPORT_SIZE - cropMetrics.renderedHeight) / 2 + cropOffset.y}px, 0)`,
      }
    : undefined

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

          <div className="mb-6">
            {avatarFile ? (
              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Область аватара</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Перетащите фото внутри круга и выберите нужный масштаб.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={resetAvatarSelection}
                    aria-label="Убрать выбранное фото"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                  <div
                    className="relative overflow-hidden rounded-full bg-secondary shadow-inner ring-1 ring-border touch-none cursor-grab active:cursor-grabbing"
                    style={{
                      width: CROP_VIEWPORT_SIZE,
                      height: CROP_VIEWPORT_SIZE,
                    }}
                    role="application"
                    aria-label="Область обрезки аватара"
                    onPointerDown={handleCropPointerDown}
                    onPointerMove={handleCropPointerMove}
                    onPointerUp={handleCropPointerEnd}
                    onPointerCancel={handleCropPointerEnd}
                  >
                    {avatarPreview && cropImageStyle ? (
                      <img
                        src={avatarPreview}
                        alt="Выбранный аватар"
                        className="absolute left-0 top-0 max-w-none select-none"
                        style={cropImageStyle}
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Camera size={24} className="text-muted-foreground" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/70 ring-offset-2 ring-offset-background" />
                    <div className="pointer-events-none absolute left-1/3 top-0 h-full w-px bg-white/40" />
                    <div className="pointer-events-none absolute left-2/3 top-0 h-full w-px bg-white/40" />
                    <div className="pointer-events-none absolute left-0 top-1/3 h-px w-full bg-white/40" />
                    <div className="pointer-events-none absolute left-0 top-2/3 h-px w-full bg-white/40" />
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs text-secondary-foreground">
                    <Move size={14} />
                    Двигайте фото, чтобы выбрать область
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="register-avatar-zoom"
                      className="text-sm font-medium text-foreground"
                    >
                      Масштаб
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(cropZoom * 100)}%
                    </span>
                  </div>
                  <input
                    id="register-avatar-zoom"
                    type="range"
                    min={MIN_CROP_ZOOM}
                    max={MAX_CROP_ZOOM}
                    step="0.05"
                    value={cropZoom}
                    onChange={handleZoomChange}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCropZoom(MIN_CROP_ZOOM)
                      setCropOffset({ x: 0, y: 0 })
                    }}
                  >
                    <RotateCcw size={14} />
                    Сбросить позицию
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={openFilePicker}>
                    Выбрать другое фото
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary transition-colors hover:border-primary"
                  onClick={openFilePicker}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Camera size={22} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Фото</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={openFilePicker}
                >
                  Добавить фото
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

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

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isAvatarPreparing}
            >
              Начать подготовку
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

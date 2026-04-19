import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Camera, Move, RotateCcw, X } from 'lucide-react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { profileApi } from '@/shared/api/profile.api'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { cropAvatarFile } from '@/shared/lib/avatarImage'
import { toast } from '@/features/theme/useToastStore'

const CROP_VIEWPORT_SIZE = 220
const MIN_CROP_ZOOM = 1
const MAX_CROP_ZOOM = 3

const schema = z.object({
  fullName: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов'),
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

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarImageSize, setAvatarImageSize] = useState<ImageSize | null>(null)
  const [cropZoom, setCropZoom] = useState(MIN_CROP_ZOOM)
  const [cropOffset, setCropOffset] = useState<CropOffset>({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const dragStateRef = useRef<CropDragState | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? '',
    },
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
    setAvatarPreview(user?.avatarUrl ?? null)
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
      toast.error('Только изображения')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл слишком большой (макс. 5 МБ)')
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

    readImageSize(previewUrl)
      .then((size) => {
        if (previewObjectUrlRef.current !== previewUrl) return
        setAvatarImageSize(size)
      })
      .catch(() => {
        if (previewObjectUrlRef.current !== previewUrl) return
        toast.error('Не удалось прочитать изображение')
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

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      let avatarUrl = user?.avatarUrl
      if (avatarFile) {
        const formData = new FormData()
        const preparedAvatar = await cropAvatarFile(avatarFile, {
          zoom: cropZoom,
          offsetX: cropOffset.x,
          offsetY: cropOffset.y,
          viewportSize: CROP_VIEWPORT_SIZE,
        })
        formData.append('file', preparedAvatar)
        const uploadRes = await profileApi.uploadAvatar(formData)
        avatarUrl = uploadRes.data.avatarUrl
      }
      const res = await profileApi.updateProfile({
        fullName: data.fullName,
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
  const isAvatarPreparing = Boolean(avatarFile && !avatarImageSize)
  const cropMetrics = avatarImageSize ? getCropMetrics(avatarImageSize, cropZoom) : null
  const cropImageStyle = cropMetrics
    ? {
        width: `${cropMetrics.renderedWidth}px`,
        height: `${cropMetrics.renderedHeight}px`,
        transform: `translate3d(${
          (CROP_VIEWPORT_SIZE - cropMetrics.renderedWidth) / 2 + cropOffset.x
        }px, ${
          (CROP_VIEWPORT_SIZE - cropMetrics.renderedHeight) / 2 + cropOffset.y
        }px, 0)`,
      }
    : undefined

  return (
    <div className="mx-auto max-w-md space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/app/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Редактировать профиль</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Avatar */}
        <div className="space-y-3">
          {avatarFile ? (
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
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
                  <label htmlFor="avatar-zoom" className="text-sm font-medium text-foreground">
                    Масштаб
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(cropZoom * 100)}%
                  </span>
                </div>
                <input
                  id="avatar-zoom"
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={openFilePicker}
                >
                  Выбрать другое фото
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary transition-colors hover:border-primary"
                onClick={openFilePicker}
              >
                {currentAvatar ? (
                  <img src={currentAvatar} alt="Аватар" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera size={22} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Фото</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={openFilePicker}
              >
                Изменить фото
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

        {/* Name */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <Input
            label="Имя"
            placeholder="Иван Иванов"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            loading={isSaving}
            disabled={(!isDirty && !avatarFile) || isAvatarPreparing}
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

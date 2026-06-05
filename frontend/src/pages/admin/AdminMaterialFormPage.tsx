import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import {
  useAdminMaterial,
  useCreateMaterial,
  useUpdateMaterial,
} from '@/features/admin/useAdminMaterials'
import type { KnowledgeLevel } from '@/entities/types'

const materialSchema = z.object({
  title: z.string().min(1, 'Введите название').max(200),
  shortDescription: z.string().min(1, 'Введите краткое описание').max(500),
  level: z.enum(['junior', 'middle', 'senior']),
  tagsRaw: z.string(),
  content: z.string().min(1, 'Контент не может быть пустым'),
  isPublished: z.boolean(),
})

type MaterialForm = z.infer<typeof materialSchema>

export default function AdminMaterialFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const { data: existing, isLoading: isLoadingExisting } = useAdminMaterial(id)
  const createMaterial = useCreateMaterial()
  const updateMaterial = useUpdateMaterial(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MaterialForm>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      level: 'junior',
      tagsRaw: '',
      content: '',
      isPublished: true,
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        shortDescription: existing.shortDescription,
        level: existing.level,
        tagsRaw: (existing.tags ?? []).join(', '),
        content: existing.content ?? '',
        isPublished: existing.isPublished ?? true,
      })
    }
  }, [existing, reset])

  const contentPreview = watch('content')

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      shortDescription: values.shortDescription.trim(),
      level: values.level as KnowledgeLevel,
      tags: values.tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      content: values.content,
      isPublished: values.isPublished,
    }

    if (isEdit) {
      await updateMaterial.mutateAsync(payload)
    } else {
      await createMaterial.mutateAsync(payload)
    }
    navigate('/app/admin/materials')
  })

  if (isEdit && isLoadingExisting) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link
        to="/app/admin/materials"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} />К списку материалов
      </Link>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          {isEdit ? 'Редактирование материала' : 'Новый материал'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <Input label="Название" error={errors.title?.message} {...register('title')} />
          <Input
            label="Краткое описание"
            error={errors.shortDescription?.message}
            {...register('shortDescription')}
          />

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Уровень</label>
              <select
                {...register('level')}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="junior">Junior</option>
                <option value="middle">Middle</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <Input
              label="Теги (через запятую)"
              error={errors.tagsRaw?.message}
              {...register('tagsRaw')}
            />
          </div> */}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isPublished')} />
            Опубликован (виден пользователям)
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              Контент (Markdown)
            </label>
            <textarea
              {...register('content')}
              rows={20}
              className="w-full rounded-lg border border-input bg-background p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.content?.message && (
              <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground mb-2">Предпросмотр</p>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{contentPreview || '_Введите контент слева_'}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/app/admin/materials')}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}

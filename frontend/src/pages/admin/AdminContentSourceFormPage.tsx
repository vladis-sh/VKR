import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import {
  useAdminContentSource,
  useCreateContentSource,
  useUpdateContentSource,
} from '@/features/admin/useAdminContent'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import type { ContentEntryType } from '@/entities/types'

const sourceSchema = z.object({
  name: z.string().min(1, 'Введите название').max(160),
  url: z.string().min(1, 'Введите URL').max(500),
  type: z.enum(['roadmap', 'live_coding_task', 'test_catalog_theme']),
  adapter: z.string().min(1, 'Введите adapter').max(80),
  enabled: z.boolean(),
  configJson: z
    .string()
    .min(2, 'Введите JSON config')
    .refine((value) => {
      try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      } catch {
        return false
      }
    }, 'Config должен быть JSON-объектом'),
})

type SourceForm = z.infer<typeof sourceSchema>

const defaultConfig = {
  license: 'topic-reference-only',
  candidates: [],
}

function formatJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2)
}

export default function AdminContentSourceFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { data: existing, isLoading: isLoadingExisting } = useAdminContentSource(id)
  const createSource = useCreateContentSource()
  const updateSource = useUpdateContentSource(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SourceForm>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: '',
      url: '',
      type: 'roadmap',
      adapter: 'manual_json',
      enabled: true,
      configJson: formatJson(defaultConfig),
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        url: existing.url,
        type: existing.type,
        adapter: existing.adapter,
        enabled: existing.enabled,
        configJson: formatJson(existing.config ?? defaultConfig),
      })
    }
  }, [existing, reset])

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name.trim(),
      url: values.url.trim(),
      type: values.type as ContentEntryType,
      adapter: values.adapter.trim(),
      enabled: values.enabled,
      config: JSON.parse(values.configJson) as Record<string, unknown>,
    }

    if (isEdit) {
      await updateSource.mutateAsync(payload)
    } else {
      await createSource.mutateAsync(payload)
    }

    navigate('/app/admin/content/sources')
  })

  if (isEdit && isLoadingExisting) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link
        to="/app/admin/content/sources"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} />
        К источникам
      </Link>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          {isEdit ? 'Редактировать источник' : 'Новый источник'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Название" error={errors.name?.message} {...register('name')} />
            <Input label="URL" error={errors.url?.message} {...register('url')} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Тип контента</label>
              <select
                {...register('type')}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="roadmap">Roadmap</option>
                <option value="live_coding_task">Live coding task</option>
                <option value="test_catalog_theme">Test catalog theme</option>
              </select>
            </div>
            <Input
              label="Adapter"
              error={errors.adapter?.message}
              hint="manual_json, rss, github, docs, custom"
              {...register('adapter')}
            />
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('enabled')} />
            Источник активен
          </label>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <label className="mb-2 block text-sm font-medium text-foreground">Config JSON</label>
          <textarea
            {...register('configJson')}
            rows={22}
            spellCheck={false}
            className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.configJson?.message && (
            <p className="mt-1 text-xs text-destructive">{errors.configJson.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app/admin/content/sources')}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}

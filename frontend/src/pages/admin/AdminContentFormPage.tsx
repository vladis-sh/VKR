import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import {
  useAdminContentEntry,
  useCreateContentEntry,
  useUpdateContentEntry,
} from '@/features/admin/useAdminContent'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import type { ContentEntryType } from '@/entities/types'

const contentSchema = z.object({
  type: z.enum(['roadmap', 'live_coding_task', 'test_catalog_theme']),
  slug: z.string().min(1, 'Enter slug').max(160),
  title: z.string().min(1, 'Enter title').max(240),
  sourceUrl: z.string().max(500).optional(),
  payloadJson: z
    .string()
    .min(2, 'Enter JSON payload')
    .refine((value) => {
      try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      } catch {
        return false
      }
    }, 'Payload must be a valid JSON object'),
  isPublished: z.boolean(),
})

type ContentForm = z.infer<typeof contentSchema>

function formatJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2)
}

export default function AdminContentFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { data: existing, isLoading: isLoadingExisting } = useAdminContentEntry(id)
  const createEntry = useCreateContentEntry()
  const updateEntry = useUpdateContentEntry(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'roadmap',
      slug: '',
      title: '',
      sourceUrl: '',
      payloadJson: '{}',
      isPublished: true,
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        type: existing.type,
        slug: existing.slug,
        title: existing.title,
        sourceUrl: existing.sourceUrl ?? '',
        payloadJson: formatJson(existing.payload),
        isPublished: existing.isPublished,
      })
    }
  }, [existing, reset])

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      type: values.type as ContentEntryType,
      slug: values.slug.trim(),
      title: values.title.trim(),
      sourceUrl: values.sourceUrl?.trim() || undefined,
      payload: JSON.parse(values.payloadJson) as Record<string, unknown>,
      isPublished: values.isPublished,
    }

    if (isEdit) {
      await updateEntry.mutateAsync(payload)
    } else {
      await createEntry.mutateAsync(payload)
    }

    navigate('/app/admin/content')
  })

  if (isEdit && isLoadingExisting) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link
        to="/app/admin/content"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to content
      </Link>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          {isEdit ? 'Edit content entry' : 'New content entry'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Type</label>
              <select
                {...register('type')}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="roadmap">Roadmap</option>
                <option value="live_coding_task">Live coding task</option>
                <option value="test_catalog_theme">Test catalog theme</option>
              </select>
            </div>
            <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
            <Input label="Title" error={errors.title?.message} {...register('title')} />
            <Input label="Source URL" error={errors.sourceUrl?.message} {...register('sourceUrl')} />
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isPublished')} />
            Published
          </label>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <label className="mb-2 block text-sm font-medium text-foreground">Payload JSON</label>
          <textarea
            {...register('payloadJson')}
            rows={26}
            spellCheck={false}
            className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.payloadJson?.message && (
            <p className="mt-1 text-xs text-destructive">{errors.payloadJson.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/app/admin/content')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

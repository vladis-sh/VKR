import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useCreateContentCandidate } from '@/features/admin/useAdminContent'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import type { ContentEntryType } from '@/entities/types'

const candidateSchema = z.object({
  type: z.enum(['roadmap', 'live_coding_task', 'test_catalog_theme']),
  slug: z.string().max(160).optional(),
  title: z.string().min(1, 'Введите название').max(240),
  sourceUrl: z.string().max(500).optional(),
  payloadJson: z
    .string()
    .min(2, 'Введите JSON payload')
    .refine((value) => {
      try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      } catch {
        return false
      }
    }, 'Payload должен быть JSON-объектом'),
  rawJson: z
    .string()
    .optional()
    .refine((value) => {
      if (!value?.trim()) return true
      try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      } catch {
        return false
      }
    }, 'Raw должен быть JSON-объектом'),
})

type CandidateForm = z.infer<typeof candidateSchema>

export default function AdminContentCandidateFormPage() {
  const navigate = useNavigate()
  const createCandidate = useCreateContentCandidate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateForm>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      type: 'test_catalog_theme',
      slug: '',
      title: '',
      sourceUrl: '',
      payloadJson: '{}',
      rawJson: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await createCandidate.mutateAsync({
      type: values.type as ContentEntryType,
      slug: values.slug?.trim() || undefined,
      title: values.title.trim(),
      sourceUrl: values.sourceUrl?.trim() || undefined,
      payload: JSON.parse(values.payloadJson) as Record<string, unknown>,
      raw: values.rawJson?.trim()
        ? (JSON.parse(values.rawJson) as Record<string, unknown>)
        : undefined,
    })

    navigate('/app/admin/content/candidates')
  })

  return (
    <div className="space-y-6">
      <Link
        to="/app/admin/content/candidates"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} />
        К кандидатам
      </Link>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">Новый кандидат</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
            <Input label="Название" error={errors.title?.message} {...register('title')} />
            <Input
              label="Source URL"
              error={errors.sourceUrl?.message}
              {...register('sourceUrl')}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <label className="mb-2 block text-sm font-medium text-foreground">Payload JSON</label>
          <textarea
            {...register('payloadJson')}
            rows={20}
            spellCheck={false}
            className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.payloadJson?.message && (
            <p className="mt-1 text-xs text-destructive">{errors.payloadJson.message}</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <label className="mb-2 block text-sm font-medium text-foreground">Raw JSON</label>
          <textarea
            {...register('rawJson')}
            rows={8}
            spellCheck={false}
            className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.rawJson?.message && (
            <p className="mt-1 text-xs text-destructive">{errors.rawJson.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            Создать
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app/admin/content/candidates')}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}

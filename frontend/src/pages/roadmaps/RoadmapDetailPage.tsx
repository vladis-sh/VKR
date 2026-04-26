import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Target,
  Map,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import {
  KIND_LABELS,
  type RoadmapNode,
  type RoadmapNodeKind,
  type RoadmapStage,
  getRoadmapBySlug,
  getRoadmapNodeCount,
} from '@/entities/roadmap'
import { useRoadmapProgress } from '@/features/roadmap/useRoadmapProgress'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { EmptyState } from '@/shared/ui/EmptyState'
import { cn } from '@/shared/lib/cn'

const kindCardClasses: Record<RoadmapNodeKind, string> = {
  required: 'border-border bg-card hover:border-primary/60 hover:shadow-md',
  alternative:
    'border-amber-500/30 bg-amber-50/60 hover:border-amber-500/60 dark:bg-amber-950/10',
  optional:
    'border-dashed border-border/70 bg-card/60 hover:border-primary/40',
}

const kindBadgeClasses: Record<RoadmapNodeKind, string> = {
  required: 'bg-primary/10 text-primary',
  alternative: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  optional: 'bg-muted text-muted-foreground',
}

function NodeCard({
  node,
  completed,
  onOpen,
  onToggle,
}: {
  node: RoadmapNode
  completed: boolean
  onOpen: () => void
  onToggle: () => void
}) {
  const resourceCount = node.resources?.length ?? 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      className={cn(
        'group relative flex w-full cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        kindCardClasses[node.kind],
        completed && 'border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/10'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
              kindBadgeClasses[node.kind]
            )}
          >
            {KIND_LABELS[node.kind]}
          </span>
          <h4
            className={cn(
              'text-sm font-semibold leading-tight text-foreground',
              completed && 'line-through text-muted-foreground'
            )}
          >
            {node.title}
          </h4>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          aria-label={completed ? 'Снять отметку' : 'Отметить пройденным'}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            completed
              ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
              : 'border-border bg-background hover:border-primary'
          )}
        >
          {completed && <Check size={14} strokeWidth={3} />}
        </button>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{node.summary}</p>

      {resourceCount > 0 && (
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
          <BookOpen size={12} />
          {resourceCount}{' '}
          {resourceCount === 1
            ? 'материал'
            : resourceCount < 5
              ? 'материала'
              : 'материалов'}
        </span>
      )}
    </div>
  )
}

function NodeDetailModal({
  node,
  completed,
  onClose,
  onToggle,
}: {
  node: RoadmapNode | null
  completed: boolean
  onClose: () => void
  onToggle: () => void
}) {
  const open = node !== null
  const resources = node?.resources ?? []

  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose()
      }}
      className="max-w-lg"
    >
      {node && (
        <div className="space-y-5">
          <div className="space-y-2 pr-8">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                kindBadgeClasses[node.kind]
              )}
            >
              {KIND_LABELS[node.kind]}
            </span>
            <h2 className="text-xl font-semibold text-foreground">{node.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {node.summary}
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <BookOpen size={15} className="text-primary" />
              Материалы для изучения
            </h3>

            {resources.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                Материалы для этой темы скоро появятся. Пока разбирай её по официальной документации.
              </div>
            ) : (
              <ul className="space-y-2">
                {resources.map((resource) => (
                  <li key={resource.url}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/60 hover:bg-accent"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {resource.source}
                          </span>
                          {resource.language === 'en' && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                              ENG
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm font-medium text-foreground">
                          {resource.title}
                        </p>
                      </div>
                      <ExternalLink
                        size={15}
                        className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onClose}>
              Закрыть
            </Button>
            <Button
              variant={completed ? 'outline' : 'default'}
              onClick={() => {
                onToggle()
              }}
            >
              {completed ? 'Снять отметку' : 'Отметить пройденным'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function StageBlock({
  stage,
  index,
  total,
  isCompleted,
  onToggle,
  onOpenNode,
}: {
  stage: RoadmapStage
  index: number
  total: number
  isCompleted: (nodeId: string) => boolean
  onToggle: (nodeId: string) => void
  onOpenNode: (node: RoadmapNode) => void
}) {
  const doneCount = stage.nodes.filter((node) => isCompleted(node.id)).length
  const stageDone = doneCount === stage.nodes.length

  return (
    <div className="relative flex gap-4 md:gap-6">
      {/* Spine */}
      <div className="flex w-10 shrink-0 flex-col items-center md:w-14">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors md:h-12 md:w-12 md:text-base',
            stageDone
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-primary/40 bg-card text-primary'
          )}
        >
          {stageDone ? <Check size={18} strokeWidth={3} /> : index + 1}
        </div>
        {index < total - 1 && (
          <div
            className={cn(
              'w-px flex-1 bg-gradient-to-b transition-colors',
              stageDone
                ? 'from-emerald-500/60 to-border'
                : 'from-primary/30 to-border'
            )}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.25 }}
        className="flex-1 pb-10"
      >
        <div className="mb-4">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground md:text-2xl">
              {stage.title}
            </h3>
            <span className="text-xs text-muted-foreground">
              {doneCount} / {stage.nodes.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{stage.intro}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stage.nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              completed={isCompleted(node.id)}
              onOpen={() => onOpenNode(node)}
              onToggle={() => onToggle(node.id)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function RoadmapDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const roadmap = useMemo(() => getRoadmapBySlug(slug), [slug])
  const { completed, isCompleted, toggleNode, resetRoadmap } = useRoadmapProgress(
    roadmap?.slug ?? ''
  )
  const [activeNode, setActiveNode] = useState<RoadmapNode | null>(null)

  if (!roadmap) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Роадмап не найден"
          description="Возможно, ссылка устарела. Вернитесь к списку роадмапов."
          action={
            <Button asChild>
              <Link to="/app/roadmaps">К списку</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const total = getRoadmapNodeCount(roadmap)
  const done = completed.filter((nodeId) =>
    roadmap.stages.some((stage) => stage.nodes.some((node) => node.id === nodeId))
  ).length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        <Link
          to="/app/roadmaps"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} />К списку роадмапов
        </Link>

        <div
          className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${roadmap.accent} p-5 md:p-6`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background/80 backdrop-blur">
                <Map size={22} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                  {roadmap.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  {roadmap.description}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetRoadmap}
              disabled={done === 0}
              className="shrink-0"
            >
              <RotateCcw size={14} />
              Сбросить
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Target size={13} />
              {total} тем
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Прогресс</span>
              <span>
                {done} / {total} · {percent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background/60">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
          <span className="h-2 w-2 rounded-full bg-primary" />
          База — учить обязательно
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Альтернатива — выбрать одну
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
          По желанию
        </span>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        Нажми на карточку — увидишь описание темы и ссылки на статьи. Галочка
        справа быстро отмечает тему пройденной.
      </p>

      {/* Timeline */}
      <div className="flex flex-col">
        {roadmap.stages.map((stage, index) => (
          <StageBlock
            key={stage.id}
            stage={stage}
            index={index}
            total={roadmap.stages.length}
            isCompleted={isCompleted}
            onToggle={toggleNode}
            onOpenNode={setActiveNode}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 rounded-xl border border-dashed border-border/70 bg-card/50 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Осилил последнюю стадию?</p>
        <p className="mt-1">
          Самое время закрепить знания в разделе{' '}
          <Link to="/app/tests" className="text-primary hover:underline">
            Тесты
          </Link>{' '}
          и прорешать задачи в{' '}
          <Link to="/app/live-coding" className="text-primary hover:underline">
            Live Coding
          </Link>
          .
        </p>
      </div>

      <NodeDetailModal
        node={activeNode}
        completed={activeNode ? isCompleted(activeNode.id) : false}
        onClose={() => setActiveNode(null)}
        onToggle={() => {
          if (activeNode) toggleNode(activeNode.id)
        }}
      />
    </div>
  )
}

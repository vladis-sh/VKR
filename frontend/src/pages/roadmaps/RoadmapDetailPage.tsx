import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Check,
  ExternalLink,
  Flag,
  GitBranch,
  Layers,
  Map,
  RotateCcw,
  Route,
  Target,
} from 'lucide-react'
import {
  KIND_LABELS,
  type RoadmapNode,
  type RoadmapNodeKind,
  type RoadmapStage,
  getRoadmapNodeCount,
} from '@/entities/roadmap'
import { useRoadmapProgress } from '@/features/roadmap/useRoadmapProgress'
import { useRoadmap } from '@/features/roadmap/useRoadmaps'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { EmptyState } from '@/shared/ui/EmptyState'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import { cn } from '@/shared/lib/cn'

const kindNodeClasses: Record<RoadmapNodeKind, string> = {
  required:
    'border-sky-500/45 bg-sky-50 text-sky-950 hover:border-sky-500 dark:bg-sky-950/20 dark:text-sky-100',
  alternative:
    'border-amber-500/45 bg-amber-50 text-amber-950 hover:border-amber-500 dark:bg-amber-950/20 dark:text-amber-100',
  optional:
    'border-dashed border-border bg-background text-foreground hover:border-primary/50',
}

const kindBadgeClasses: Record<RoadmapNodeKind, string> = {
  required: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  alternative: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  optional: 'bg-muted text-muted-foreground',
}

const kindDotClasses: Record<RoadmapNodeKind, string> = {
  required: 'border-sky-500 bg-sky-500',
  alternative: 'border-amber-500 bg-amber-500',
  optional: 'border-muted-foreground/50 bg-background',
}

function formatResourceCount(count: number) {
  if (count === 1) return '1 материал'
  if (count > 1 && count < 5) return `${count} материала`
  return `${count} материалов`
}

function RoadmapNodeBox({
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
      aria-pressed={completed}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      className={cn(
        'group relative flex min-h-[122px] w-[238px] cursor-pointer flex-col gap-2 rounded-lg border p-3 text-left shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        kindNodeClasses[node.kind],
        completed &&
          'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-emerald-500/10 dark:bg-emerald-950/20 dark:text-emerald-100'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            'inline-flex max-w-[170px] items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
            kindBadgeClasses[node.kind],
            completed && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
          )}
        >
          {completed ? 'Пройдено' : KIND_LABELS[node.kind]}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          aria-label={completed ? 'Снять отметку' : 'Отметить пройденным'}
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors hover:border-primary',
            completed && 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
          )}
        >
          {completed && <Check size={15} strokeWidth={3} />}
        </button>
      </div>

      <h4
        className={cn(
          'text-sm font-semibold leading-tight',
          completed && 'line-through decoration-emerald-600/70'
        )}
      >
        {node.title}
      </h4>
      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {node.summary}
      </p>

      {resourceCount > 0 && (
        <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-medium text-primary">
          <BookOpen size={12} />
          {formatResourceCount(resourceCount)}
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
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                kindBadgeClasses[node.kind],
                completed && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              )}
            >
              {completed ? 'Пройдено' : KIND_LABELS[node.kind]}
            </span>
            <h2 className="text-xl font-semibold text-foreground">{node.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{node.summary}</p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <BookOpen size={15} className="text-primary" />
              Материалы для изучения
            </h3>

            {resources.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                Материалы для этой темы пока не прикреплены.
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
                          <span className="text-[11px] font-medium uppercase text-muted-foreground">
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
            <Button variant={completed ? 'outline' : 'default'} onClick={onToggle}>
              {completed ? 'Снять отметку' : 'Отметить пройденным'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function RoadmapBranchNode({
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
  return (
    <div className="relative pl-9">
      <span
        className={cn(
          'absolute left-2 top-6 h-px w-7',
          completed ? 'bg-emerald-500/70' : 'bg-border'
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-[18px] z-10 h-4 w-4 rounded-full border-2',
          kindDotClasses[node.kind],
          completed && 'border-emerald-500 bg-emerald-500'
        )}
      />
      <RoadmapNodeBox
        node={node}
        completed={completed}
        onOpen={onOpen}
        onToggle={onToggle}
      />
    </div>
  )
}

function StageMapColumn({
  stage,
  index,
  isCompleted,
  onToggle,
  onOpenNode,
}: {
  stage: RoadmapStage
  index: number
  isCompleted: (nodeId: string) => boolean
  onToggle: (nodeId: string) => void
  onOpenNode: (node: RoadmapNode) => void
}) {
  const doneCount = stage.nodes.filter((node) => isCompleted(node.id)).length
  const stageDone = stage.nodes.length > 0 && doneCount === stage.nodes.length
  const percent = stage.nodes.length === 0 ? 0 : Math.round((doneCount / stage.nodes.length) * 100)

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.18) }}
      className="relative w-[280px]"
    >
      <div className="relative z-10 mb-5 min-h-[132px] rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold',
              stageDone
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-primary/45 text-primary'
            )}
          >
            {stageDone ? <Check size={18} strokeWidth={3} /> : index + 1}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight text-foreground">
              {stage.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {stage.intro}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>
            {doneCount} / {stage.nodes.length}
          </span>
          <span>{percent}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="relative space-y-3 pb-2">
        {stage.nodes.length > 0 && (
          <span className="absolute left-2 top-4 bottom-6 w-px bg-border" />
        )}
        {stage.nodes.map((node) => (
          <RoadmapBranchNode
            key={node.id}
            node={node}
            completed={isCompleted(node.id)}
            onOpen={() => onOpenNode(node)}
            onToggle={() => onToggle(node.id)}
          />
        ))}
      </div>
    </motion.section>
  )
}

function RoadmapMap({
  stages,
  isCompleted,
  onToggle,
  onOpenNode,
}: {
  stages: RoadmapStage[]
  isCompleted: (nodeId: string) => boolean
  onToggle: (nodeId: string) => void
  onOpenNode: (node: RoadmapNode) => void
}) {
  if (stages.length === 0) {
    return (
      <EmptyState
        title="В этом роадмапе пока нет тем"
        description="Опубликованный план найден, но его структура еще не заполнена."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Route size={17} className="text-primary" />
          Карта подготовки
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <GitBranch size={14} />
          Ветвления и альтернативные темы
        </div>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <div
          className="relative px-6 py-6"
          style={{ minWidth: `${Math.max(stages.length * 320, 1040)}px` }}
        >
          <div className="absolute left-10 right-10 top-[78px] h-1 rounded-full bg-border" />
          <div className="absolute left-10 top-[72px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
          <div className="absolute right-10 top-[68px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
            <Flag size={13} />
          </div>

          <div className="grid auto-cols-[280px] grid-flow-col gap-10">
            {stages.map((stage, index) => (
              <StageMapColumn
                key={stage.id}
                stage={stage}
                index={index}
                isCompleted={isCompleted}
                onToggle={onToggle}
                onOpenNode={onOpenNode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RoadmapLegend() {
  return (
    <div className="grid gap-2 text-xs sm:grid-cols-3">
      <div className="flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-50 px-3 py-2 font-medium text-sky-700 dark:bg-sky-950/20 dark:text-sky-300">
        <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
        База
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-50 px-3 py-2 font-medium text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        Альтернатива
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-card px-3 py-2 font-medium text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-full border border-muted-foreground/50" />
        По желанию
      </div>
    </div>
  )
}

export default function RoadmapDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: roadmap, isLoading } = useRoadmap(slug)
  const { completed, isCompleted, toggleNode, resetRoadmap } = useRoadmapProgress(slug ?? '')
  const [activeNode, setActiveNode] = useState<RoadmapNode | null>(null)

  if (isLoading) return <FullPageSpinner />

  if (!roadmap) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Роадмап не найден"
          description="Возможно, ссылка устарела. Вернитесь к списку планов подготовки."
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
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 py-6 md:px-6">
      <Link
        to="/app/roadmaps"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        К списку планов подготовки
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Map size={23} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                {roadmap.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {roadmap.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
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
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1.3fr]">
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers size={14} />
              Этапы
            </div>
            <div className="mt-1 text-xl font-semibold text-foreground">
              {roadmap.stages.length}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target size={14} />
              Темы
            </div>
            <div className="mt-1 text-xl font-semibold text-foreground">{total}</div>
          </div>
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Прогресс</span>
              <span>
                {done} / {total} · {percent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </motion.header>

      <RoadmapLegend />

      <RoadmapMap
        stages={roadmap.stages}
        isCompleted={isCompleted}
        onToggle={toggleNode}
        onOpenNode={setActiveNode}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Link
          to="/app/tests"
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <div>
            <p className="font-semibold text-foreground">Проверить знания</p>
            <p className="mt-1 text-muted-foreground">Перейти к тестам по темам.</p>
          </div>
          <Target size={18} className="text-primary" />
        </Link>
        <Link
          to="/app/live-coding"
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <div>
            <p className="font-semibold text-foreground">Закрепить практикой</p>
            <p className="mt-1 text-muted-foreground">Открыть задачи Live Coding.</p>
          </div>
          <BookOpen size={18} className="text-primary" />
        </Link>
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

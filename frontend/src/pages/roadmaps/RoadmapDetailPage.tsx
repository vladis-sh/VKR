import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Map,
  RotateCcw,
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

// Subtle tag shown next to non-base topics so the default "База" stays clutter-free.
const kindTagClasses: Record<RoadmapNodeKind, string> = {
  required: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  alternative: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  optional: 'bg-muted text-muted-foreground',
}

function formatResourceCount(count: number) {
  if (count === 1) return '1 материал'
  if (count > 1 && count < 5) return `${count} материала`
  return `${count} материалов`
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
                kindTagClasses[node.kind],
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

function TopicRow({
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
      className="group flex cursor-pointer items-start gap-3 px-3 py-3 transition-colors hover:bg-accent/60 focus:outline-none focus-visible:bg-accent/60 sm:px-4"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        aria-label={completed ? 'Снять отметку' : 'Отметить пройденным'}
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-background text-transparent transition-colors hover:border-primary',
          completed
            ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
            : 'border-muted-foreground/35'
        )}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h4
            className={cn(
              'text-sm font-semibold leading-snug text-foreground',
              completed && 'text-muted-foreground line-through decoration-emerald-600/60'
            )}
          >
            {node.title}
          </h4>
          {node.kind !== 'required' && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                kindTagClasses[node.kind]
              )}
            >
              {KIND_LABELS[node.kind]}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{node.summary}</p>
        {resourceCount > 0 && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
            <BookOpen size={12} />
            {formatResourceCount(resourceCount)}
          </span>
        )}
      </div>

      <ChevronRight
        size={16}
        className="mt-1 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </div>
  )
}

function StageSection({
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.25 }}
      className="relative pl-12 md:pl-14"
    >
      {/* Number badge anchored on the vertical timeline rail */}
      <div
        className={cn(
          'absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold',
          stageDone
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-primary/40 bg-card text-primary'
        )}
      >
        {stageDone ? <Check size={17} strokeWidth={3} /> : index + 1}
      </div>

      <header className="mb-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold leading-tight text-foreground md:text-xl">
            {stage.title}
          </h2>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {doneCount}/{stage.nodes.length}
          </span>
        </div>
        {stage.intro && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stage.intro}</p>
        )}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      {stage.nodes.length > 0 && (
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {stage.nodes.map((node) => (
            <TopicRow
              key={node.id}
              node={node}
              completed={isCompleted(node.id)}
              onOpen={() => onOpenNode(node)}
              onToggle={() => onToggle(node.id)}
            />
          ))}
        </div>
      )}
    </motion.section>
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
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="План подготовки не найден"
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
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Link
        to="/app/roadmaps"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />К списку планов подготовки
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Map size={23} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
              {roadmap.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              {roadmap.description}
            </p>
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-5 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Layers size={15} />
                {roadmap.stages.length} этапов
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Target size={15} />
                {total} тем
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={resetRoadmap} disabled={done === 0}>
              <RotateCcw size={14} />
              Сбросить
            </Button>
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Прогресс</span>
              <span className="text-foreground">
                {done} / {total} · {percent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Study plan — vertical, document-style */}
      {roadmap.stages.length === 0 ? (
        <EmptyState
          title="В этом плане подготовки пока нет тем"
          description="Опубликованный план найден, но его структура еще не заполнена."
        />
      ) : (
        <div className="relative space-y-8 md:space-y-10">
          {/* Continuous timeline rail behind the stage numbers */}
          <span aria-hidden className="absolute bottom-6 left-[18px] top-4 w-0.5 bg-border" />
          {roadmap.stages.map((stage, index) => (
            <StageSection
              key={stage.id}
              stage={stage}
              index={index}
              isCompleted={isCompleted}
              onToggle={toggleNode}
              onOpenNode={setActiveNode}
            />
          ))}
        </div>
      )}

      {/* Next steps */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/app/tests"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-sm transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <div>
            <p className="font-semibold text-foreground">Проверить знания</p>
            <p className="mt-1 text-muted-foreground">Перейти к тестам по темам.</p>
          </div>
          <Target size={18} className="text-primary" />
        </Link>
        <Link
          to="/app/live-coding"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-sm transition-colors hover:border-primary/50 hover:bg-accent"
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

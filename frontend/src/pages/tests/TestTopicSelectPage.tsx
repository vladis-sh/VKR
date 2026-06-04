import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTestTopics } from '@/features/tests/useTestSession'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'

const topicIcons: Record<string, string> = {
  'html-css': '🎨',
  javascript: '🟡',
  typescript: '🔷',
  react: '⚛️',
  'frontend-arch': '🏗️',
  'browser-http': '🌐',
  nodejs: '🟢',
  nestjs: '🐱',
  databases: '🗄️',
  algorithms: '🧮',
}

type PickerMode = 'time-attack' | 'one-mistake'

const MODE_META: Record<PickerMode, { title: string; subtitle: string }> = {
  'time-attack': {
    title: 'Борьба со временем',
    subtitle: 'Выберите тему — или все темы сразу',
  },
  'one-mistake': {
    title: 'Одна ошибка',
    subtitle: 'Выберите тему — играем до первой ошибки',
  },
}

function TopicSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export default function TestTopicSelectPage({ mode }: { mode: PickerMode }) {
  const { data: topics, isLoading } = useTestTopics()
  const meta = MODE_META[mode]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/app/tests"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{meta.title}</h1>
          <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopicSkeleton key={i} />
          ))}
        </div>
      ) : !topics || topics.length === 0 ? (
        <EmptyState title="Темы не найдены" description="Попробуйте позже" />
      ) : (
        <div className="space-y-2">
          {/* "All topics" keeps the original mixed-bag behaviour available. */}
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              to={`/app/tests/${mode}/all`}
              className="group flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Все темы
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Вопросы из всех тем вперемешку
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0"
              />
            </Link>
          </motion.div>

          {topics.map((topic, i) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (i + 1) * 0.04 }}
            >
              <Link
                to={`/app/tests/${mode}/${topic.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                  {topicIcons[topic.slug] ?? '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {topic.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {topic.questionCount} {topic.questionCount === 1 ? 'вопрос' : 'вопросов'}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

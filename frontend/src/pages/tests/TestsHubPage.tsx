import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Brain,
  ClipboardList,
  Library,
  Sparkles,
  Timer,
  type LucideIcon,
} from 'lucide-react'
import { Modal } from '@/shared/ui/Modal'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

interface TestCard {
  title: string
  subtitle: string
  icon: LucideIcon
  /** Tailwind gradient classes applied to the card background. */
  gradient: string
  /** Navigation target. Omitted for cards that open a modal instead. */
  to?: string
  /** Marks the AI card, which opens the topic modal rather than navigating. */
  opensTopicModal?: boolean
}

const testCards: TestCard[] = [
  {
    to: '/app/tests/themes',
    title: 'Тесты по темам',
    subtitle: 'Проверьте ваши знания',
    icon: Library,
    gradient: 'from-blue-500 via-indigo-500 to-indigo-600',
  },
  {
    to: '/app/tests/time-attack',
    title: 'Борьба со временем',
    subtitle: 'Ответьте как можно больше',
    icon: Timer,
    gradient: 'from-amber-400 via-orange-500 to-orange-600',
  },
  {
    to: '/app/tests/one-mistake',
    title: 'Одна ошибка',
    subtitle: 'И ты ошибся',
    icon: AlertTriangle,
    gradient: 'from-rose-500 via-red-500 to-red-600',
  },
  {
    opensTopicModal: true,
    title: 'Тест от ИИ',
    subtitle: 'Введите тему — ИИ сгенерирует вопросы',
    icon: Brain,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
  },
]

// A few one-tap suggestions so the user doesn't have to type a topic from scratch.
const AI_TOPIC_SUGGESTIONS = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'CSS', 'Алгоритмы']

function TestModeCard({
  card,
  index,
  onOpenModal,
}: {
  card: TestCard
  index: number
  onOpenModal: () => void
}) {
  const Icon = card.icon

  const className =
    `group relative flex min-h-[160px] cursor-pointer items-center overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-7 shadow-lg shadow-black/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`

  const content = (
    <>
      {/* Decorative oversized icon bleeding off the right edge */}
      <Icon
        aria-hidden
        strokeWidth={1.25}
        className="pointer-events-none absolute -bottom-6 -right-5 h-44 w-44 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
      />
      {/* Soft glow accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/15 blur-2xl" />

      <div className="relative z-10 flex w-full items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold leading-tight text-white">{card.title}</h2>
          <p className="mt-1.5 text-sm font-medium text-white/80">{card.subtitle}</p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Icon size={30} className="text-white" />
        </div>
      </div>
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      {card.to ? (
        <Link to={card.to} className={className}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onOpenModal} className={cn(className, 'w-full text-left')}>
          {content}
        </button>
      )}
    </motion.div>
  )
}

function AiTopicModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')

  const trimmed = topic.trim()
  const canSubmit = trimmed.length > 0

  const start = () => {
    if (!canSubmit) return
    navigate(`/app/tests/ai?topic=${encodeURIComponent(trimmed)}`)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Тест от ИИ"
      description="Введите тему — ИИ сгенерирует по ней вопросы"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          start()
        }}
        className="space-y-4"
      >
        <Input
          autoFocus
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Например: React-хуки, замыкания в JS..."
          maxLength={80}
          leftIcon={<Sparkles size={16} />}
        />

        <div className="flex flex-wrap gap-2">
          {AI_TOPIC_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setTopic(suggestion)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          <Sparkles size={16} />
          Сгенерировать вопросы
        </Button>
      </form>
    </Modal>
  )
}

export default function TestsHubPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false)

  return (
    <div className="space-y-7">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardList size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Тесты</h1>
          <p className="text-sm text-muted-foreground">
            Выберите режим и проверьте свои знания
          </p>
        </div>
      </motion.div>

      <section className="grid gap-5 sm:grid-cols-2">
        {testCards.map((card, index) => (
          <TestModeCard
            key={card.title}
            card={card}
            index={index}
            onOpenModal={() => setAiModalOpen(true)}
          />
        ))}
      </section>

      <AiTopicModal open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  )
}

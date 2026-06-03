import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Brain,
  ClipboardList,
  Library,
  Timer,
  type LucideIcon,
} from 'lucide-react'

interface TestCard {
  to: string
  title: string
  subtitle: string
  icon: LucideIcon
  /** Tailwind gradient classes applied to the card background. */
  gradient: string
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
    to: '/app/tests/ai',
    title: 'Тест от ИИ',
    subtitle: 'Новый опыт с GPT',
    icon: Brain,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
  },
]

function TestModeCard({ card, index }: { card: TestCard; index: number }) {
  const Icon = card.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link
        to={card.to}
        className={`group relative flex min-h-[160px] cursor-pointer items-center overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-7 shadow-lg shadow-black/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
      >
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
      </Link>
    </motion.div>
  )
}

export default function TestsHubPage() {
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
          <TestModeCard key={card.to} card={card} index={index} />
        ))}
      </section>
    </div>
  )
}

import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BrainCircuit,
  MessageSquare,
  ClipboardList,
  BarChart2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useAuthStore } from '@/features/auth/useAuthStore'

const features = [
  {
    icon: <MessageSquare size={22} className="text-blue-500" />,
    title: 'ИИ-ассистент',
    desc: 'Симуляция реального собеседования с ИИ в роли HR, тех. специалиста или эксперта по алгоритмам',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <ClipboardList size={22} className="text-violet-500" />,
    title: 'Умные тесты',
    desc: '4 режима: по темам, борьба со временем, одна ошибка и тесты от ИИ. 100+ вопросов',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: <BrainCircuit size={22} className="text-emerald-500" />,
    title: 'Учебные материалы',
    desc: 'Структурированные статьи по HTML, CSS, JS, TypeScript, React, Node.js и алгоритмам',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <BarChart2 size={22} className="text-amber-500" />,
    title: 'Статистика прогресса',
    desc: 'Отслеживайте свои результаты и динамику прогресса',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
]

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/app/roadmaps', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-end px-5 py-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Начать</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <BrainCircuit size={12} />
            Подготовка к IT-собеседованиям
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Пройди собеседование
            <br />
            <span className="text-primary"></span>
          </h1>

          <p className="mt-5 text-base text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
            Платформа для подготовки к техническим собеседованиям с ИИ-ассистентом. Изучай
            материалы, проходи тесты и симулируй реальные интервью.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">
                Начать бесплатно
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Войти в аккаунт</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} mb-3`}
              >
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Зарегистрируйся чтобы начать подготовку
          </h2>

          <Button size="lg" asChild>
            <Link to="/register">
              Зарегистрироваться
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-5 text-center text-xs text-muted-foreground">
          © 2025 Платформа подготовки к IT-собеседованиям
        </div>
      </footer>
    </div>
  )
}

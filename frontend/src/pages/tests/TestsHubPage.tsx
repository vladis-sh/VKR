import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Zap, AlertCircle, Bot, ArrowRight } from 'lucide-react'

const modes = [
  {
    to: '/app/tests/topics',
    icon: <BookOpen size={24} className="text-blue-500" />,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'hover:border-blue-300 dark:hover:border-blue-700',
    title: 'По темам',
    desc: 'Выберите тему и пройдите набор вопросов в своём темпе',
    badge: '10 тем',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    to: '/app/tests/time-attack',
    icon: <Zap size={24} className="text-amber-500" />,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'hover:border-amber-300 dark:hover:border-amber-700',
    title: 'Борьба со временем',
    desc: '5 минут — ответьте на максимум вопросов из всех тем',
    badge: '5 минут',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  {
    to: '/app/tests/one-mistake',
    icon: <AlertCircle size={24} className="text-red-500" />,
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'hover:border-red-300 dark:hover:border-red-700',
    title: 'Одна ошибка',
    desc: 'Тест завершается после первой неверно отвеченной вопроса',
    badge: 'Сложный режим',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
  {
    to: '/app/tests/ai',
    icon: <Bot size={24} className="text-violet-500" />,
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'hover:border-violet-300 dark:hover:border-violet-700',
    title: 'Тест от ИИ',
    desc: 'Уникальные вопросы, генерируемые ИИ специально для вас',
    badge: 'ИИ-генерация',
    badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
]

export default function TestsHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Тесты</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Выберите режим тестирования
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modes.map((mode, i) => (
          <motion.div
            key={mode.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={mode.to}
              className={`group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all ${mode.border} hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${mode.bg}`}>
                  {mode.icon}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${mode.badgeColor}`}>
                  {mode.badge}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {mode.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mode.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                Начать
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

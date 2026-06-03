import {
  BrainCircuit,
  Cloud,
  Cpu,
  Database,
  FlaskConical,
  LayoutDashboard,
  Server,
  ShieldCheck,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { TestTheme } from './testCatalog'

export interface TestCategory {
  /** Stable id; also accepted as a value of `TestTheme.category`. */
  id: string
  title: string
  description: string
  icon: LucideIcon
  /**
   * Tailwind classes for the icon chip (background + text color). Written as
   * full literals so they survive Tailwind's purge step.
   */
  accentClass: string
}

/**
 * Ordered taxonomy rendered on the "Тесты по темам" page. Categories without
 * matching themes are hidden, so the list grows automatically as content for
 * new categories is added.
 */
export const TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'backend',
    title: 'Backend',
    description: 'Серверная разработка, API и архитектура приложений',
    icon: Server,
    accentClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Вёрстка, браузерные API и клиентские фреймворки',
    icon: LayoutDashboard,
    accentClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    id: 'databases',
    title: 'Базы данных',
    description: 'SQL, проектирование схем, индексы и работа с данными',
    icon: Database,
    accentClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'CI/CD, контейнеризация и эксплуатация сервисов',
    icon: Cloud,
    accentClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    description: 'Разработка мобильных приложений',
    icon: Smartphone,
    accentClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    id: 'qa',
    title: 'QA / Testing',
    description: 'Тестирование, автотесты и обеспечение качества',
    icon: FlaskConical,
    accentClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  {
    id: 'data-science',
    title: 'Data Science / ML',
    description: 'Анализ данных, статистика и машинное обучение',
    icon: BrainCircuit,
    accentClass: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  },
  {
    id: 'computer-science',
    title: 'Computer Science',
    description: 'Алгоритмы, структуры данных, сети и system design',
    icon: Cpu,
    accentClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Безопасность приложений и защита данных',
    icon: ShieldCheck,
    accentClass: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    id: 'tools',
    title: 'Tools / Другие технологии',
    description: 'Языки, инструменты и всё остальное',
    icon: Wrench,
    accentClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  },
]

/** Catch-all category used when a theme matches nothing else. */
export const FALLBACK_CATEGORY_ID = 'tools'

const CATEGORY_IDS = new Set(TEST_CATEGORIES.map((category) => category.id))

/**
 * Maps seeded theme slugs to a category. New themes can be tagged here or, long
 * term, carry an explicit `category` in their payload (which wins).
 */
const CATEGORY_BY_THEME_SLUG: Record<string, string> = {
  // Backend
  'backend-node': 'backend',
  // Frontend
  'frontend-core': 'frontend',
  'react-next': 'frontend',
  javascript: 'frontend',
  'typescript-deep': 'frontend',
  // Базы данных
  databases: 'databases',
  'postgres-production': 'databases',
  // Computer Science
  algorithms: 'computer-science',
  'advanced-algorithms': 'computer-science',
  networks: 'computer-science',
  'system-design': 'computer-science',
  // Tools / Другие технологии
  git: 'tools',
  python: 'tools',
}

/** Resolves a theme to a category id: explicit payload field → slug map → fallback. */
export function resolveCategoryId(theme: TestTheme): string {
  const explicit = theme.category?.trim()
  if (explicit && CATEGORY_IDS.has(explicit)) return explicit

  return CATEGORY_BY_THEME_SLUG[theme.slug] ?? FALLBACK_CATEGORY_ID
}

export interface CategoryGroup {
  category: TestCategory
  themes: TestTheme[]
}

/**
 * Groups themes under the ordered taxonomy, preserving incoming theme order
 * within each category and dropping empty categories.
 */
export function groupThemesByCategory(themes: TestTheme[]): CategoryGroup[] {
  const byCategory = new Map<string, TestTheme[]>()

  for (const theme of themes) {
    const id = resolveCategoryId(theme)
    const bucket = byCategory.get(id)
    if (bucket) bucket.push(theme)
    else byCategory.set(id, [theme])
  }

  return TEST_CATEGORIES.flatMap((category) => {
    const grouped = byCategory.get(category.id)
    return grouped && grouped.length > 0 ? [{ category, themes: grouped }] : []
  })
}

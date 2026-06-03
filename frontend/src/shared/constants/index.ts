export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const QUERY_KEYS = {
  ME: ['auth', 'me'],
  MATERIALS: ['materials'],
  FAVORITES: ['materials', 'favorites'],
  MATERIAL_DETAIL: (id: string) => ['materials', id],
  CHAT_SESSIONS: ['chat', 'sessions'],
  CHAT_SESSION: (id: string) => ['chat', 'sessions', id],
  TEST_TOPICS: ['tests', 'topics'],
  TEST_QUESTIONS: (params: Record<string, unknown>) => ['tests', 'questions', params],
  TEST_SESSION: (id: string) => ['tests', 'sessions', id],
  STATS: ['stats'],
  LEADERBOARD: (sort: string) => ['stats', 'leaderboard', sort],
  PROFILE: ['profile'],
  TEST_HISTORY: (page: number) => ['profile', 'test-history', page],
  NOTIFICATIONS: ['notifications'],
  ADMIN_MATERIALS: ['admin', 'materials'],
  ADMIN_MATERIAL: (id: string) => ['admin', 'materials', id],
  ADMIN_QUESTIONS: ['admin', 'questions'],
  ADMIN_QUESTION: (id: string) => ['admin', 'questions', id],
  ROADMAPS: ['roadmaps'],
  ROADMAP: (slug: string) => ['roadmaps', slug],
  LIVE_CODING_TASKS: ['live-coding'],
  LIVE_CODING_TASK: (slug: string) => ['live-coding', slug],
  TEST_CATALOG_THEMES: ['test-catalog', 'themes'],
  TEST_CATALOG_THEME: (slug: string) => ['test-catalog', 'themes', slug],
  ADMIN_CONTENT_ENTRIES: ['admin', 'content', 'entries'],
  ADMIN_CONTENT_ENTRY: (id: string) => ['admin', 'content', 'entries', id],
  ADMIN_CONTENT_SOURCES: ['admin', 'content', 'sources'],
  ADMIN_CONTENT_SOURCE: (id: string) => ['admin', 'content', 'sources', id],
  ADMIN_CONTENT_CANDIDATES: ['admin', 'content', 'candidates'],
} as const

export const KNOWLEDGE_LEVELS = [
  { value: 'junior', label: 'Junior', description: 'Начинающий разработчик (0–1 год)' },
  { value: 'middle', label: 'Middle', description: 'Разработчик среднего уровня (1–3 года)' },
  { value: 'senior', label: 'Senior', description: 'Опытный разработчик (3+ лет)' },
] as const

// NOTE: the DB enum value `hr` is reused as "interview simulator" — a purely
// technical mock-interview mode. See backend/src/ai/prompts/chat.prompts.ts.
export const ASSISTANT_ROLES = [
  {
    value: 'technical',
    label: 'Технический ассистент',
    description: 'Объяснения по JavaScript, TypeScript, React, backend и архитектуре',
    icon: '💻',
  },
  {
    value: 'algorithms',
    label: 'Алгоритмы',
    description: 'Задачи на структуры данных, алгоритмы и анализ сложности',
    icon: '🧮',
  },
  {
    value: 'hr',
    label: 'Симулятор интервью',
    description: 'Имитация технического собеседования с обратной связью',
    icon: '🎯',
  },
] as const

export const QUICK_PHRASES = [
  'Что такое замыкание?',
  'Как работает Event Loop?',
  'SOLID принципы',
  'Объясни сложность O(n log n)',
  'REST vs GraphQL',
  'Индексы в базах данных',
]

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const TOAST_DURATION = 3000

export const TEST_TIME_ATTACK_SECONDS = 300 // 5 minutes

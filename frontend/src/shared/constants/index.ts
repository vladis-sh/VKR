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
} as const

export const KNOWLEDGE_LEVELS = [
  { value: 'junior', label: 'Junior', description: 'Начинающий разработчик (0–1 год)' },
  { value: 'middle', label: 'Middle', description: 'Разработчик среднего уровня (1–3 года)' },
  { value: 'senior', label: 'Senior', description: 'Опытный разработчик (3+ лет)' },
] as const

export const ASSISTANT_ROLES = [
  {
    value: 'hr',
    label: 'HR-интервью',
    description: 'Вопросы о мотивации, опыте и soft skills',
    icon: '👔',
  },
  {
    value: 'technical',
    label: 'Техническое интервью',
    description: 'JavaScript, TypeScript, React и технические вопросы',
    icon: '💻',
  },
  {
    value: 'algorithms',
    label: 'Алгоритмы',
    description: 'Задачи на структуры данных и алгоритмы',
    icon: '🧮',
  },
] as const

export const QUICK_PHRASES = [
  'Расскажи о себе',
  'Какой твой опыт?',
  'Объясни паттерн',
  'Что такое замыкание?',
  'Как работает EventLoop?',
  'SOLID принципы',
]

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const TOAST_DURATION = 3000

export const TEST_TIME_ATTACK_SECONDS = 300 // 5 minutes

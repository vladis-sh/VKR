// ============================================================
// Auth & User
// ============================================================

export type KnowledgeLevel = 'junior' | 'middle' | 'senior'

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string | null
  knowledgeLevel: KnowledgeLevel
  isProfileComplete?: boolean
  role?: UserRole
  createdAt: string
  updatedAt?: string
}

// ============================================================
// Materials
// ============================================================

export interface Material {
  id: string
  title: string
  shortDescription: string
  content?: string
  level: KnowledgeLevel
  tags: string[]
  isFavorite?: boolean
  isPublished?: boolean
  deletedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export interface AdminQuestion {
  id: string
  topic: string
  text: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  difficulty: KnowledgeLevel
  sourceType: 'static' | 'ai'
  isPublished: boolean
  deletedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export type ContentEntryType = 'roadmap' | 'live_coding_task' | 'test_catalog_theme'
export type ContentOrigin = 'manual' | 'seed' | 'parser'

export interface ContentEntry {
  id: string
  type: ContentEntryType
  slug: string
  title: string
  payload: Record<string, unknown>
  origin: ContentOrigin
  sourceUrl?: string | null
  isPublished: boolean
  deletedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export interface MaterialsPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface MaterialsResponse {
  items: Material[]
  pagination: MaterialsPagination
}

// ============================================================
// Chat
// ============================================================

export type AssistantRole = 'hr' | 'technical' | 'algorithms'

export interface ChatSession {
  id: string
  title: string
  assistantRole: AssistantRole
  createdAt: string
  updatedAt: string
  messageCount?: number
  lastMessage?: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[]
}

// ============================================================
// Tests
// ============================================================

export type TestMode =
  | 'topic'
  | 'time-attack'
  | 'one-mistake'
  | 'ai'
  | 'time_attack'
  | 'one_mistake'
  | 'ai_generated'

export interface TestTopic {
  id: string
  slug: string
  name: string
  description?: string
  questionCount: number
  icon?: string
}

export interface TestQuestion {
  id: string
  text: string
  options: string[]
  /** Omitted by list endpoints; revealed per-answer via the check endpoint. */
  correctIndex?: number
  explanation?: string
  topic?: string
  difficulty?: KnowledgeLevel
}

export interface TestAnswer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

export interface TestSession {
  id: string
  mode: TestMode
  topic?: string | null
  status: 'active' | 'completed'
  timeLimit?: number
  createdAt: string
  completedAt?: string
}

export interface TestSessionResult {
  id: string
  mode: TestMode
  topic?: string | null
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  durationSeconds: number
  percentage: number
  completedAt: string
  answers: TestAnswerDetail[]
}

export interface TestAnswerDetail {
  questionId: string
  questionText: string
  options: string[]
  selectedIndex: number
  correctIndex: number
  isCorrect: boolean
  explanation?: string
}

// ============================================================
// Stats
// ============================================================

export interface UserStats {
  totalCorrect: number
  totalIncorrect: number
  completedTests: number
  totalTimeSeconds: number
  accuracy: number
  recentSessions: SessionStat[]
}

export interface SessionStat {
  sessionId: string
  date: string
  mode: TestMode
  topic?: string | null
  accuracy: number
  correctAnswers: number
  totalQuestions: number
  durationSeconds: number
}

// ============================================================
// Profile
// ============================================================

export type ProfileData = User

export interface TestHistoryItem {
  id: string
  mode: TestMode
  topic?: string | null
  correctAnswers: number
  totalQuestions: number
  percentage: number
  durationSeconds: number
  completedAt: string
}

export interface TestHistoryResponse {
  data: TestHistoryItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================
// Notifications
// ============================================================

export interface NotificationSettings {
  enabled: boolean
  time: string
  weekdays: number[]
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

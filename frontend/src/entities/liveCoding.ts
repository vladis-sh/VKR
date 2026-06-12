export type LiveCodingDifficulty = 'easy' | 'medium' | 'hard'
export type LiveCodingLanguage = 'javascript' | 'typescript'

export interface LiveCodingExample {
  input: string
  output: string
  explanation?: string
}

export interface LiveCodingTestCase {
  title: string
  input: string
  expected: string
  assertion: string
}

export interface LiveCodingTask {
  id: string
  slug: string
  title: string
  category: string
  difficulty: LiveCodingDifficulty
  companies: string[]
  successRate: number
  estimatedMinutes: number
  languages: LiveCodingLanguage[]
  description: string
  constraints: string[]
  examples: LiveCodingExample[]
  starterCode: Record<LiveCodingLanguage, string>
  tests: LiveCodingTestCase[]
  solutionNotes: string[]
}

export const LANGUAGE_LABELS: Record<LiveCodingLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
}

export const DIFFICULTY_LABELS: Record<LiveCodingDifficulty, string> = {
  easy: 'Лёгкие',
  medium: 'Средние',
  hard: 'Сложные',
}

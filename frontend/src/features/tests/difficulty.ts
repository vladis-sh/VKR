import type { CatalogDifficulty } from '@/entities/testCatalog'

/** Human labels and soft accent tones for a question/subtopic difficulty. */
export const difficultyLabel: Record<CatalogDifficulty, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

export const difficultyTone: Record<CatalogDifficulty, string> = {
  easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  hard: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export type CatalogDifficulty = 'easy' | 'medium' | 'hard'

export interface CatalogQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: CatalogDifficulty
}

export interface TestSubtopic {
  id: string
  slug: string
  title: string
  description: string
  difficulty: CatalogDifficulty
  questions: CatalogQuestion[]
}

export interface TestSection {
  id: string
  title: string
  description: string
  subtopics: TestSubtopic[]
}

export interface TestTheme {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  /** Lucide icon name (e.g. "Database") or an emoji. Falls back to slug map / default. */
  icon?: string
  /** Optional category id (see entities/testCategories). Falls back to slug map / "tools". */
  category?: string
  sections: TestSection[]
}

export function getThemeBySlug(themes: TestTheme[] | undefined, slug?: string) {
  return themes?.find((theme) => theme.slug === slug)
}

export function getSubtopicBySlug(theme: TestTheme | undefined, slug?: string) {
  if (!theme) return undefined

  for (const section of theme.sections) {
    const subtopic = section.subtopics.find((item) => item.slug === slug)
    if (subtopic) return subtopic
  }

  return undefined
}

export function getThemeSubtopics(theme: TestTheme) {
  return theme.sections.flatMap((section) => section.subtopics)
}

export function getThemeQuestionCount(theme: TestTheme) {
  return getThemeSubtopics(theme).reduce(
    (sum, subtopic) => sum + subtopic.questions.length,
    0
  )
}

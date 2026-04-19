import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getThemeSubtopics,
  type CatalogQuestion,
  type TestSubtopic,
  type TestTheme,
} from '@/entities/testCatalog'

export type QuestionProgressMark = 'know' | 'repeat' | 'hard'
export type TestProgressStatus = 'not-started' | 'in-progress' | 'completed'

interface QuestionProgress {
  selectedIndex?: number
  checked?: boolean
  mark?: QuestionProgressMark
  updatedAt?: string
}

interface TestCatalogProgress {
  questions: Record<string, QuestionProgress>
}

const STORAGE_KEY = 'prepai.tests.catalog-progress'

const emptyProgress: TestCatalogProgress = {
  questions: {},
}

function readProgress(): TestCatalogProgress {
  if (typeof window === 'undefined') return emptyProgress

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress

    return { ...emptyProgress, ...JSON.parse(raw) } as TestCatalogProgress
  } catch {
    return emptyProgress
  }
}

function writeProgress(progress: TestCatalogProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function getQuestionsStats(questions: CatalogQuestion[], progress: TestCatalogProgress) {
  const total = questions.length
  const touched = questions.filter((question) => {
    const questionProgress = progress.questions[question.id]
    return Boolean(questionProgress?.checked || questionProgress?.mark)
  }).length
  const marked = questions.filter((question) => Boolean(progress.questions[question.id]?.mark))
    .length
  const know = questions.filter((question) => progress.questions[question.id]?.mark === 'know')
    .length
  const repeat = questions.filter(
    (question) => progress.questions[question.id]?.mark === 'repeat'
  ).length
  const hard = questions.filter((question) => progress.questions[question.id]?.mark === 'hard')
    .length

  const status: TestProgressStatus =
    marked >= total && total > 0 ? 'completed' : touched > 0 ? 'in-progress' : 'not-started'

  return {
    total,
    touched,
    marked,
    know,
    repeat,
    hard,
    status,
    progressPercent: total > 0 ? Math.round((marked / total) * 100) : 0,
  }
}

export function useTestCatalogProgress() {
  const [progress, setProgress] = useState<TestCatalogProgress>(() => readProgress())

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setProgress(readProgress())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const commit = useCallback((updater: (current: TestCatalogProgress) => TestCatalogProgress) => {
    setProgress((current) => {
      const next = updater(current)
      writeProgress(next)
      return next
    })
  }, [])

  const setAnswer = useCallback(
    (questionId: string, selectedIndex: number) => {
      commit((current) => ({
        ...current,
        questions: {
          ...current.questions,
          [questionId]: {
            ...current.questions[questionId],
            selectedIndex,
            updatedAt: new Date().toISOString(),
          },
        },
      }))
    },
    [commit]
  )

  const checkQuestion = useCallback(
    (questionId: string) => {
      commit((current) => ({
        ...current,
        questions: {
          ...current.questions,
          [questionId]: {
            ...current.questions[questionId],
            checked: true,
            updatedAt: new Date().toISOString(),
          },
        },
      }))
    },
    [commit]
  )

  const markQuestion = useCallback(
    (questionId: string, mark: QuestionProgressMark) => {
      commit((current) => ({
        ...current,
        questions: {
          ...current.questions,
          [questionId]: {
            ...current.questions[questionId],
            checked: true,
            mark,
            updatedAt: new Date().toISOString(),
          },
        },
      }))
    },
    [commit]
  )

  const getQuestionProgress = useCallback(
    (questionId: string) => progress.questions[questionId],
    [progress.questions]
  )

  const getSubtopicStats = useCallback(
    (subtopic: TestSubtopic) => getQuestionsStats(subtopic.questions, progress),
    [progress]
  )

  const getThemeStats = useCallback(
    (theme: TestTheme) => {
      const subtopics = getThemeSubtopics(theme)
      const questions = subtopics.flatMap((subtopic) => subtopic.questions)
      const questionStats = getQuestionsStats(questions, progress)
      const completedSubtopics = subtopics.filter(
        (subtopic) => getQuestionsStats(subtopic.questions, progress).status === 'completed'
      ).length

      return {
        ...questionStats,
        subtopicsTotal: subtopics.length,
        completedSubtopics,
      }
    },
    [progress]
  )

  const api = useMemo(
    () => ({
      progress,
      setAnswer,
      checkQuestion,
      markQuestion,
      getQuestionProgress,
      getSubtopicStats,
      getThemeStats,
    }),
    [
      checkQuestion,
      getQuestionProgress,
      getSubtopicStats,
      getThemeStats,
      markQuestion,
      progress,
      setAnswer,
    ]
  )

  return api
}

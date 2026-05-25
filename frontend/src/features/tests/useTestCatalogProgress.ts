import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getThemeSubtopics,
  type CatalogQuestion,
  type TestSubtopic,
  type TestTheme,
} from '@/entities/testCatalog'

export type TestProgressStatus = 'not-started' | 'in-progress' | 'completed'

interface QuestionProgress {
  selectedIndex?: number
  checked?: boolean
  updatedAt?: string
}

interface TestCatalogProgress {
  questions: Record<string, QuestionProgress>
}

const STORAGE_KEY = 'app.tests.catalog-progress'

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
  const checked = questions.filter((question) => progress.questions[question.id]?.checked).length

  const status: TestProgressStatus =
    checked >= total && total > 0 ? 'completed' : checked > 0 ? 'in-progress' : 'not-started'

  return {
    total,
    checked,
    status,
    progressPercent: total > 0 ? Math.round((checked / total) * 100) : 0,
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

  const completeSubtopicProgress = useCallback(
    (subtopic: TestSubtopic) => {
      commit((current) => {
        const questions = { ...current.questions }
        const updatedAt = new Date().toISOString()

        subtopic.questions.forEach((question) => {
          questions[question.id] = {
            ...questions[question.id],
            checked: true,
            updatedAt,
          }
        })

        return {
          ...current,
          questions,
        }
      })
    },
    [commit]
  )

  const resetSubtopicProgress = useCallback(
    (subtopic: TestSubtopic) => {
      commit((current) => {
        const questions = { ...current.questions }

        subtopic.questions.forEach((question) => {
          delete questions[question.id]
        })

        return {
          ...current,
          questions,
        }
      })
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
      completeSubtopicProgress,
      resetSubtopicProgress,
      getQuestionProgress,
      getSubtopicStats,
      getThemeStats,
    }),
    [
      checkQuestion,
      completeSubtopicProgress,
      getQuestionProgress,
      getSubtopicStats,
      getThemeStats,
      progress,
      resetSubtopicProgress,
      setAnswer,
    ]
  )

  return api
}

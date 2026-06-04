import { useCallback } from 'react'
import type { LiveCodingLanguage } from '@/entities/liveCoding'
import { useSyncedProgress } from '@/features/progress/useSyncedProgress'

interface LiveCodingProgress {
  solved: string[]
  favorites: string[]
  codeByTask: Record<string, Partial<Record<LiveCodingLanguage, string>>>
  submittedAt: Record<string, string>
}

const STORAGE_KEY = 'app.live-coding.progress'

const emptyProgress: LiveCodingProgress = {
  solved: [],
  favorites: [],
  codeByTask: {},
  submittedAt: {},
}

export function useLiveCodingProgress() {
  const { progress, commit } = useSyncedProgress<LiveCodingProgress>(
    'live-coding',
    STORAGE_KEY,
    emptyProgress
  )

  const isSolved = useCallback((taskId: string) => progress.solved.includes(taskId), [progress.solved])
  const isFavorite = useCallback(
    (taskId: string) => progress.favorites.includes(taskId),
    [progress.favorites]
  )

  const toggleFavorite = useCallback(
    (taskId: string) => {
      commit((current) => {
        const favorites = current.favorites.includes(taskId)
          ? current.favorites.filter((id) => id !== taskId)
          : [...current.favorites, taskId]

        return { ...current, favorites }
      })
    },
    [commit]
  )

  const markSolved = useCallback(
    (taskId: string) => {
      commit((current) => ({
        ...current,
        solved: current.solved.includes(taskId) ? current.solved : [...current.solved, taskId],
        submittedAt: { ...current.submittedAt, [taskId]: new Date().toISOString() },
      }))
    },
    [commit]
  )

  const saveCode = useCallback(
    (taskId: string, language: LiveCodingLanguage, code: string) => {
      commit((current) => ({
        ...current,
        codeByTask: {
          ...current.codeByTask,
          [taskId]: {
            ...current.codeByTask[taskId],
            [language]: code,
          },
        },
      }))
    },
    [commit]
  )

  const getSavedCode = useCallback(
    (taskId: string, language: LiveCodingLanguage) => progress.codeByTask[taskId]?.[language],
    [progress.codeByTask]
  )

  return {
    progress,
    isSolved,
    isFavorite,
    toggleFavorite,
    markSolved,
    saveCode,
    getSavedCode,
  }
}

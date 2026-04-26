import { useCallback, useEffect, useMemo, useState } from 'react'

interface RoadmapProgress {
  completedByRoadmap: Record<string, string[]>
}

const STORAGE_KEY = 'prepai.roadmap.progress'

const emptyProgress: RoadmapProgress = {
  completedByRoadmap: {},
}

function readProgress(): RoadmapProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress

    return { ...emptyProgress, ...JSON.parse(raw) } as RoadmapProgress
  } catch {
    return emptyProgress
  }
}

function writeProgress(progress: RoadmapProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useRoadmapProgress(roadmapSlug: string) {
  const [progress, setProgress] = useState<RoadmapProgress>(() => readProgress())

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setProgress(readProgress())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const commit = useCallback((updater: (current: RoadmapProgress) => RoadmapProgress) => {
    setProgress((current) => {
      const next = updater(current)
      writeProgress(next)
      return next
    })
  }, [])

  const completed = useMemo(
    () => progress.completedByRoadmap[roadmapSlug] ?? [],
    [progress.completedByRoadmap, roadmapSlug]
  )

  const isCompleted = useCallback(
    (nodeId: string) => completed.includes(nodeId),
    [completed]
  )

  const toggleNode = useCallback(
    (nodeId: string) => {
      commit((current) => {
        const existing = current.completedByRoadmap[roadmapSlug] ?? []
        const nextList = existing.includes(nodeId)
          ? existing.filter((id) => id !== nodeId)
          : [...existing, nodeId]

        return {
          ...current,
          completedByRoadmap: {
            ...current.completedByRoadmap,
            [roadmapSlug]: nextList,
          },
        }
      })
    },
    [commit, roadmapSlug]
  )

  const resetRoadmap = useCallback(() => {
    commit((current) => ({
      ...current,
      completedByRoadmap: {
        ...current.completedByRoadmap,
        [roadmapSlug]: [],
      },
    }))
  }, [commit, roadmapSlug])

  return {
    completed,
    isCompleted,
    toggleNode,
    resetRoadmap,
  }
}

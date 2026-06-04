import { useCallback, useMemo } from 'react'
import { useSyncedProgress } from '@/features/progress/useSyncedProgress'

interface RoadmapProgress {
  completedByRoadmap: Record<string, string[]>
}

const STORAGE_KEY = 'app.roadmap.progress'

const emptyProgress: RoadmapProgress = {
  completedByRoadmap: {},
}

export function useRoadmapProgress(roadmapSlug: string) {
  const { progress, commit } = useSyncedProgress<RoadmapProgress>(
    'roadmap',
    STORAGE_KEY,
    emptyProgress
  )

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

/**
 * Read-only view of completed nodes across *all* roadmaps — used by aggregate
 * dashboards (e.g. the stats page) that need a global learning-progress number.
 */
export function useAllRoadmapProgress() {
  const { progress } = useSyncedProgress<RoadmapProgress>('roadmap', STORAGE_KEY, emptyProgress)
  return progress.completedByRoadmap
}

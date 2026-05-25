export type RoadmapNodeKind = 'required' | 'alternative' | 'optional'

export interface RoadmapResource {
  title: string
  url: string
  source: string
  language?: 'ru' | 'en'
}

export interface RoadmapNode {
  id: string
  title: string
  summary: string
  kind: RoadmapNodeKind
  resources?: RoadmapResource[]
}

export interface RoadmapStage {
  id: string
  title: string
  intro: string
  nodes: RoadmapNode[]
}

export interface Roadmap {
  slug: string
  title: string
  summary: string
  description: string
  accent: string
  stages: RoadmapStage[]
}

export const KIND_LABELS: Record<RoadmapNodeKind, string> = {
  required: 'База',
  alternative: 'Альтернатива',
  optional: 'По желанию',
}

export function getRoadmapNodeCount(roadmap: Roadmap) {
  return roadmap.stages.reduce((sum, stage) => sum + stage.nodes.length, 0)
}

export function getRoadmapRequiredCount(roadmap: Roadmap) {
  return roadmap.stages.reduce(
    (sum, stage) => sum + stage.nodes.filter((node) => node.kind === 'required').length,
    0
  )
}

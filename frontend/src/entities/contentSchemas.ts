import { z } from 'zod'
import type { ContentEntryType } from '@/entities/types'

/**
 * Zod schemas mirroring the entity payload contracts (roadmap.ts / liveCoding.ts /
 * testCatalog.ts). Used by the admin content form to validate the JSON payload by
 * shape — not just "is it an object" — so broken content is rejected before it can
 * crash the public pages that consume `entry.payload`.
 *
 * Objects are non-strict (extra keys are tolerated/stripped), so they won't reject
 * future fields; they only enforce the required structure.
 */

const difficulty = z.enum(['easy', 'medium', 'hard'])

// ── test_catalog_theme ────────────────────────────────────────────────────────
const catalogQuestionSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correctIndex: z.number().int().min(0),
    explanation: z.string(),
    difficulty,
  })
  .refine((q) => q.correctIndex < q.options.length, {
    message: 'correctIndex выходит за пределы options',
    path: ['correctIndex'],
  })

const testSubtopicSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  difficulty,
  questions: z.array(catalogQuestionSchema).min(1),
})

const testSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  subtopics: z.array(testSubtopicSchema).min(1),
})

export const testThemePayloadSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  description: z.string(),
  icon: z.string().optional(),
  category: z.string().optional(),
  sections: z.array(testSectionSchema).min(1),
})

// ── roadmap ───────────────────────────────────────────────────────────────────
const roadmapResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  source: z.string(),
  language: z.enum(['ru', 'en']).optional(),
})

const roadmapNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  kind: z.enum(['required', 'alternative', 'optional']),
  resources: z.array(roadmapResourceSchema).optional(),
})

const roadmapStageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  intro: z.string(),
  nodes: z.array(roadmapNodeSchema).min(1),
})

export const roadmapPayloadSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  description: z.string(),
  accent: z.string(),
  stages: z.array(roadmapStageSchema).min(1),
})

// ── live_coding_task ──────────────────────────────────────────────────────────
const liveExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
})

const liveTestSchema = z.object({
  title: z.string(),
  input: z.string(),
  expected: z.string(),
  assertion: z.string(),
})

export const liveCodingPayloadSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string(),
  difficulty,
  companies: z.array(z.string()),
  successRate: z.number(),
  estimatedMinutes: z.number(),
  languages: z.array(z.enum(['javascript', 'typescript'])).min(1),
  description: z.string(),
  constraints: z.array(z.string()),
  examples: z.array(liveExampleSchema),
  starterCode: z.record(z.string(), z.string()),
  tests: z.array(liveTestSchema),
  solutionNotes: z.array(z.string()),
})

export const payloadSchemaByType: Record<ContentEntryType, z.ZodTypeAny> = {
  test_catalog_theme: testThemePayloadSchema,
  roadmap: roadmapPayloadSchema,
  live_coding_task: liveCodingPayloadSchema,
}

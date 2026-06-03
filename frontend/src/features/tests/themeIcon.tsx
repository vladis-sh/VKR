import {
  BookOpen,
  Boxes,
  Braces,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe2,
  Network,
  Server,
  Sigma,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import type { TestTheme } from '@/entities/testCatalog'

// Curated lucide icons addressable from theme content via payload `icon` (by name).
const LUCIDE_BY_NAME: Record<string, LucideIcon> = {
  Database,
  Sigma,
  BookOpen,
  Network,
  GitBranch,
  Braces,
  Code,
  Cpu,
  Server,
  Globe: Globe2,
  Boxes,
  Terminal,
}

// Back-compat: seeded themes that don't carry an `icon` in payload yet.
const LUCIDE_BY_SLUG: Record<string, LucideIcon> = {
  databases: Database,
  algorithms: Sigma,
  javascript: Braces,
  python: Terminal,
  networks: Network,
  git: GitBranch,
  'frontend-core': Code,
  'typescript-deep': Braces,
  'react-next': Boxes,
  'backend-node': Server,
  'postgres-production': Database,
  'advanced-algorithms': Sigma,
  'system-design': Globe2,
}

/**
 * Resolves a theme's icon: explicit payload `icon` (lucide name or emoji) →
 * slug map → BookOpen fallback. Shared by the catalog and theme pages.
 */
export function renderThemeIcon(theme: TestTheme, size = 22): React.ReactNode {
  const icon = theme.icon?.trim()
  if (icon) {
    const Named = LUCIDE_BY_NAME[icon]
    if (Named) return <Named size={size} />
    // Otherwise treat as an emoji / short glyph.
    return <span className="leading-none" style={{ fontSize: size }}>{icon}</span>
  }

  const BySlug = LUCIDE_BY_SLUG[theme.slug] ?? BookOpen
  return <BySlug size={size} />
}

import {
  BarChart2,
  ClipboardList,
  Code2,
  Map,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  /** Full label used in the desktop sidebar. */
  label: string
  /** Compact label used in the mobile bottom navigation. */
  shortLabel: string
  icon: LucideIcon
}

/**
 * Single source of truth for the primary navigation so the sidebar and bottom
 * nav never drift apart. Add a route here once and both surfaces pick it up.
 */
export const MAIN_NAV: NavItem[] = [
  { to: '/app/roadmaps', label: 'План подготовки', shortLabel: 'План', icon: Map },
  { to: '/app/chat', label: 'Чат с ИИ', shortLabel: 'Чат', icon: MessageSquare },
  { to: '/app/tests', label: 'Тесты', shortLabel: 'Тесты', icon: ClipboardList },
  { to: '/app/live-coding', label: 'Live Coding', shortLabel: 'Код', icon: Code2 },
  { to: '/app/stats', label: 'Статистика', shortLabel: 'Статы', icon: BarChart2 },
]

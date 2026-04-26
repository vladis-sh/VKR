import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AppLayout } from '@/widgets/AppLayout'

// Pages - lazy loaded for better performance
import { lazy, Suspense } from 'react'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'

const LandingPage = lazy(() => import('@/pages/landing/LandingPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterStep1Page = lazy(() => import('@/pages/auth/RegisterStep1Page'))
const RegisterStep2Page = lazy(() => import('@/pages/auth/RegisterStep2Page'))
const MaterialsPage = lazy(() => import('@/pages/materials/MaterialsPage'))
const FavoritesPage = lazy(() => import('@/pages/materials/FavoritesPage'))
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'))
const TestsHubPage = lazy(() => import('@/pages/tests/TestsHubPage'))
const TopicsPage = lazy(() => import('@/pages/tests/TopicsPage'))
const TestThemePage = lazy(() => import('@/pages/tests/TestThemePage'))
const SubtopicTestPage = lazy(() => import('@/pages/tests/SubtopicTestPage'))
const TestSessionPage = lazy(() => import('@/pages/tests/TestSessionPage'))
const TestResultsPage = lazy(() => import('@/pages/tests/TestResultsPage'))
const TestHistoryPage = lazy(() => import('@/pages/tests/TestHistoryPage'))
const LiveCodingPage = lazy(() => import('@/pages/live-coding/LiveCodingPage'))
const LiveCodingTaskPage = lazy(() => import('@/pages/live-coding/LiveCodingTaskPage'))
const RoadmapsPage = lazy(() => import('@/pages/roadmaps/RoadmapsPage'))
const RoadmapDetailPage = lazy(() => import('@/pages/roadmaps/RoadmapDetailPage'))
const StatsPage = lazy(() => import('@/pages/stats/StatsPage'))
const LeaderboardPage = lazy(() => import('@/pages/leaderboard/LeaderboardPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const EditProfilePage = lazy(() => import('@/pages/profile/EditProfilePage'))
const ProfileHistoryPage = lazy(() => import('@/pages/profile/ProfileHistoryPage'))
const NotificationsPage = lazy(() => import('@/pages/profile/NotificationsPage'))

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyWrapper><LandingPage /></LazyWrapper>,
  },
  {
    path: '/login',
    element: <LazyWrapper><LoginPage /></LazyWrapper>,
  },
  {
    path: '/register',
    element: <LazyWrapper><RegisterStep1Page /></LazyWrapper>,
  },
  {
    path: '/register/profile',
    element: <LazyWrapper><RegisterStep2Page /></LazyWrapper>,
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/materials" replace />,
      },
      {
        path: 'materials',
        element: <LazyWrapper><MaterialsPage /></LazyWrapper>,
      },
      {
        path: 'materials/favorites',
        element: <LazyWrapper><FavoritesPage /></LazyWrapper>,
      },
      {
        path: 'chat',
        element: <LazyWrapper><ChatPage /></LazyWrapper>,
      },
      {
        path: 'tests',
        element: <LazyWrapper><TestsHubPage /></LazyWrapper>,
      },
      {
        path: 'tests/topics',
        element: <LazyWrapper><TopicsPage /></LazyWrapper>,
      },
      {
        path: 'tests/theme/:themeSlug',
        element: <LazyWrapper><TestThemePage /></LazyWrapper>,
      },
      {
        path: 'tests/theme/:themeSlug/:subtopicSlug',
        element: <LazyWrapper><SubtopicTestPage /></LazyWrapper>,
      },
      {
        path: 'tests/topic/:slug',
        element: <LazyWrapper><TestSessionPage mode="topic" /></LazyWrapper>,
      },
      {
        path: 'tests/time-attack',
        element: <LazyWrapper><TestSessionPage mode="time-attack" /></LazyWrapper>,
      },
      {
        path: 'tests/one-mistake',
        element: <LazyWrapper><TestSessionPage mode="one-mistake" /></LazyWrapper>,
      },
      {
        path: 'tests/ai',
        element: <LazyWrapper><TestSessionPage mode="ai" /></LazyWrapper>,
      },
      {
        path: 'tests/results/:sessionId',
        element: <LazyWrapper><TestResultsPage /></LazyWrapper>,
      },
      {
        path: 'tests/history/:sessionId',
        element: <LazyWrapper><TestHistoryPage /></LazyWrapper>,
      },
      {
        path: 'live-coding',
        element: <LazyWrapper><LiveCodingPage /></LazyWrapper>,
      },
      {
        path: 'live-coding/:slug',
        element: <LazyWrapper><LiveCodingTaskPage /></LazyWrapper>,
      },
      {
        path: 'roadmaps',
        element: <LazyWrapper><RoadmapsPage /></LazyWrapper>,
      },
      {
        path: 'roadmaps/:slug',
        element: <LazyWrapper><RoadmapDetailPage /></LazyWrapper>,
      },
      {
        path: 'stats',
        element: <LazyWrapper><StatsPage /></LazyWrapper>,
      },
      {
        path: 'leaderboard',
        element: <LazyWrapper><LeaderboardPage /></LazyWrapper>,
      },
      {
        path: 'profile',
        element: <LazyWrapper><ProfilePage /></LazyWrapper>,
      },
      {
        path: 'profile/edit',
        element: <LazyWrapper><EditProfilePage /></LazyWrapper>,
      },
      {
        path: 'profile/history',
        element: <LazyWrapper><ProfileHistoryPage /></LazyWrapper>,
      },
      {
        path: 'profile/notifications',
        element: <LazyWrapper><NotificationsPage /></LazyWrapper>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

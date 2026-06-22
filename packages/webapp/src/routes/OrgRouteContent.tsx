import ApiPage from '@/apps/pages/ApiPage'
import AppsPage from '@/apps/pages/AppsPage'
import CirclesPage from '@/circle/pages/CirclesPage'
import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import Page404 from '@/common/pages/Page404'
import DashboardPage from '@/dashboard/pages/DashboardPage'
import DecisionPage from '@/decision/pages/DecisionPage '
import SettingsLayout from '@/layout/components/SettingsLayout'
import LogsPage from '@/log/pages/LogsPage'
import MeetingPage from '@/meeting/pages/MeetingPage'
import MeetingRecurringPage from '@/meeting/pages/MeetingRecurringPage'
import { useSubscribeCurrentMeeting } from '@/member/hooks/useSubscribeCurrentMeeting'
import MembersPage from '@/member/pages/MembersPage'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ExportPage from '@/org/pages/ExportPage'
import OrgSettingsPage from '@/org/pages/OrgSettingsPage'
import TaskPage from '@/task/pages/TaskPage'
import TasksPage from '@/task/pages/TasksPage'
import ThreadPage from '@/thread/pages/ThreadPage'
import ThreadsPage from '@/thread/pages/ThreadsPage'
import CredentialsSettingsPage from '@/user/pages/CredentialsSettingsPage'
import NotificationsSettingsPage from '@/user/pages/NotificationsSettingsPage'
import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'

// Lazy pages
const MeetingsPage = lazy(() => import('@/meeting/pages/MeetingsPage'))
const SubscriptionPage = lazy(
  () => import('@/orgSubscription/pages/SubscriptionPage')
)
const CircleExportPage = lazy(() => import('@/circle/pages/CircleExportPage'))

// Renders the org pages once the org data is provided by DbOrgProvider.
export default function OrgRouteContent() {
  const { org, loading, error } = useOrgContext()

  // Update current meeting in store
  useSubscribeCurrentMeeting()

  return (
    <Suspense fallback={<Loading active center />}>
      <Loading center active={loading} />
      {error && <TextError error={error} />}

      {!org && !loading ? (
        <Page404 />
      ) : (
        <Routes>
          <Route index element={<Navigate to="news" replace />} />
          <Route path="roles" element={<CirclesPage />} />
          <Route path="news" element={<DashboardPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="threads/:threadId" element={<ThreadPage />} />
          <Route path="threads" element={<ThreadsPage />} />
          <Route path="meetings/:meetingId" element={<MeetingPage />} />
          <Route
            path="meetings-recurring/:id"
            element={<MeetingRecurringPage />}
          />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="tasks/:taskId" element={<TaskPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="decisions/:decisionId" element={<DecisionPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="export-circle" element={<CircleExportPage />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route path="org" element={<OrgSettingsPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="api-keys" element={<ApiPage />} />
            <Route path="export" element={<ExportPage />} />
            <Route path="credentials" element={<CredentialsSettingsPage />} />
            <Route path="notifications" element={<NotificationsSettingsPage />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
    </Suspense>
  )
}

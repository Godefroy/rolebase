import ApiPage from '@/apps/pages/ApiPage'
import AppsPage from '@/apps/pages/AppsPage'
import OAuthRedirectPage from '@/apps/pages/OAuthRedirectPage'
import CrispSetUser from '@/common/atoms/CrispSetUser'
import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import Page404 from '@/common/pages/Page404'
import SuperAdminRoutes from './SuperAdminRoutes'
import LoggedLayout from '@/layout/components/LoggedLayout'
import SettingsLayout from '@/layout/components/SettingsLayout'
import MemberInvitationPage from '@/member/pages/MemberInvitationPage'
import Onboarding from '@/onboarding/components/Onboarding'
import ImportPage from '@/org/pages/ImportPage'
import OrgsPage from '@/org/pages/OrgsPage'
import { useAuth } from '@/user/hooks/useAuth'
import useSuperAdmin from '@/user/hooks/useSuperAdmin'
import VerifyEmailModal from '@/user/modals/VerifiyEmailModal'
import CredentialsSettingsPage from '@/user/pages/CredentialsSettingsPage'
import NotificationsSettingsPage from '@/user/pages/NotificationsSettingsPage'
import { App_Type_Enum, useOrgsSubscription } from '@gql'
import { useStoreActions } from '@store/hooks'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router'
import { langs, locales } from 'src/i18n'
import OrgRoute from './OrgRoute'

export default function PrivateRoute() {
  const superAdmin = useSuperAdmin()
  const { user } = useAuth()
  const {
    i18n: { changeLanguage },
  } = useTranslation()

  // Update translation language with user's locale in DB
  useEffect(() => {
    if (
      user &&
      user.locale &&
      langs.includes(user.locale as keyof typeof locales)
    ) {
      changeLanguage(user.locale)
    }
  }, [])

  // Subscribe to orgs
  const result = useOrgsSubscription({
    skip: !user,
    variables: { userId: user!.id },
  })
  const setSubscriptionResult = useStoreActions(
    (actions) => actions.orgs.setSubscriptionResult
  )
  useEffect(() => {
    setSubscriptionResult({
      entries: result.data?.member.map((m) => m.org),
      loading: result.loading,
      error: result.error,
    })
  }, [result])

  return (
    <LoggedLayout>
      <Loading center active={result.loading} />
      {result.error && <TextError error={result.error} />}

      <Routes>
        <Route index element={<OrgsPage />} />
        <Route
          path="orgs/:orgId/invitation"
          element={<MemberInvitationPage />}
        />

        <Route path="login" element={<Navigate to="/" />} />
        <Route path="reset-password" element={<Navigate to="/" />} />
        <Route path="signup" element={<Navigate to="/" />} />
        <Route path="import" element={<ImportPage />} />

        <Route path="orgs/:orgId/*" element={<OrgRoute />} />

        <Route path="settings" element={<SettingsLayout />}>
          <Route path="apps" element={<AppsPage />} />
          <Route path="api-keys" element={<ApiPage />} />
          <Route path="credentials" element={<CredentialsSettingsPage />} />
          <Route path="notifications" element={<NotificationsSettingsPage />} />
        </Route>

        {superAdmin && SuperAdminRoutes()}

        <Route path="apps" element={<Navigate to="/settings/apps" replace />} />

        <Route
          path="apps/office365-auth-redirect"
          element={<OAuthRedirectPage type={App_Type_Enum.Office365} />}
        />
        <Route
          path="apps/googlecalendar-auth-redirect"
          element={<OAuthRedirectPage type={App_Type_Enum.GoogleCalendar} />}
        />
        <Route path=":slug/*" element={<OrgRoute />} />

        <Route path="*" element={<Page404 />} />
      </Routes>

      <CrispSetUser />
      <VerifyEmailModal />
      <Onboarding />
    </LoggedLayout>
  )
}

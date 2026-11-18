import { createAPIClient, type Session } from '@nhost/nhost-js/auth'
import useConfirmModal from '@/common/hooks/useConfirmModal'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { nhost } from 'src/nhost'

// Remove the token from the address bar and the history entry
function removeRefreshTokenFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('refreshToken')
  window.history.replaceState(window.history.state, '', url.toString())
}

// Nhost email links (password reset, sign-in link, email verification or
// change) redirect with ?refreshToken=. A link can also be crafted to sign
// someone into another account, so switching account needs a confirmation.
export default function useRefreshTokenFromUrl() {
  const { t } = useTranslation()
  const { confirm, confirmElement } = useConfirmModal()

  useEffect(() => {
    const refreshToken = new URLSearchParams(window.location.search).get(
      'refreshToken'
    )
    if (!refreshToken) return
    removeRefreshTokenFromUrl()

    // Auth client without the session middleware, so the new session is only
    // stored once accepted
    const auth = createAPIClient(nhost.auth.baseURL)

    const handleSession = (newSession: Session) => {
      const currentUser = nhost.getUserSession()?.user
      if (!currentUser || currentUser.id === newSession.user?.id) {
        nhost.sessionStorage.set(newSession)
        return
      }
      confirm({
        heading: t('useRefreshTokenFromUrl.heading'),
        info: t('useRefreshTokenFromUrl.info', {
          newEmail: newSession.user?.email,
          currentEmail: currentUser.email,
        }),
        buttonLabel: t('useRefreshTokenFromUrl.confirm'),
        buttonColor: 'blue',
        onConfirm: () => nhost.sessionStorage.set(newSession),
        // Revoke the session of the link
        onCancel: () => {
          auth
            .signOut({ refreshToken: newSession.refreshToken })
            .catch(() => {})
        },
      })
    }

    auth
      .refreshToken({ refreshToken })
      .then(({ body }) => handleSession(body))
      .catch((error) => console.error('Invalid refresh token in URL', error))
  }, [])

  return confirmElement
}

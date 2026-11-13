import { type Session } from '@nhost/nhost-js/auth'
import { useToast } from '@chakra-ui/react'
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { identify, track } from 'src/analytics'
import { nhost } from 'src/nhost'

export interface AuthContextType {
  user: Session['user'] | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

// Set by Nhost on the redirect after a link from an email
const linkType = new URLSearchParams(window.location.search).get('type')

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [user, setUser] = useState<Session['user'] | null>(null)

  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const currentSession = nhost.getUserSession()
    setUser(currentSession?.user || null)
    setSession(currentSession)
    setIsAuthenticated(!!currentSession)
    setIsLoading(false)

    // The stored session keeps the user as of its last refresh: refresh it
    // once on load to catch changes made elsewhere (email marked unverified
    // after a bounce, verified from another device)
    if (currentSession) nhost.refreshSession(0).catch(() => {})

    const unsubscribe = nhost.sessionStorage.onChange((currentSession) => {
      setUser(currentSession?.user || null)
      setSession(currentSession)
      setIsAuthenticated(!!currentSession)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Who is in the session: the onboarding answers already collected in the
  // user metadata, never the user id, email or name (see the privacy policy).
  useEffect(() => {
    if (!user) return
    identify({
      locale: user.locale,
      emailVerified: user.emailVerified,
      onboardingRole: user.metadata?.onboardingRole as string | undefined,
      onboardingObjective: user.metadata?.onboardingObjective as
        string | undefined,
      onboardingSource: user.metadata?.onboardingSource as string | undefined,
    })
  }, [user?.id, user?.emailVerified, user?.metadata])

  // Verification happens through an email link, so the flag flips on a session
  // refresh rather than on a user action in this tab. A link opened without a
  // stored session is told by the redirect's type.
  const wasEmailVerified = useRef<boolean>()
  const linkToastShown = useRef(false)
  useEffect(() => {
    if (!user) return
    const previous = wasEmailVerified.current
    wasEmailVerified.current = user.emailVerified
    const flipped = previous === false && user.emailVerified
    if (flipped) track('auth_email_verified')

    const fromLink =
      !linkToastShown.current &&
      user.emailVerified &&
      (linkType === 'emailVerify' || linkType === 'emailConfirmChange')
    if (!flipped && !fromLink) return
    linkToastShown.current = true
    toast({
      title: t(
        linkType === 'emailConfirmChange'
          ? 'AuthProvider.emailChanged'
          : 'AuthProvider.emailVerified'
      ),
      status: 'success',
      duration: 10000,
      isClosable: true,
    })
  }, [user?.id, user?.emailVerified])

  // Refresh token when receiving query param "refreshToken" (reset password)
  useEffect(() => {
    const refreshToken = new URLSearchParams(window.location.search).get(
      'refreshToken'
    )
    if (refreshToken) {
      nhost.auth.refreshToken({ refreshToken })
    }
  }, [])

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

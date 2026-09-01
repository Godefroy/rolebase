import { type Session } from '@nhost/nhost-js/auth'
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { identify, track } from 'src/analytics'
import { nhost } from 'src/nhost'

export interface AuthContextType {
  user: Session['user'] | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

    const unsubscribe = nhost.sessionStorage.onChange((currentSession) => {
      setUser(currentSession?.user || null)
      setSession(currentSession)
      setIsAuthenticated(!!currentSession)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Who is in the session, in pseudonymous form: user id and the onboarding
  // answers already collected in the user metadata, never the email or name.
  useEffect(() => {
    if (!user) return
    identify({
      userId: user.id,
      locale: user.locale,
      emailVerified: user.emailVerified,
      onboardingRole: user.metadata?.onboardingRole as string | undefined,
      onboardingObjective: user.metadata?.onboardingObjective as
        | string
        | undefined,
      onboardingSource: user.metadata?.onboardingSource as string | undefined,
    })
  }, [user?.id, user?.emailVerified, user?.metadata])

  // Verification happens through an email link, so the flag flips on a session
  // refresh rather than on a user action in this tab.
  const wasEmailVerified = useRef<boolean>()
  useEffect(() => {
    if (!user) return
    const previous = wasEmailVerified.current
    wasEmailVerified.current = user.emailVerified
    if (previous === false && user.emailVerified) track('auth_email_verified')
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

import { type Session } from '@nhost/nhost-js/auth'
import { nhost } from 'src/nhost'
import { trpc } from 'src/trpc'

const storageKey = 'impersonation'

export interface Impersonation {
  adminSession: Session
  userName: string
}

export function getImpersonation(): Impersonation | null {
  const value = localStorage.getItem(storageKey)
  if (!value) return null
  try {
    return JSON.parse(value) as Impersonation
  } catch {
    localStorage.removeItem(storageKey)
    return null
  }
}

// Signing in as the target user replaces the super admin session, so it is kept
// aside to be restored when impersonation stops.
export async function startImpersonation(userId: string, userName: string) {
  const adminSession = nhost.getUserSession()
  if (!adminSession) {
    throw new Error('No session to come back to')
  }

  const { personalAccessToken } = await trpc.superAdmin.impersonate.mutate({
    userId,
  })

  localStorage.setItem(storageKey, JSON.stringify({ adminSession, userName }))
  try {
    // Stores the impersonated session, replacing the super admin one
    await nhost.auth.signInPAT({ personalAccessToken })
  } catch (error) {
    localStorage.removeItem(storageKey)
    throw error
  }

  // Reload instead of navigating: Apollo cache, store and subscriptions still
  // hold the super admin's data. "/orgs" rather than "/", which Netlify
  // redirects to the website.
  window.location.href = '/orgs'
}

export function stopImpersonation() {
  const impersonation = getImpersonation()
  localStorage.removeItem(storageKey)

  if (impersonation) {
    nhost.sessionStorage.set(impersonation.adminSession)
  } else {
    nhost.sessionStorage.remove()
  }

  window.location.href = '/admin/users'
}

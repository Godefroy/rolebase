// Addresses the email provider recently failed to deliver to, so the sign-in
// screen can tell an address that doesn't exist right away. Kept in memory
// (single backend replica): an entry only matters while the person waits for
// their code, and a restart losing them only delays the hint.

const TTL_MS = 60 * 60 * 1000
const MAX_ENTRIES = 1000
const bounces = new Map<string, number>()

export function recordBounce(email: string, at = Date.now()) {
  const key = email.trim().toLowerCase()
  // Refresh the entry's position, then drop the oldest one when full (a Map
  // iterates in insertion order)
  bounces.delete(key)
  if (bounces.size >= MAX_ENTRIES) bounces.delete(bounces.keys().next().value!)
  bounces.set(key, at)
}

// Bounced at or after `since` (ms), within the last hour
export function hasBounced(email: string, since: number): boolean {
  const at = bounces.get(email.trim().toLowerCase())
  if (at === undefined) return false
  if (at < Date.now() - TTL_MS) {
    bounces.delete(email.trim().toLowerCase())
    return false
  }
  return at >= since
}

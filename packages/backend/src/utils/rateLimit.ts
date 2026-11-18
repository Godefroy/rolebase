import { TRPCError } from '@trpc/server'

interface RateLimitOptions {
  max: number
  windowMs: number
}

// In-memory sliding window rate limiter, enough for the single backend
// replica. Returns a function that throws TOO_MANY_REQUESTS when a key
// exceeds max hits in the window.
export function createRateLimiter({ max, windowMs }: RateLimitOptions) {
  const hits = new Map<string, number[]>()

  return function hit(key: string, now = Date.now()) {
    const recent = (hits.get(key) || []).filter((t) => t > now - windowMs)

    // Drop expired keys so the map does not grow forever
    if (hits.size > 10_000) {
      for (const [k, times] of hits) {
        if (times[times.length - 1] <= now - windowMs) hits.delete(k)
      }
    }

    if (recent.length >= max) {
      hits.set(key, recent)
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later',
      })
    }
    recent.push(now)
    hits.set(key, recent)
  }
}

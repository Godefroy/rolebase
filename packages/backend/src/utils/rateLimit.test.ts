import { describe, expect, it } from 'vitest'
import { createRateLimiter } from './rateLimit'

describe('createRateLimiter', () => {
  it('limits hits per key in the window', () => {
    const hit = createRateLimiter({ max: 2, windowMs: 1000 })
    hit('a', 0)
    hit('a', 10)
    expect(() => hit('a', 20)).toThrow('Too many requests')
    // Other keys are independent
    expect(() => hit('b', 20)).not.toThrow()
    // Window slides
    expect(() => hit('a', 1001)).not.toThrow()
  })
})
